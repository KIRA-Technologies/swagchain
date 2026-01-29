"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ProductWithLikes } from "@/types";

export async function getLikedProducts(): Promise<ProductWithLikes[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          _count: { select: { likes: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return likes.map((like) => ({
    ...like.product,
    isLiked: true,
  }));
}

export async function toggleLike(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to like products" };
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      revalidatePath("/");
      revalidatePath("/dashboard");

      return { success: true, liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });

      revalidatePath("/");
      revalidatePath("/dashboard");

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    return { error: "Failed to toggle like" };
  }
}
