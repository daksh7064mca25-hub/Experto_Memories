import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { WebsiteProject } from "@/models/WebsiteProject";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { projectService } from "@/services/project.service";

export async function POST(req: Request) {
  try {
    // 1. Read exact raw request body string before any JSON parsing
    const rawBody = await req.text();
    const webhookSignature = req.headers.get("x-razorpay-signature");

    if (!webhookSignature) {
      return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    // 2. Strict webhook secret requirement (no fallback to key secret)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Razorpay webhook secret is not configured on server (RAZORPAY_WEBHOOK_SECRET missing)." },
        { status: 503 }
      );
    }

    // 3. Verify Razorpay webhook signature against raw request body
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      webhookSignature,
    });

    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature rejected.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // 4. Safely parse verified JSON payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    await connectToDatabase();

    // 5. Determine associated Razorpay order ID based on event type
    let rzpOrderId: string | undefined = undefined;
    if (event === "payment.captured" || event === "payment.failed") {
      rzpOrderId = paymentEntity?.order_id;
    } else if (event === "order.paid") {
      rzpOrderId = orderEntity?.id || paymentEntity?.order_id;
    } else {
      rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
    }

    if (!rzpOrderId) {
      return NextResponse.json({ received: true, note: "No associated order_id in event payload" });
    }

    // 6. Fetch corresponding internal Order
    const order = await Order.findOne({ "razorpayDetails.razorpayOrderId": rzpOrderId });
    if (!order) {
      return NextResponse.json({ received: true, note: `No internal order found for ${rzpOrderId}` });
    }

    const expectedPaise = Math.round(order.totalAmount * 100);

    // 7. Handle Events
    if (event === "payment.captured") {
      // Idempotency: Do not process twice if already marked paid
      if (order.paymentStatus === "paid") {
        return NextResponse.json({ received: true, note: "Order already paid" });
      }

      // Verify payment entity details
      if (!paymentEntity) {
        return NextResponse.json({ error: "Missing payment entity in payment.captured" }, { status: 400 });
      }

      // Do not accept merely authorized or non-captured payments
      if (paymentEntity.status !== "captured") {
        return NextResponse.json(
          { received: true, note: `Payment is not captured. Status is '${paymentEntity.status}'.` }
        );
      }

      // Verify amount
      if (Number(paymentEntity.amount) !== expectedPaise) {
        return NextResponse.json(
          { error: `Amount mismatch in payment.captured: expected ${expectedPaise}, got ${paymentEntity.amount}` },
          { status: 400 }
        );
      }

      // Verify currency
      if (paymentEntity.currency !== "INR") {
        return NextResponse.json(
          { error: `Currency mismatch in payment.captured: expected INR, got ${paymentEntity.currency}` },
          { status: 400 }
        );
      }

      order.paymentStatus = "paid";
      order.paymentMethod = "razorpay";
      order.razorpayDetails = {
        ...order.razorpayDetails,
        razorpayPaymentId: paymentEntity.id,
        paidAt: new Date(),
      };

      // Provision draft project if not yet created (Idempotent)
      let project: any = null;
      if (order.projectId) {
        project = await WebsiteProject.findById(order.projectId).lean();
      }
      if (!project) {
        project = await WebsiteProject.findOne({ orderId: order._id } as any).lean();
      }
      if (!project) {
        const primaryItem = order.items[0];
        const initialSlug = `${primaryItem.occasionType}-${order.orderNumber.toLowerCase()}`;
        const existingSlugProject = await WebsiteProject.findOne({ slug: initialSlug }).lean();
        if (existingSlugProject) {
          project = existingSlugProject;
        } else {
          project = await projectService.create({
            slug: initialSlug,
            title: `${primaryItem.title} for ${order.customer.name}'s Gift`,
            occasionType: primaryItem.occasionType as any,
            recipientName: order.personalization?.recipientName || "Loved One",
            senderName: order.customer.name,
            theme: primaryItem.selectedTheme as any,
            status: "draft",
            orderId: order._id.toString(),
            customerId: order.customerId ? order.customerId.toString() : undefined,
            customerEmail: order.customer.email,
            customerPhone: order.customer.phone,
          });
        }
      }

      order.projectId = project._id as any;

      if (project && project._id) {
        const projectUpdates: any = {
          paymentStatus: "paid",
          paidAt: new Date(),
          paymentMethod: "razorpay",
        };
        if (order.customerId && !project.customerId) {
          projectUpdates.customerId = order.customerId;
        }
        if ((order as any).packageDetails?.isCustomDomain) {
          projectUpdates["customDomain.status"] = "awaiting_customer_registration";
        }
        await WebsiteProject.findByIdAndUpdate(project._id, { $set: projectUpdates });
      }

      order.auditTrail = order.auditTrail || [];
      order.auditTrail.push({
        action: "WEBHOOK_PAYMENT_CAPTURED",
        timestamp: new Date(),
        actor: "webhook:razorpay",
        details: { event, paymentId: paymentEntity.id },
      });

      await order.save();
      return NextResponse.json({ received: true, note: "Order marked as paid via payment.captured" });
    } else if (event === "order.paid") {
      // Idempotency: Do not process twice if already marked paid
      if (order.paymentStatus === "paid") {
        return NextResponse.json({ received: true, note: "Order already paid" });
      }

      // Verify orderEntity amount and currency if present
      if (orderEntity) {
        const orderAmount = Number(orderEntity.amount_paid ?? orderEntity.amount);
        if (orderAmount !== expectedPaise) {
          return NextResponse.json(
            { error: `Amount mismatch in order.paid: expected ${expectedPaise}, got ${orderAmount}` },
            { status: 400 }
          );
        }
        if (orderEntity.currency && orderEntity.currency !== "INR") {
          return NextResponse.json(
            { error: `Currency mismatch in order.paid: expected INR, got ${orderEntity.currency}` },
            { status: 400 }
          );
        }
      }

      // If paymentEntity is present in order.paid, do not mark paid for authorization-only events
      if (paymentEntity) {
        if (paymentEntity.status && paymentEntity.status !== "captured") {
          return NextResponse.json({
            received: true,
            note: `Payment entity present in order.paid is not captured (status: ${paymentEntity.status}). Not marked paid.`,
          });
        }
        if (Number(paymentEntity.amount) !== expectedPaise) {
          return NextResponse.json(
            { error: `Payment amount mismatch in order.paid: expected ${expectedPaise}, got ${paymentEntity.amount}` },
            { status: 400 }
          );
        }
        if (paymentEntity.currency !== "INR") {
          return NextResponse.json(
            { error: `Payment currency mismatch in order.paid: expected INR, got ${paymentEntity.currency}` },
            { status: 400 }
          );
        }
      }

      order.paymentStatus = "paid";
      order.paymentMethod = "razorpay";
      order.razorpayDetails = {
        ...order.razorpayDetails,
        razorpayPaymentId: paymentEntity?.id || order.razorpayDetails?.razorpayPaymentId,
        paidAt: new Date(),
      };

      // Provision draft project if not yet created (Idempotent)
      let project: any = null;
      if (order.projectId) {
        project = await WebsiteProject.findById(order.projectId).lean();
      }
      if (!project) {
        project = await WebsiteProject.findOne({ orderId: order._id } as any).lean();
      }
      if (!project) {
        const primaryItem = order.items[0];
        const initialSlug = `${primaryItem.occasionType}-${order.orderNumber.toLowerCase()}`;
        const existingSlugProject = await WebsiteProject.findOne({ slug: initialSlug }).lean();
        if (existingSlugProject) {
          project = existingSlugProject;
        } else {
          project = await projectService.create({
            slug: initialSlug,
            title: `${primaryItem.title} for ${order.customer.name}'s Gift`,
            occasionType: primaryItem.occasionType as any,
            recipientName: order.personalization?.recipientName || "Loved One",
            senderName: order.customer.name,
            theme: primaryItem.selectedTheme as any,
            status: "draft",
            orderId: order._id.toString(),
            customerId: order.customerId ? order.customerId.toString() : undefined,
            customerEmail: order.customer.email,
            customerPhone: order.customer.phone,
          });
        }
      }

      order.projectId = project._id as any;

      if (project && project._id) {
        const projectUpdates: any = {
          paymentStatus: "paid",
          paidAt: new Date(),
          paymentMethod: "razorpay",
        };
        if (order.customerId && !project.customerId) {
          projectUpdates.customerId = order.customerId;
        }
        if ((order as any).packageDetails?.isCustomDomain) {
          projectUpdates["customDomain.status"] = "awaiting_customer_registration";
        }
        await WebsiteProject.findByIdAndUpdate(project._id, { $set: projectUpdates });
      }

      order.auditTrail = order.auditTrail || [];
      order.auditTrail.push({
        action: "WEBHOOK_ORDER_PAID",
        timestamp: new Date(),
        actor: "webhook:razorpay",
        details: { event, paymentId: paymentEntity?.id },
      });

      await order.save();
      return NextResponse.json({ received: true, note: "Order marked as paid via order.paid" });
    } else if (event === "payment.failed") {
      // Critical: Ensure an already-paid order cannot accidentally be changed to failed by a delayed failure webhook
      if (order.paymentStatus === "paid") {
        return NextResponse.json({
          received: true,
          note: "Order is already marked as paid. Delayed payment.failed event safely ignored.",
        });
      }

      order.paymentStatus = "failed";
      order.auditTrail = order.auditTrail || [];
      order.auditTrail.push({
        action: "WEBHOOK_PAYMENT_FAILED",
        timestamp: new Date(),
        actor: "webhook:razorpay",
        details: {
          razorpayPaymentId: paymentEntity?.id,
          reason: paymentEntity?.error_description || "Payment failed",
        },
      });
      await order.save();
      return NextResponse.json({ received: true, note: "Order marked as failed" });
    }

    return NextResponse.json({ received: true, note: `Unhandled event '${event}' acknowledged.` });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failure" }, { status: 500 });
  }
}
