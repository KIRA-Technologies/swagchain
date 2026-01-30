import { redirect } from "next/navigation";
import { getCartItems } from "@/actions/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";

export default async function CheckoutPage() {
  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    redirect("/dashboard?tab=cart");
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard?tab=cart"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Cart
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Checkout</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Complete your order and pay with crypto
        </p>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div>
          <Card className="p-4 sm:p-6">
            <h2 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Shipping Information</h2>
            <CheckoutForm />
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-4 sm:p-6 sticky top-24">
            <h2 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Order Summary</h2>
            <OrderSummary cartItems={cartItems} subtotal={subtotal} />

            <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Secure payment powered by Kira-Pay
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
