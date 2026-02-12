import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/actions/orders";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Package, ArrowRight } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const params = await searchParams;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!params.orderId) {
    redirect("/dashboard?tab=orders");
  }

  const order = await getOrderById(params.orderId);
  const cartCount = await getCartCount();

  if (!order) {
    redirect("/dashboard?tab=orders");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar cartCount={cartCount} />

      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4">
        <Card className="w-full max-w-lg p-6 sm:p-8 text-center">
          {/* Success/Pending Icon */}
          {order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED" ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-accent/20">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Payment Successful!</h1>
              <p className="text-muted-foreground text-sm sm:text-base mb-6">
                Thank you for your order. Your crypto payment has been confirmed.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-yellow-500/20">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">Order Created</h1>
              <p className="text-muted-foreground text-sm sm:text-base mb-6">
                Your order has been created. Complete payment to confirm your order.
              </p>
              {order.kiraPayUrl && (
                <a href={order.kiraPayUrl} className="block mb-4">
                  <Button className="w-full" size="lg">
                    Complete Payment
                  </Button>
                </a>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Payment status updates automatically via webhook. You can refresh if it’s delayed.
              </p>
              <Link href={`/order/success?orderId=${order.id}`}>
                <Button variant="outline" className="w-full">
                  Refresh Status
                </Button>
              </Link>
            </>
          )}

          <Separator className="my-6" />

          {/* Order Details */}
          <div className="text-left space-y-3 sm:space-y-4">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs sm:text-sm">{order.id.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Date</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED" ? "success" : "secondary"}>
                {order.status === "CREATED" ? "Pending Payment" : order.status}
              </Badge>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Items</span>
              <span>{order.items.length} product(s)</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Shipping Info */}
          <div className="text-left">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Package className="h-4 w-4" />
              Shipping To
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {order.address.fullName}
              <br />
              {order.address.street}
              <br />
              {order.address.city}, {order.address.state} {order.address.postalCode}
              <br />
              {order.address.country}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard?tab=orders">
              <Button className="w-full group">
                View Order Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
