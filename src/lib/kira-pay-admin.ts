const KIRA_PAY_API_URL =
  process.env.KIRA_PAY_API_URL || "https://api.kira-pay.com";
const KIRA_PAY_API_KEY = process.env.KIRA_PAY_API_KEY || "";
const KIRA_PAY_AUTH_TOKEN =
  process.env.KIRA_PAY_AUTH_TOKEN || process.env.KIRA_PAY_API_KEY || "";

interface WebhookEndpoint {
  _id: string;
  url: string;
  createdAt: string;
}

interface CreateWebhookParams {
  url: string;
  secret: string;
}

/**
 * Register a webhook endpoint with Kira-Pay
 */
export async function createWebhookEndpoint(params: CreateWebhookParams): Promise<{
  success: boolean;
  data?: { message?: string; webhook?: WebhookEndpoint };
  error?: string;
}> {
  try {
    console.log("[Kira-Pay Admin] Creating webhook endpoint:", params);

    const response = await fetch(`${KIRA_PAY_API_URL}/api/webhooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIRA_PAY_AUTH_TOKEN}`,
        "x-api-key": KIRA_PAY_API_KEY,
      },
      body: JSON.stringify(params),
    });

    console.log("[Kira-Pay Admin] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Kira-Pay Admin] Error:", errorData);
      return {
        success: false,
        error: errorData.message || `HTTP error: ${response.status}`,
      };
    }

    const data = await response.json();
    console.log("[Kira-Pay Admin] Webhook created:", data);

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("[Kira-Pay Admin] Error creating webhook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get the configured webhook endpoint
 */
export async function getWebhookEndpoint(): Promise<{
  success: boolean;
  data?: WebhookEndpoint | { message?: string };
  error?: string;
}> {
  try {
    const response = await fetch(`${KIRA_PAY_API_URL}/api/webhooks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${KIRA_PAY_AUTH_TOKEN}`,
        "x-api-key": KIRA_PAY_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("[Kira-Pay Admin] Error listing webhooks:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete the configured webhook endpoint
 */
export async function deleteWebhookEndpoint(): Promise<{
  success: boolean;
  data?: { message?: string };
  error?: string;
}> {
  try {
    const response = await fetch(`${KIRA_PAY_API_URL}/api/webhooks`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${KIRA_PAY_AUTH_TOKEN}`,
        "x-api-key": KIRA_PAY_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("[Kira-Pay Admin] Error updating webhook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
