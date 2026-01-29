import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrderById, markOrderAsPaid } from "@/actions/orders";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
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

  // Mark order as paid (in real app, this would be done via webhook)
  await markOrderAsPaid(params.orderId);

  const order = await getOrderById(params.orderId);
  const cartCount = await getCartCount();

  if (!order) {
    redirect("/dashboard?tab=orders");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar cartCount={cartCount} />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. Your crypto payment has been confirmed.
          </p>

          <Separator className="my-6" />

          {/* Order Details */}
          <div className="text-left space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-sm">{order.id.slice(0, 12)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="success">Paid</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items</span>
              <span>{order.items.length} product(s)</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="gradient-text">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Shipping Info */}
          <div className="text-left">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Shipping To
            </h3>
            <p className="text-sm text-muted-foreground">
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
