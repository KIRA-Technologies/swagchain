"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addToCart } from "@/actions/cart";
import { toggleLike } from "@/actions/likes";
import { toast } from "sonner";
import type { ProductWithLikes } from "@/types";

interface ProductActionsProps {
  product: ProductWithLikes;
  isAuthenticated: boolean;
}

export function ProductActions({ product, isAuthenticated }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLiking, startLikeTransition] = useTransition();
  const [isAddingToCart, startCartTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(product.isLiked);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    startCartTransition(async () => {
      const result = await addToCart(product.id, quantity);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Added ${quantity} item(s) to cart!`);
        setQuantity(1);
      }
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    startLikeTransition(async () => {
      const result = await toggleLike(product.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsLiked(result.liked);
        toast.success(result.liked ? "Added to likes" : "Removed from likes");
      }
    });
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold text-lg">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          size="xl"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock === 0}
        >
          {isAddingToCart ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-5 w-5" />
          )}
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>

        <Button
          size="xl"
          variant="outline"
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            isLiked && "border-accent-pink text-accent-pink hover:text-accent-pink"
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isLiked && "fill-accent-pink"
            )}
          />
        </Button>
      </div>
    </div>
  );
}
