"use client";

import Image from "next/image";
import { Package, Clock, CheckCircle2, Truck, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { OrderWithDetails } from "@/types";
import { OrderStatus } from "@prisma/client";

interface OrdersTableProps {
  orders: OrderWithDetails[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Once you make a purchase, your orders will appear here."
        action={{
          label: "Start Shopping",
          onClick: () => (window.location.href = "/"),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: OrderWithDetails }) {
  const statusConfig: Record<
    OrderStatus,
    { label: string; variant: "default" | "warning" | "success" | "secondary"; icon: typeof Clock }
  > = {
    CREATED: { label: "Awaiting Payment", variant: "warning", icon: Clock },
    PAID: { label: "Paid", variant: "success", icon: CheckCircle2 },
    SHIPPED: { label: "Shipped", variant: "default", icon: Truck },
    DELIVERED: { label: "Delivered", variant: "success", icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", variant: "secondary", icon: Clock },
  };

  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-2/50 p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="text-sm">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-bold gradient-text">{formatPrice(order.totalAmount)}</p>
        </div>
        <Badge variant={config.variant} className="gap-1">
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </Badge>
      </div>

      <Separator />

      {/* Items */}
      <div className="p-4 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-6 w-6 text-surface-3" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Shipping Address */}
      <div className="p-4 flex items-start gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{order.address.fullName}</span>
          <br />
          {order.address.street}, {order.address.city}, {order.address.state}{" "}
          {order.address.postalCode}, {order.address.country}
        </div>
      </div>
    </Card>
  );
}
