"use client";

import { Heart } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ProductWithLikes } from "@/types";

interface LikesGridProps {
  products: ProductWithLikes[];
}

export function LikesGrid({ products }: LikesGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No liked products"
        description="Products you like will appear here. Click the heart icon on any product to save it."
        action={{
          label: "Browse Products",
          onClick: () => (window.location.href = "/"),
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isAuthenticated />
      ))}
    </div>
  );
}
