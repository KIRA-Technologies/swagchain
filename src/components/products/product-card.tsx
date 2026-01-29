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
import { PriceTag } from "@/components/shared/price-tag";
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
      toast.error("Please sign in to like products");
      return;
    }

    startLikeTransition(async () => {
      const result = await toggleLike(product.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.liked ? "Added to likes" : "Removed from likes");
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
      <Card
        hover
        className={cn(
          "group relative overflow-hidden p-4",
          "bg-gradient-to-b from-surface-1 to-card"
        )}
      >
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full",
            "bg-background/80 backdrop-blur-sm border border-border",
            "transition-all duration-200 hover:scale-110",
            product.isLiked && "border-accent-pink bg-accent-pink/20"
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              product.isLiked
                ? "fill-accent-pink text-accent-pink"
                : "text-muted-foreground hover:text-accent-pink"
            )}
          />
        </button>

        {/* Featured Badge */}
        {product.featured && (
          <Badge
            variant="gradient"
            className="absolute left-4 top-4 z-10"
          >
            Featured
          </Badge>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-2">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-surface-3" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-accent-purple transition-colors">
            {product.name}
          </h3>

          <RatingStars rating={product.rating} size="sm" />

          <div className="flex items-center justify-between pt-2">
            <PriceTag price={product.price} size="md" />

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              {product.stock === 0 ? "Sold Out" : "Add"}
            </Button>
          </div>
        </div>

        {/* Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="mt-2 text-xs text-accent-orange">
            Only {product.stock} left in stock!
          </p>
        )}
      </Card>
    </Link>
  );
}
