import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/types";

interface OrderSummaryProps {
  cartItems: CartItemWithProduct[];
  subtotal: number;
}

export function OrderSummary({ cartItems, subtotal }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base truncate">{item.product.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatPrice(item.product.price)} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-sm sm:text-base shrink-0">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-accent font-medium">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>Calculated at payment</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-lg sm:text-xl">
        <span>Total</span>
        <span className="text-primary">{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}
