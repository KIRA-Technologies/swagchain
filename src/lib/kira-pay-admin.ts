const KIRA_PAY_API_URL = process.env.KIRA_PAY_API_URL || "https://api.kira-pay.com";
const KIRA_PAY_API_KEY = process.env.KIRA_PAY_API_KEY || "";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  createdAt: string;
}

interface CreateWebhookParams {
  url: string;
  events: string[];
}

/**
 * Register a webhook endpoint with Kira-Pay
 */
export async function createWebhookEndpoint(params: CreateWebhookParams): Promise<{
  success: boolean;
  data?: WebhookEndpoint;
  error?: string;
}> {
  try {
    console.log("[Kira-Pay Admin] Creating webhook endpoint:", params);

    const response = await fetch(`${KIRA_PAY_API_URL}/api/admin/webhooks/endpoints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
 * List all registered webhook endpoints
 */
export async function listWebhookEndpoints(): Promise<{
  success: boolean;
  data?: WebhookEndpoint[];
  error?: string;
}> {
  try {
    const response = await fetch(`${KIRA_PAY_API_URL}/api/admin/webhooks/endpoints`, {
      method: "GET",
      headers: {
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
      data: data.endpoints || data,
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
 * Update a webhook endpoint
 */
export async function updateWebhookEndpoint(
  id: string,
  params: Partial<CreateWebhookParams & { active: boolean }>
): Promise<{
  success: boolean;
  data?: WebhookEndpoint;
  error?: string;
}> {
  try {
    const response = await fetch(`${KIRA_PAY_API_URL}/api/admin/webhooks/endpoints/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KIRA_PAY_API_KEY,
      },
      body: JSON.stringify(params),
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

/**
 * List webhook deliveries (for debugging)
 */
export async function listWebhookDeliveries(): Promise<{
  success: boolean;
  data?: unknown[];
  error?: string;
}> {
  try {
    const response = await fetch(`${KIRA_PAY_API_URL}/api/admin/webhooks/deliveries`, {
      method: "GET",
      headers: {
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
      data: data.deliveries || data,
    };
  } catch (error) {
    console.error("[Kira-Pay Admin] Error listing deliveries:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
