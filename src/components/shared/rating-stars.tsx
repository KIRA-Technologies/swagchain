"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const sizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 > 0;

          return (
            <div key={index} className="relative">
              <Star
                className={cn(
                  sizes[size],
                  "text-surface-3",
                  filled && "text-accent-cyan fill-accent-cyan",
                  partial && "text-accent-cyan"
                )}
              />
              {partial && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star
                    className={cn(sizes[size], "text-accent-cyan fill-accent-cyan")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("text-muted-foreground", textSizes[size])}>
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
