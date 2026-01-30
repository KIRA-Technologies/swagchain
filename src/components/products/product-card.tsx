"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Plus } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatPrice } from "@/lib/utils";
import type { ProductWithLikes } from "@/types";
import { toggleLike } from "@/actions/likes";
import { addToCart } from "@/actions/cart";
import { toast } from "sonner";

interface ProductCardProps {
  product: ProductWithLikes;
  isAuthenticated?: boolean;
}

export function ProductCard({ product, isAuthenticated }: ProductCardProps) {
  const [isLiking, startLikeTransition] = useTransition();
  const [isAddingToCart, startCartTransition] = useTransition();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to save items");
      return;
    }

    startLikeTransition(async () => {
      const result = await toggleLike(product.id);
      if (result.error) {
        toast.error(result.error);
      }
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add to cart");
      return;
    }

    startCartTransition(async () => {
      const result = await addToCart(product.id, 1);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Added to cart!");
      }
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card hover className="group relative overflow-hidden h-full">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full",
            "bg-white/90 backdrop-blur-sm shadow-sm",
            "transition-all duration-200 hover:scale-110",
            product.isLiked && "bg-primary-light"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
              product.isLiked
                ? "fill-primary text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          />
        </button>

        {/* Featured Badge */}
        {product.featured && (
          <Badge className="absolute left-2 top-2 z-10 text-xs">
            Featured
          </Badge>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-surface-2">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-border" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 space-y-2">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <RatingStars rating={product.rating} size="sm" />

          <div className="flex items-center justify-between pt-1 sm:pt-2 gap-2">
            <span className="text-base sm:text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>

        {/* Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <p className="text-xs text-warning font-medium">
              Only {product.stock} left!
            </p>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">Sold Out</Badge>
          </div>
        )}
      </Card>
    </Link>
  );
}
