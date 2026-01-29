import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Package } from "lucide-react";
import type { ProductWithLikes } from "@/types";

interface ProductGridProps {
  products: ProductWithLikes[];
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export function ProductGrid({
  products,
  isLoading,
  isAuthenticated,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
