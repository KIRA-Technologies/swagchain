"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPrice } from "@/lib/utils";
import { updateCartQuantity, removeFromCart } from "@/actions/cart";
import { toast } from "sonner";
import type { CartItemWithProduct } from "@/types";

interface CartTabProps {
  cartItems: CartItemWithProduct[];
}

export function CartTab({ cartItems }: CartTabProps) {
  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Browse our products and add items to your cart to get started."
        action={{
          label: "Browse Products",
          onClick: () => (window.location.href = "/"),
        }}
      />
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-emerald-400">Free</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="gradient-text">{formatPrice(subtotal)}</span>
          </div>

          <Link href="/checkout" className="block mt-6">
            <Button size="lg" className="w-full group">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Pay securely with crypto via Kira-Pay
          </p>
        </Card>
      </div>
    </div>
  );
}

function CartItem({ item }: { item: CartItemWithProduct }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = (newQuantity: number) => {
    startTransition(async () => {
      const result = await updateCartQuantity(item.id, newQuantity);
      if (result.error) {
        toast.error(result.error);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCart(item.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Item removed from cart");
      }
    });
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link href={`/product/${item.product.id}`}>
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2">
            {item.product.images[0] ? (
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-surface-3" />
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link href={`/product/${item.product.id}`}>
              <h4 className="font-semibold hover:text-accent-purple transition-colors">
                {item.product.name}
              </h4>
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatPrice(item.product.price)} each
            </p>
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={isPending || item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={isPending || item.quantity >= item.product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Subtotal & Remove */}
            <div className="flex items-center gap-4">
              <span className="font-bold">
                {formatPrice(item.product.price * item.quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleRemove}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
