import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { WebsiteProject } from "@/models/WebsiteProject";
import { getProductBySlug } from "@/config/products";
import { isRazorpayConfigured, createRazorpayOrder } from "@/lib/razorpay";
import { getManualUpiConfig, generateUpiIntentUri } from "@/lib/upi";
import { getCustomerSession } from "@/lib/auth";
import { getPlatformSettings } from "@/models/PlatformSettings";

const CreateOrderInputSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Customer name must be at least 2 characters").trim(),
    email: z.string().email("Valid customer email is required").toLowerCase().trim(),
    phone: z.string().min(8, "Valid phone number is required").trim(),
  }),
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1, "Product slug is required"),
        selectedTheme: z.string().min(1, "Theme selection is required"),
        quantity: z.number().int().positive().default(1),
      })
    )
    .min(1, "At least one gift item is required"),
  paymentMethod: z.enum(["razorpay", "manual_upi"]).default("manual_upi"),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = CreateOrderInputSchema.parse(body);

    await connectToDatabase();

    const customerSession = await getCustomerSession(req);

    // Validate project ownership if projectId is provided
    if (validated.projectId) {
      const project = await WebsiteProject.findById(validated.projectId);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      if (customerSession) {
        const ownsProject =
          (project.customerId && project.customerId.toString() === customerSession.userId) ||
          (project.customerEmail && project.customerEmail.toLowerCase() === customerSession.email.toLowerCase());
        if (!ownsProject) {
          return NextResponse.json(
            { error: "Unauthorized: You do not have permission to checkout this project." },
            { status: 401 }
          );
        }
      } else if (project.customerId) {
        return NextResponse.json(
          { error: "Unauthorized: Please log in to your customer account to checkout this project." },
          { status: 401 }
        );
      }
    }

    // 1. Server-Side Price & Product Calculation (Never trust client price)
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of validated.items) {
      const product = getProductBySlug(item.productSlug);
      if (!product) {
        return NextResponse.json(
          { error: `Invalid product: '${item.productSlug}' does not exist in catalog.` },
          { status: 400 }
        );
      }

      // Verify theme belongs to product
      const themeExists = product.themes.some((t) => t.id === item.selectedTheme);
      if (!themeExists) {
        return NextResponse.json(
          {
            error: `Invalid theme: '${item.selectedTheme}' is not available for product '${product.title}'.`,
          },
          { status: 400 }
        );
      }

      const qty = item.quantity || 1;
      const itemTotal = product.price * qty;
      totalAmount += itemTotal;

      validatedItems.push({
        productSlug: product.slug,
        occasionType: product.occasionType,
        title: product.title,
        price: product.price,
        selectedTheme: item.selectedTheme,
        quantity: qty,
      });
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Order total must be greater than zero." }, { status: 400 });
    }

    // 2. Generate unique human-readable order number
    const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();
    const orderNumber = `EM-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 3. Generate cryptographically secure access token and its SHA-256 hash
    const rawAccessToken = crypto.randomBytes(32).toString("hex");
    const accessTokenHash = crypto.createHash("sha256").update(rawAccessToken).digest("hex");

    let razorpayOrderId: string | undefined = undefined;

    // 4. Handle Razorpay initialization if chosen
    if (validated.paymentMethod === "razorpay") {
      if (isRazorpayConfigured()) {
        try {
          const rzpOrder = await createRazorpayOrder({
            amountInINR: totalAmount,
            orderNumber,
            notes: {
              customerEmail: validated.customer.email,
              customerName: validated.customer.name,
            },
          });
          razorpayOrderId = rzpOrder.id;
        } catch (rzpErr: any) {
          console.error("Razorpay order creation failed:", rzpErr);
          return NextResponse.json(
            { error: "Failed to initialize payment with Razorpay. Please try again or use UPI." },
            { status: 502 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Razorpay payment gateway is not configured on the server." },
          { status: 503 }
        );
      }
    }

    // 5. Create Order document in MongoDB Atlas
    const newOrder = await Order.create({
      orderNumber,
      customerId: customerSession ? customerSession.userId : undefined,
      customer: validated.customer,
      items: validatedItems,
      projectId: validated.projectId || undefined,
      totalAmount,
      currency: "INR",
      paymentMethod: validated.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "placed",
      razorpayDetails: razorpayOrderId ? { razorpayOrderId } : {},
      accessToken: rawAccessToken,
      accessTokenHash,
      auditTrail: [
        {
          action: "ORDER_CREATED",
          timestamp: new Date(),
          actor: `customer:${validated.customer.email}`,
          details: {
            paymentMethod: validated.paymentMethod,
            totalAmount,
            itemCount: validatedItems.length,
          },
        },
      ],
    });

    const settings = await getPlatformSettings();
    const upiConfig = getManualUpiConfig(settings?.manualUpiConfig);
    const upiIntentUri = generateUpiIntentUri({
      upiId: upiConfig.upiId,
      payeeName: upiConfig.payeeName,
      amountInINR: totalAmount,
      orderNumber,
    });

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder._id.toString(),
        orderNumber,
        totalAmount,
        currency: "INR",
        paymentMethod: validated.paymentMethod,
        accessToken: rawAccessToken,
        razorpayOrderId,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "",
        manualUpi: {
          upiId: upiConfig.upiId,
          payeeName: upiConfig.payeeName,
          qrImageUrl: upiConfig.qrImageUrl,
          intentUri: upiIntentUri,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json({ error: error.issues?.[0]?.message || "Invalid order input" }, { status: 400 });
    }
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
