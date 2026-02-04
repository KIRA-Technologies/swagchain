"use server";

import { auth } from "@/lib/auth";
import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  getWebhookEndpoint,
} from "@/lib/kira-pay-admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const WEBHOOK_SECRET = process.env.KIRA_PAY_WEBHOOK_SECRET || "";

/**
 * Register SwagChain's webhook endpoint with Kira-Pay
 * This should be called once during initial setup
 */
export async function registerWebhook(urlOverride?: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const webhookUrl = urlOverride?.trim() || `${APP_URL}/api/webhooks/kira-pay`;

  console.log("[Webhooks] Registering webhook:", webhookUrl);

  if (!WEBHOOK_SECRET || WEBHOOK_SECRET.length < 6) {
    return { error: "Missing or invalid KIRA_PAY_WEBHOOK_SECRET (min 6 chars)" };
  }

  const result = await createWebhookEndpoint({
    url: webhookUrl,
    secret: WEBHOOK_SECRET,
  });

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    webhook: result.data,
    message: "Webhook registered successfully",
  };
}

export async function registerWebhookAction(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const url = String(formData.get("webhookUrl") || "");
  const result = await registerWebhook(url);
  if ("error" in result && result.error) {
    return { success: false, message: result.error };
  }
  return {
    success: true,
    message: result.message || "Webhook registered",
    webhookUrl: url || `${APP_URL}/api/webhooks/kira-pay`,
  };
}

export async function deleteWebhookAction(
  _prevState: { success: boolean; message: string } | null,
  _formData: FormData
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, message: "Unauthorized - Admin only" };
  }

  const result = await deleteWebhookEndpoint();
  if (!result.success) {
    return { success: false, message: result.error || "Failed to delete webhook" };
  }
  return { success: true, message: result.data?.message || "Webhook deleted" };
}

/**
 * List all registered webhooks
 */
export async function getWebhooks() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const result = await getWebhookEndpoint();

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    webhook: result.data,
  };
}

export async function removeWebhook() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized - Admin only" };
  }

  const result = await deleteWebhookEndpoint();

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    message: result.data?.message || "Webhook deleted",
  };
}
