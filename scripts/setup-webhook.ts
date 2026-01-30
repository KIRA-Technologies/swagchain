/**
 * Setup script to register webhook with Kira-Pay
 *
 * Run with: npx tsx scripts/setup-webhook.ts
 */

import "dotenv/config";

const KIRA_PAY_API_URL = process.env.KIRA_PAY_API_URL || "https://api.kira-pay.com";
const KIRA_PAY_API_KEY = process.env.KIRA_PAY_API_KEY || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Update these events based on Kira-Pay documentation
const WEBHOOK_EVENTS = [
  "payment.completed",
  "payment.failed",
  "payment.expired",
];

async function setupWebhook() {
  console.log("🔧 Setting up Kira-Pay webhook...\n");

  if (!KIRA_PAY_API_KEY) {
    console.error("❌ KIRA_PAY_API_KEY is not set in .env");
    process.exit(1);
  }

  const webhookUrl = `${APP_URL}/api/webhooks/kira-pay`;

  console.log("📍 Webhook URL:", webhookUrl);
  console.log("📡 Events:", WEBHOOK_EVENTS.join(", "));
  console.log("");

  try {
    // First, list existing webhooks
    console.log("📋 Checking existing webhooks...");
    const listResponse = await fetch(`${KIRA_PAY_API_URL}/api/admin/webhooks/endpoints`, {
      method: "GET",
      headers: {
        "x-api-key": KIRA_PAY_API_KEY,
      },
    });

    if (listResponse.ok) {
      const existing = await listResponse.json();
      const webhooks = existing.endpoints || existing || [];

      if (webhooks.length > 0) {
        console.log("✅ Existing webhooks found:");
        webhooks.forEach((wh: { id: string; url: string; active: boolean }) => {
          console.log(`   - ${wh.id}: ${wh.url} (${wh.active ? "active" : "inactive"})`);
        });

        // Check if our URL is already registered
        const alreadyRegistered = webhooks.find((wh: { url: string }) => wh.url === webhookUrl);
        if (alreadyRegistered) {
          console.log("\n✅ Webhook already registered!");
          return;
        }
      } else {
        console.log("   No existing webhooks found");
      }
    }

    // Create new webhook
    console.log("\n🚀 Creating new webhook...");
    const createResponse = await fetch(`${KIRA_PAY_API_URL}/api/admin/webhooks/endpoints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KIRA_PAY_API_KEY,
      },
      body: JSON.stringify({
        url: webhookUrl,
        events: WEBHOOK_EVENTS,
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
    console.log("   ID:", result.id);
    console.log("   URL:", result.url);

    if (result.secret) {
      console.log("\n⚠️  IMPORTANT: Save this webhook secret to your .env file:");
      console.log(`   KIRA_PAY_WEBHOOK_SECRET="${result.secret}"`);
    }

    console.log("\n🎉 Setup complete!");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

setupWebhook();
