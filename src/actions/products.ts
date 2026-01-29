"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ProductFilters, ProductWithLikes } from "@/types";
import { revalidatePath } from "next/cache";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductWithLikes[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort = "newest",
  } = filters;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { keywords: { has: search.toLowerCase() } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      (where.price as Record<string, number>).gte = minPrice;
    }
    if (maxPrice !== undefined) {
      (where.price as Record<string, number>).lte = maxPrice;
    }
  }

  if (minRating !== undefined && minRating > 0) {
    where.rating = { gte: minRating };
  }

  const orderBy: Record<string, string> = {};
  switch (sort) {
    case "price_asc":
      orderBy.price = "asc";
      break;
    case "price_desc":
      orderBy.price = "desc";
      break;
    case "rating":
      orderBy.rating = "desc";
      break;
    default:
      orderBy.createdAt = "desc";
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      likes: userId ? { where: { userId } } : false,
      _count: { select: { likes: true } },
    },
  });

  return products.map((product) => ({
    ...product,
    isLiked: userId ? product.likes?.length > 0 : false,
    likes: undefined,
  })) as ProductWithLikes[];
}

export async function getProductById(
  id: string
): Promise<ProductWithLikes | null> {
  const session = await auth();
  const userId = session?.user?.id;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      likes: userId ? { where: { userId } } : false,
      _count: { select: { likes: true } },
    },
  });

  if (!product) return null;

  return {
    ...product,
    isLiked: userId ? product.likes?.length > 0 : false,
    likes: undefined,
  } as ProductWithLikes;
}

export async function getFeaturedProducts(): Promise<ProductWithLikes[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      likes: userId ? { where: { userId } } : false,
    },
  });

  return products.map((product) => ({
    ...product,
    isLiked: userId ? product.likes?.length > 0 : false,
    likes: undefined,
  })) as ProductWithLikes[];
}

// Admin actions
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  keywords: string[];
  stock: number;
  featured?: boolean;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        keywords: data.keywords.map((k) => k.toLowerCase()),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true, product };
  } catch (error) {
    console.error("Create product error:", error);
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    images?: string[];
    category?: string;
    keywords?: string[];
    stock?: number;
    featured?: boolean;
  }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        keywords: data.keywords?.map((k) => k.toLowerCase()),
      },
    });

    revalidatePath("/");
    revalidatePath(`/product/${id}`);
    revalidatePath("/admin/products");

    return { success: true, product };
  } catch (error) {
    console.error("Update product error:", error);
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.product.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: "Failed to delete product" };
  }
}
