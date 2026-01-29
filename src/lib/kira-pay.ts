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
      data: {
        id: data.id || data.linkId,
        url: data.url || data.paymentUrl,
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
