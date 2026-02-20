import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const KIRA_PAY_WEBHOOK_SECRET = process.env.KIRA_PAY_WEBHOOK_SECRET || "";
const SIGNATURE_HEADER = "x-kirapay-signature";
const LEGACY_SIGNATURE_HEADER = "x-kira-signature";
const TIMESTAMP_HEADER = "x-kirapay-timestamp";
const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

interface KiraPayWebhookPayload {
  type?: string;
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
    createdAt?: string;
    amount: string;
    currency: string;
    sender: string;
    receiver: string;
    status: string;
    settlementAmount?: string;
  };
  timestamp?: string;
  createdAt?: string;
}

function getWebhookEventDate(payload: KiraPayWebhookPayload): Date {
  const dateCandidates = [
    payload.timestamp,
    payload.createdAt,
    payload.data.createdAt,
  ];

  for (const value of dateCandidates) {
    if (!value) continue;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return new Date();
}

function verifySignature(
  payload: string,
  signature: string,
  secret: string,
  timestamp?: string
): boolean {
  if (!secret) {
    console.warn("[Webhook] No webhook secret configured, skipping verification");
    return true;
  }

  if (!signature) {
    console.error("[Webhook] Missing webhook signature header");
    return false;
  }

  const received = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;

  if (timestamp) {
    const tsRaw = Number(timestamp);
    if (!Number.isFinite(tsRaw)) {
      console.error("[Webhook] Invalid webhook timestamp");
      return false;
    }
    const tsSeconds =
      tsRaw > 1e12 ? Math.floor(tsRaw / 1000) : Math.floor(tsRaw);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - tsSeconds) > TIMESTAMP_TOLERANCE_SECONDS) {
      console.error("[Webhook] Webhook timestamp outside tolerance");
      return false;
    }
  }

  const timingSafeMatch = (a: string, b: string) => {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  };

  const message = timestamp ? `${timestamp}.${payload}` : payload;
  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");
  const expectedBase64 = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");

  if (timingSafeMatch(received, expectedHex)) return true;
  if (timingSafeMatch(received, expectedBase64)) return true;

  if (timestamp) {
    const legacyHex = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    const legacyBase64 = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64");
    if (timingSafeMatch(received, legacyHex)) return true;
    if (timingSafeMatch(received, legacyBase64)) return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature =
      request.headers.get(SIGNATURE_HEADER) ||
      request.headers.get(LEGACY_SIGNATURE_HEADER) ||
      "";
    const timestamp = request.headers.get(TIMESTAMP_HEADER) || "";

    console.log("[Webhook] Received Kira-Pay webhook");

    // Verify signature
    if (
      KIRA_PAY_WEBHOOK_SECRET &&
      !verifySignature(payload, signature, KIRA_PAY_WEBHOOK_SECRET, timestamp)
    ) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data: KiraPayWebhookPayload = JSON.parse(payload);
    const eventType = data.event || data.type;
    console.log("[Webhook] Event:", eventType);

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
    switch (eventType) {
      case "transaction.succeeded":
        console.log("[Webhook] Transaction succeeded for order:", orderId);
        const paidAt = getWebhookEventDate(data);

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paidAt,
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
        console.log("[Webhook] Unknown event:", eventType);
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
