"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createPaymentLink } from "@/lib/kira-pay";
import type { OrderWithDetails } from "@/types";
import { OrderStatus } from "@prisma/client";

export async function getUserOrders(): Promise<OrderWithDetails[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      paidAt: true,
      shippedAt: true,
      deliveredAt: true,
      kiraPayUrl: true,
      kiraPayLinkId: true,
      address: {
        select: {
          fullName: true,
          street: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

export async function getOrderById(
  orderId: string
): Promise<OrderWithDetails | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      paidAt: true,
      shippedAt: true,
      deliveredAt: true,
      kiraPayUrl: true,
      kiraPayLinkId: true,
      address: {
        select: {
          fullName: true,
          street: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  return order;
}

export async function createOrder(addressData: {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to checkout" };
  }

  try {
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            price: true,
            stock: true,
            name: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return { error: "Your cart is empty" };
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return {
          error: `Not enough stock for ${item.product.name}. Only ${item.product.stock} available.`,
        };
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create or get address
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        ...addressData,
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: address.id,
        totalAmount,
        status: "CREATED",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Create Kira-Pay payment link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const paymentResult = await createPaymentLink({
      price: totalAmount,
      customOrderId: order.id,
      redirectUrl: `${appUrl}/order/success?orderId=${order.id}`,
    });

    if (!paymentResult.success || !paymentResult.data) {
      // Delete the order if payment link creation fails
      await prisma.order.delete({ where: { id: order.id } });
      return { error: paymentResult.error || "Failed to create payment link" };
    }

    // Update order with payment link
    await prisma.order.update({
      where: { id: order.id },
      data: {
        kiraPayLinkId: paymentResult.data.id,
        kiraPayUrl: paymentResult.data.url,
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    // Update product stock
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/");

    return {
      success: true,
      orderId: order.id,
      paymentUrl: paymentResult.data.url,
    };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "Failed to create order" };
  }
}

export async function markOrderAsPaid(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        status: "CREATED",
      },
    });

    if (!order) {
      return { error: "Order not found" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/order/success`);

    return { success: true };
  } catch (error) {
    console.error("Mark order paid error:", error);
    return { error: "Failed to update order" };
  }
}

// Admin actions
export async function getAllOrders(): Promise<OrderWithDetails[]> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return [];
  }

  const orders = await prisma.order.findMany({
    include: {
      address: {
        select: {
          fullName: true,
          street: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders as unknown as OrderWithDetails[];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const updateData: Record<string, unknown> = { status };

    if (status === "PAID") {
      updateData.paidAt = new Date();
    } else if (status === "SHIPPED") {
      updateData.shippedAt = new Date();
    } else if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update order status error:", error);
    return { error: "Failed to update order status" };
  }
}
