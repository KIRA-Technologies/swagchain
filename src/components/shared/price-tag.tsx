import { cn, formatPrice } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PriceTag({
  price,
  originalPrice,
  size = "md",
  className,
}: PriceTagProps) {
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-bold text-primary",
          sizes[size]
        )}
      >
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
