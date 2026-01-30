"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { verifyPayment } from "@/lib/kira-pay";
import { revalidatePath } from "next/cache";

export async function verifyAndUpdateOrderPayment(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
    });

    if (!order) {
      return { error: "Order not found" };
    }

    // If already paid, no need to verify
    if (order.status !== "CREATED") {
      return { success: true, status: order.status };
    }

    // If no Kira-Pay link ID, can't verify
    if (!order.kiraPayLinkId) {
      console.log("[Payment] No Kira-Pay link ID for order:", orderId);
      return { success: false, status: order.status };
    }

    // Verify with Kira-Pay
    const verification = await verifyPayment(order.kiraPayLinkId);
    console.log("[Payment] Verification result:", verification);

    if (verification.verified) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      revalidatePath("/dashboard");
      revalidatePath(`/order/success`);

      return { success: true, status: "PAID" };
    }

    return { success: false, status: order.status };
  } catch (error) {
    console.error("[Payment] Verification error:", error);
    return { error: "Failed to verify payment" };
  }
}
