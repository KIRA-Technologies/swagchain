import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const KIRA_PAY_WEBHOOK_SECRET = process.env.KIRA_PAY_WEBHOOK_SECRET || "";

interface KiraPayWebhookPayload {
  event: "payment.completed" | "payment.failed" | "payment.expired";
  data: {
    id: string;
    linkId: string;
    customOrderId: string;
    amount: number;
    currency: string;
    status: string;
    paidAt?: string;
    transactionHash?: string;
    walletAddress?: string;
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

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-kira-signature") || "";

    console.log("[Webhook] Received Kira-Pay webhook");

    // Verify signature
    if (KIRA_PAY_WEBHOOK_SECRET && !verifySignature(payload, signature, KIRA_PAY_WEBHOOK_SECRET)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data: KiraPayWebhookPayload = JSON.parse(payload);
    console.log("[Webhook] Event:", data.event);
    console.log("[Webhook] Order ID:", data.data.customOrderId);

    const orderId = data.data.customOrderId;

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error("[Webhook] Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle different events
    switch (data.event) {
      case "payment.completed":
        console.log("[Webhook] Payment completed for order:", orderId);

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paidAt: data.data.paidAt ? new Date(data.data.paidAt) : new Date(),
          },
        });

        console.log("[Webhook] Order marked as PAID");
        break;

      case "payment.failed":
        console.log("[Webhook] Payment failed for order:", orderId);

        // Optionally restore stock if payment failed
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

      case "payment.expired":
        console.log("[Webhook] Payment expired for order:", orderId);

        // Restore stock for expired payments
        const expiredOrderItems = await prisma.orderItem.findMany({
          where: { orderId },
        });

        for (const item of expiredOrderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });

        console.log("[Webhook] Order cancelled due to expiration");
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
