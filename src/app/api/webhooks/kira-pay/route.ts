import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const KIRA_PAY_WEBHOOK_SECRET = process.env.KIRA_PAY_WEBHOOK_SECRET || "";

interface KiraPayWebhookPayload {
  event:
    | "transaction.created"
    | "transaction.succeeded"
    | "transaction.failed"
    | "transaction.refund";
  data: {
    transactionId: string;
    code?: string;
    linkCode?: string;
    customOrderId?: string;
    amount: string;
    currency: string;
    sender: string;
    receiver: string;
    status: string;
    settlementAmount?: string;
  };
  timestamp: string;
}

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) {
    console.warn("[Webhook] No webhook secret configured, skipping verification");
    return true;
  }

  console.log("getting here.....")

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  console.log("expectedSignature....",expectedSignature)
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  console.log("signatureBuffer.........", signatureBuffer);
  console.log("expectedBuffer..........", expectedBuffer);
  
  if (signatureBuffer.length !== expectedBuffer.length) {
    console.log("failing silently here....")
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-kirapay-signature") || "";

    console.log("[Webhook] Received Kira-Pay webhook");

    // Verify signature
    if (KIRA_PAY_WEBHOOK_SECRET && !verifySignature(payload, signature, KIRA_PAY_WEBHOOK_SECRET)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data: KiraPayWebhookPayload = JSON.parse(payload);
    console.log("[Webhook] Event:", data.event);

    const linkCode = data.data.code || data.data.linkCode;
    const customOrderId = data.data.customOrderId;

    console.log("[Webhook] Link code:", linkCode);
    if (customOrderId) {
      console.log("[Webhook] Custom order ID:", customOrderId);
    }

    // Find the order
    const order =
      (linkCode
        ? await prisma.order.findFirst({
            where: { kiraPayLinkId: linkCode },
          })
        : null) ||
      (customOrderId
        ? await prisma.order.findFirst({
            where: { id: customOrderId },
          })
        : null);

    if (!order) {
      console.error("[Webhook] Order not found for link code:", linkCode);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const orderId = order.id;

    // Handle different events
    switch (data.event) {
      case "transaction.succeeded":
        console.log("[Webhook] Transaction succeeded for order:", orderId);

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paidAt: new Date(data.timestamp),
          },
        });

        console.log("[Webhook] Order marked as PAID");
        break;

      case "transaction.failed":
        console.log("[Webhook] Transaction failed for order:", orderId);

        // Restore stock if payment failed
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId },
        });

        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });

        console.log("[Webhook] Order cancelled and stock restored");
        break;

      case "transaction.refund":
        console.log("[Webhook] Transaction refunded for order:", orderId);

        // Restore stock for refunded payments
        const refundedOrderItems = await prisma.orderItem.findMany({
          where: { orderId },
        });

        for (const item of refundedOrderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });

        console.log("[Webhook] Order cancelled due to refund");
        break;

      case "transaction.created":
        console.log("[Webhook] Transaction created for order:", orderId);
        break;

      default:
        console.log("[Webhook] Unknown event:", data.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Support GET for webhook verification (if Kira-Pay requires it)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("challenge");

  if (challenge) {
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({ status: "Kira-Pay webhook endpoint active" });
}
