"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, Truck, Package, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { updateOrderStatus } from "@/actions/orders";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";

interface AdminOrder {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  paidAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  user: { name: string | null; email: string | null };
  address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: { name: string; images: string[] };
  }>;
}

interface AdminOrdersTableProps {
  orders: AdminOrder[];
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <AdminOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function AdminOrderCard({ order }: { order: AdminOrder }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Order status updated");
      }
    });
  };

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
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{order.id.slice(0, 12)}...</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-sm">{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-bold gradient-text">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant={config.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>

          <Select
            value={order.status}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            disabled={isPending}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREATED">Awaiting Payment</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Customer & Items */}
      <div className="p-4 grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer
          </h4>
          <p className="text-sm">
            <span className="text-muted-foreground">Name:</span>{" "}
            {order.user.name || "N/A"}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Email:</span>{" "}
            {order.user.email || "N/A"}
          </p>

          <h4 className="font-semibold mt-4 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Shipping Address
          </h4>
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

        {/* Items */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items ({order.items.length})
          </h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-4 w-4 text-surface-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
