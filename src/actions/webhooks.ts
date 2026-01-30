"use server";

import { auth } from "@/lib/auth";
import {
  createWebhookEndpoint,
  listWebhookEndpoints,
  updateWebhookEndpoint,
} from "@/lib/kira-pay-admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Default events to subscribe to - update this when you have the exact events
const DEFAULT_WEBHOOK_EVENTS = [
  "payment.completed",
  "payment.failed",
  "payment.expired",
];

/**
 * Register SwagChain's webhook endpoint with Kira-Pay
 * This should be called once during initial setup
 */
export async function registerWebhook() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const webhookUrl = `${APP_URL}/api/webhooks/kira-pay`;

  console.log("[Webhooks] Registering webhook:", webhookUrl);

  const result = await createWebhookEndpoint({
    url: webhookUrl,
    events: DEFAULT_WEBHOOK_EVENTS,
  });

  if (!result.success) {
    return { error: result.error };
  }

  // If a secret is returned, you should save it to KIRA_PAY_WEBHOOK_SECRET
  if (result.data?.secret) {
    console.log("[Webhooks] Webhook secret returned - save this to your .env:");
    console.log(`KIRA_PAY_WEBHOOK_SECRET="${result.data.secret}"`);
  }

  return {
    success: true,
    webhook: result.data,
    message: "Webhook registered successfully",
  };
}

/**
 * List all registered webhooks
 */
export async function getWebhooks() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const result = await listWebhookEndpoints();

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    webhooks: result.data,
  };
}

/**
 * Update webhook events
 */
export async function updateWebhookEvents(webhookId: string, events: string[]) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const result = await updateWebhookEndpoint(webhookId, { events });

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    webhook: result.data,
  };
}

/**
 * Toggle webhook active status
 */
export async function toggleWebhookStatus(webhookId: string, active: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const result = await updateWebhookEndpoint(webhookId, { active });

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    webhook: result.data,
  };
}
