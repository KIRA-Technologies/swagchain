const KIRA_PAY_API_URL =
  process.env.KIRA_PAY_API_URL || "https://api.kira-pay.com";
const KIRA_PAY_API_KEY = process.env.KIRA_PAY_API_KEY || "";

interface CreatePaymentLinkParams {
  price: number;
  customOrderId: string;
  redirectUrl: string;
}

interface PaymentLinkResponse {
  success: boolean;
  data?: {
    id: string;
    url: string;
    price: number;
    customOrderId: string;
    type: string;
    createdAt: string;
  };
  error?: string;
}

export async function createPaymentLink(
  params: CreatePaymentLinkParams
): Promise<PaymentLinkResponse> {
  try {
    console.log("[Kira-Pay] Creating payment link:", {
      url: `${KIRA_PAY_API_URL}/api/link/generate`,
      price: params.price,
      customOrderId: params.customOrderId,
    });

    const response = await fetch(`${KIRA_PAY_API_URL}/api/link/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KIRA_PAY_API_KEY,
      },
      body: JSON.stringify({
        price: params.price,
        customOrderId: params.customOrderId,
        redirectUrl: params.redirectUrl,
        type: "single_use",
      }),
    });

    console.log("[Kira-Pay] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Kira-Pay] Error response:", errorData);
      return {
        success: false,
        error: errorData.message || `HTTP error: ${response.status}`,
      };
    }

    const data = await response.json();
    console.log("[Kira-Pay] Success response:", JSON.stringify(data, null, 2));

    // Extract URL from various possible response formats
    const paymentUrl = data.url || data.paymentUrl || data.link?.url || data.data?.url;
    const linkId = data.id || data.linkId || data.link?.id || data.data?.id;

    console.log("[Kira-Pay] Extracted URL:", paymentUrl);
    console.log("[Kira-Pay] Extracted ID:", linkId);

    return {
      success: true,
      data: {
        id: linkId,
        url: paymentUrl,
        price: params.price,
        customOrderId: params.customOrderId,
        type: "single_use",
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Kira-Pay API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function verifyPayment(
  orderId: string
): Promise<{ verified: boolean; status?: string }> {
  try {
    const response = await fetch(
      `${KIRA_PAY_API_URL}/api/orders/${orderId}/status`,
      {
        method: "GET",
        headers: {
          "x-api-key": KIRA_PAY_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return { verified: false };
    }

    const data = await response.json();
    return {
      verified: data.status === "PAID" || data.status === "COMPLETED",
      status: data.status,
    };
  } catch (error) {
    console.error("Kira-Pay verification error:", error);
    return { verified: false };
  }
}
