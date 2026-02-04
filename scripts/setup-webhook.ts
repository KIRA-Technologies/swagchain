/**
 * Setup script to register webhook with Kira-Pay
 *
 * Run with: npx tsx scripts/setup-webhook.ts
 */

import "dotenv/config";

const KIRA_PAY_API_URL =
  process.env.KIRA_PAY_API_URL || "https://api.kira-pay.com";
const KIRA_PAY_API_KEY = process.env.KIRA_PAY_API_KEY || "";
const KIRA_PAY_AUTH_TOKEN =
  process.env.KIRA_PAY_AUTH_TOKEN || process.env.KIRA_PAY_API_KEY || "";
const KIRA_PAY_WEBHOOK_SECRET = process.env.KIRA_PAY_WEBHOOK_SECRET || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function setupWebhook() {
  console.log("🔧 Setting up Kira-Pay webhook...\n");

  if (!KIRA_PAY_API_KEY) {
    console.error("❌ KIRA_PAY_API_KEY is not set in .env");
    process.exit(1);
  }

  if (!KIRA_PAY_WEBHOOK_SECRET || KIRA_PAY_WEBHOOK_SECRET.length < 6) {
    console.error("❌ KIRA_PAY_WEBHOOK_SECRET is missing or too short (min 6 chars)");
    process.exit(1);
  }

  const webhookUrl = `${APP_URL}/api/webhooks/kira-pay`;

  console.log("📍 Webhook URL:", webhookUrl);
  console.log("");

  try {
    // Check existing webhook
    console.log("📋 Checking existing webhook...");
    const listResponse = await fetch(`${KIRA_PAY_API_URL}/api/webhooks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${KIRA_PAY_AUTH_TOKEN}`,
        "x-api-key": KIRA_PAY_API_KEY,
      },
    });

    if (listResponse.ok) {
      const existing = await listResponse.json();
      if (existing?.url === webhookUrl) {
        console.log("✅ Webhook already registered!");
        return;
      }
      console.log("   No existing webhook registered for this URL");
    }

    // Create new webhook
    console.log("\n🚀 Creating new webhook...");
    const createResponse = await fetch(`${KIRA_PAY_API_URL}/api/webhooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIRA_PAY_AUTH_TOKEN}`,
        "x-api-key": KIRA_PAY_API_KEY,
      },
      body: JSON.stringify({
        url: webhookUrl,
        secret: KIRA_PAY_WEBHOOK_SECRET,
      }),
    });

    const responseText = await createResponse.text();
    console.log("📥 Response status:", createResponse.status);

    if (!createResponse.ok) {
      console.error("❌ Failed to create webhook:");
      console.error(responseText);
      process.exit(1);
    }

    const result = JSON.parse(responseText);
    console.log("\n✅ Webhook created successfully!");
    console.log("   URL:", result.webhook?.url || webhookUrl);

    console.log("\n🎉 Setup complete!");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

setupWebhook();
