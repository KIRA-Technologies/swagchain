"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { CartItemWithProduct } from "@/types";

export async function getCartItems(): Promise<CartItemWithProduct[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          stock: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return cartItems;
}

export async function getCartCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) {
    return 0;
  }

  const count = await prisma.cartItem.aggregate({
    where: { userId: session.user.id },
    _sum: { quantity: true },
  });

  return count._sum.quantity || 0;
}

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to add to cart" };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });

    if (!product) {
      return { error: "Product not found" };
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + quantity;

    if (newQuantity > product.stock) {
      return { error: `Only ${product.stock} items available` };
    }

    await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: { quantity: newQuantity },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { error: "Failed to add to cart" };
  }
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in" };
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: { select: { stock: true } } },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return { error: "Cart item not found" };
    }

    if (quantity > cartItem.product.stock) {
      return { error: `Only ${cartItem.product.stock} items available` };
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update cart error:", error);
    return { error: "Failed to update cart" };
  }
}

export async function removeFromCart(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in" };
  }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return { error: "Cart item not found" };
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { error: "Failed to remove from cart" };
  }
}

export async function clearCart() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in" };
  }

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Clear cart error:", error);
    return { error: "Failed to clear cart" };
  }
}
