import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { WebsiteProject } from "@/models/WebsiteProject";
import { Order } from "@/models/Order";
import { getPlatformSettings } from "@/models/PlatformSettings";
import { getEffectivePricing } from "@/lib/pricing";
import { getAdminSession, getCustomerSession, hashPassword } from "@/lib/auth";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";
import { getManualUpiConfig, generateUpiIntentUri } from "@/lib/upi";

interface Context {
  params: Promise<{ id: string }>;
}

const CheckoutSchema = z.object({
  paymentMethod: z.enum(["razorpay", "manual_upi"]),
  includeCustomDomain: z.boolean().default(false),
  customDomainName: z.string().trim().optional(),
  isPasswordProtected: z.boolean().default(false),
  websitePassword: z.string().min(3).optional(),
  passwordHint: z.string().optional(),
  customer: z
    .object({
      name: z.string().trim().min(2),
      email: z.string().trim().email(),
      phone: z.string().trim().min(8),
    })
    .optional(),
});

export async function POST(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    let project = await WebsiteProject.findById(id);
    if (!project) {
      project = await WebsiteProject.findOne({ slug: id });
    }

    if (!project) {
      return NextResponse.json({ error: "Website project not found" }, { status: 404 });
    }

    // 1. Authorization check: Checkout is strictly a customer-owner operation
    const customerSession = await getCustomerSession(req);

    const isOwner = Boolean(
      customerSession &&
        (project.customerId?.toString() === customerSession.userId ||
          (project.customerEmail &&
            project.customerEmail.toLowerCase() === customerSession.email.toLowerCase()))
    );

    if (!isOwner) {
      return NextResponse.json(
        { error: "Unauthorized. Only the verified customer project owner can initiate checkout." },
        { status: 403 }
      );
    }

    // 2. Check if project is already paid
    if (project.paymentStatus === "paid") {
      return NextResponse.json(
        {
          error: "This website has already been paid for. You can publish directly.",
          alreadyPaid: true,
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = CheckoutSchema.parse(body);

    // 3. Validate custom domain name if selected
    if (validated.includeCustomDomain) {
      if (!validated.customDomainName) {
        return NextResponse.json(
          { error: "Please enter your desired custom domain name." },
          { status: 400 }
        );
      }
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
      if (!domainRegex.test(validated.customDomainName.trim())) {
        return NextResponse.json(
          { error: "Invalid domain format. Example: riyaandrahul.com or ourlovestory.in" },
          { status: 400 }
        );
      }
    }

    // 4. Server-Authoritative Price Calculation from PlatformSettings & Product Catalog
    const settings = await getPlatformSettings();
    const { productPrice, basePrice, customDomainPrice, effectivePricing } = await getEffectivePricing(
      project.occasionType || "apology"
    );
    const domainPrice = validated.includeCustomDomain ? customDomainPrice : 0;
    const totalAmount = productPrice + domainPrice;

    // 5. Customer contact details
    const customerName =
      validated.customer?.name || customerSession?.name || project.senderName || "Valued Customer";
    const customerEmail =
      validated.customer?.email || customerSession?.email || project.customerEmail;
    const customerPhone =
      validated.customer?.phone || customerSession?.phone || project.customerPhone || "+919999999999";

    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email is required for checkout" }, { status: 400 });
    }

    // 6. Generate order numbers & secure access tokens
    const orderNumber = `EM-${Date.now().toString().slice(-6)}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const rawAccessToken = crypto.randomBytes(32).toString("hex");
    const accessTokenHash = crypto.createHash("sha256").update(rawAccessToken).digest("hex");

    let razorpayOrderId: string | undefined = undefined;

    // 7. Razorpay Order Creation
    if (validated.paymentMethod === "razorpay") {
      if (!isRazorpayConfigured()) {
        return NextResponse.json(
          { error: "Razorpay payment gateway is not configured on the server." },
          { status: 503 }
        );
      }

      try {
        const rzpOrder = await createRazorpayOrder({
          amountInINR: totalAmount,
          orderNumber,
          notes: {
            projectId: project._id.toString(),
            projectSlug: project.slug,
            customerEmail,
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err: any) {
        console.error("Failed to create Razorpay order:", err);
        return NextResponse.json(
          { error: "Failed to initialize payment with Razorpay. Please try again or use UPI." },
          { status: 502 }
        );
      }
    }

    // 8. Create Order Document in MongoDB
    const orderDoc: any = await Order.create({
      orderNumber,
      customer: {
        name: customerName,
        email: customerEmail.toLowerCase(),
        phone: customerPhone,
      },
      items: [
        {
          productSlug: project.occasionType || "apology",
          occasionType: project.occasionType || "apology",
          title: `${project.title} (Digital Celebration Website)`,
          price: productPrice,
          selectedTheme: project.theme,
        },
      ],
      totalAmount,
      currency: "INR",
      paymentMethod: validated.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "placed",
      projectId: project._id as any,
      packageDetails: {
        productPrice,
        basePrice: productPrice, // backward compatibility
        fallbackBasePrice: basePrice,
        isCustomDomain: validated.includeCustomDomain,
        customDomainName: validated.includeCustomDomain ? validated.customDomainName?.toLowerCase() : undefined,
        customDomainPrice: domainPrice,
        isPasswordProtected: validated.isPasswordProtected,
        hostingDurationMonths: effectivePricing.hostingDurationMonths || settings.hostingDurationMonths || 12,
        renewalPolicy: effectivePricing.renewalPolicy || settings.renewalPolicy,
        priceSnapshot: {
          productPrice,
          customDomainPrice: domainPrice,
          totalAmount,
          currency: "INR",
          occasionType: project.occasionType,
          calculatedAt: new Date().toISOString(),
        },
      },
      razorpayDetails: razorpayOrderId ? { razorpayOrderId } : {},
      accessToken: rawAccessToken,
      accessTokenHash,
      auditTrail: [
        {
          action: "PROJECT_PUBLISH_CHECKOUT_INITIATED",
          timestamp: new Date(),
          actor: `customer:${customerEmail}`,
          details: {
            projectId: project._id.toString(),
            totalAmount,
            includeCustomDomain: validated.includeCustomDomain,
            paymentMethod: validated.paymentMethod,
          },
        },
      ],
    });

    // 9. Update Project details with order link & optional password / domain draft
    project.orderId = orderDoc._id as any;
    if (customerSession && !project.customerId) {
      project.customerId = customerSession.userId as any;
    }
    project.customerEmail = customerEmail.toLowerCase();
    project.customerPhone = customerPhone;

    if (validated.isPasswordProtected && validated.websitePassword) {
      project.isPasswordProtected = true;
      project.passwordHash = await hashPassword(validated.websitePassword);
      project.passwordHint = validated.passwordHint || "";
    }

    if (validated.includeCustomDomain && validated.customDomainName) {
      project.customDomain = {
        requested: true,
        domainName: validated.customDomainName.trim().toLowerCase(),
        status: "awaiting_payment",
        dnsInstructions: {
          recordType: "CNAME",
          host: "@",
          target: settings.cnameTarget || "cname.expertomemories.com",
        },
        notes: "Awaiting checkout payment completion",
      };
    }

    await project.save();

    // 10. Manual UPI Config response
    const upiConfig = getManualUpiConfig(settings.manualUpiConfig);
    const upiIntentUri = generateUpiIntentUri({
      upiId: upiConfig.upiId,
      payeeName: upiConfig.payeeName,
      amountInINR: totalAmount,
      orderNumber,
    });

    return NextResponse.json({
      success: true,
      orderId: orderDoc._id.toString(),
      orderNumber,
      totalAmount,
      currency: "INR",
      breakdown: {
        productPrice,
        basePrice: productPrice,
        domainPrice,
        totalAmount,
        hostingDuration: `${effectivePricing.hostingDurationMonths || settings.hostingDurationMonths || 12} Months`,
        renewalPolicy: effectivePricing.renewalPolicy || settings.renewalPolicy,
      },
      paymentMethod: validated.paymentMethod,
      razorpayOrderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
      manualUpi: {
        upiId: upiConfig.upiId,
        payeeName: upiConfig.payeeName,
        qrImageUrl: upiConfig.qrImageUrl,
        intentUri: upiIntentUri,
      },
      accessToken: rawAccessToken,
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return NextResponse.json(
        { error: err.issues?.[0]?.message || "Invalid checkout payload" },
        { status: 400 }
      );
    }
    console.error("Project checkout error:", err);
    return NextResponse.json({ error: "Checkout initiation failed. Please try again." }, { status: 500 });
  }
}
