const KIRA_PAY_API_URL =
  process.env.KIRA_PAY_API_URL || "https://api.kira-pay.com";
const KIRA_PAY_API_KEY = process.env.KIRA_PAY_API_KEY || "";
const KIRA_PAY_AUTH_TOKEN =
  process.env.KIRA_PAY_AUTH_TOKEN || process.env.KIRA_PAY_API_KEY || "";
const KIRA_PAY_RECEIVER = process.env.KIRA_PAY_RECEIVER || "";

interface CreatePaymentLinkParams {
  receiver?: string;
  price: number;
  name?: string;
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
    const receiver = params.receiver || KIRA_PAY_RECEIVER;
    console.log("[Kira-Pay] Receiver:", receiver);
    console.log("[Kira-Pay] API Key:", KIRA_PAY_API_KEY);
    console.log("[Kira-Pay] Auth Token:", KIRA_PAY_AUTH_TOKEN);
    console.log("[Kira-Pay] API URL:", KIRA_PAY_API_URL);
    console.log("[Kira-Pay] Receiver:", receiver);
    console.log("[Kira-Pay] API Key:", KIRA_PAY_API_KEY);
    console.log("[Kira-Pay] Auth Token:", KIRA_PAY_AUTH_TOKEN);
    console.log("[Kira-Pay] API URL:", KIRA_PAY_API_URL);
    if (!receiver) {
      return {
        success: false,
        error: "Missing receiver address. Set KIRA_PAY_RECEIVER in env.",
      };
    }
    if (!KIRA_PAY_API_KEY) {
      return {
        success: false,
        error: "Missing KIRA_PAY_API_KEY in env.",
      };
    }
    if (!KIRA_PAY_AUTH_TOKEN) {
      return {
        success: false,
        error: "Missing KIRA_PAY_AUTH_TOKEN in env.",
      };
    }

    console.log("[Kira-Pay] Creating payment link:", {
      url: `${KIRA_PAY_API_URL}/api/link/generate`,
      receiver,
      price: params.price,
      customOrderId: params.customOrderId,
    });

    const response = await fetch(`${KIRA_PAY_API_URL}/api/link/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIRA_PAY_AUTH_TOKEN}`,
        "x-api-key": KIRA_PAY_API_KEY,
      },
      body: JSON.stringify({
        name: params.name,
        receiver,
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
    const paymentUrl =
      data.url || data.paymentUrl || data.link?.url || data.data?.url;
    const linkId = data.id || data.linkId || data.link?.id || data.data?.id;
    const linkCode =
      data.link?.code ||
      data.data?.code ||
      (paymentUrl ? paymentUrl.split("/").pop() : undefined);

    console.log("[Kira-Pay] Extracted URL:", paymentUrl);
    console.log("[Kira-Pay] Extracted ID:", linkId);
    console.log("[Kira-Pay] Extracted Code:", linkCode);

    if (!paymentUrl || (!linkCode && !linkId)) {
      return {
        success: false,
        error: "Kira-Pay response missing payment URL or link code",
      };
    }

    return {
      success: true,
      data: {
        id: String(linkCode || linkId || ""),
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
  linkCode: string
): Promise<{ verified: boolean; status?: string }> {
  try {
    const response = await fetch(
      `${KIRA_PAY_API_URL}/api/link/${linkCode}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return { verified: false };
    }

    const data = await response.json();
    const status = data.status || data.link?.status || data.data?.status;
    const txs = data.txs || data.link?.txs || data.data?.txs || [];
    const hasCompletedTx =
      Array.isArray(txs) &&
      txs.some((tx: { status?: string }) => tx.status === "completed");

    return {
      verified: status === "used" || status === "completed" || hasCompletedTx,
      status,
    };
  } catch (error) {
    console.error("Kira-Pay verification error:", error);
    return { verified: false };
  }
}
