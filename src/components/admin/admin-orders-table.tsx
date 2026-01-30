"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, Truck, Package, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-4 sm:space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-muted/50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-xs sm:text-sm">{order.id.slice(0, 12)}...</p>
          </div>
          <div className="space-y-0.5 sm:space-y-1 hidden sm:block">
            <p className="text-xs sm:text-sm text-muted-foreground">Date</p>
            <p className="text-xs sm:text-sm">{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            <p className="font-bold text-primary text-sm sm:text-base">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Badge variant={config.variant} className="gap-1 text-xs">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>

          <Select
            value={order.status}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            disabled={isPending}
          >
            <SelectTrigger className="w-32 sm:w-40 h-9">
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
      <div className="p-3 sm:p-4 grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <div>
          <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base text-foreground">
            <User className="h-4 w-4" />
            Customer
          </h4>
          <p className="text-xs sm:text-sm">
            <span className="text-muted-foreground">Name:</span>{" "}
            <span className="text-foreground">{order.user.name || "N/A"}</span>
          </p>
          <p className="text-xs sm:text-sm">
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="text-foreground">{order.user.email || "N/A"}</span>
          </p>

          <h4 className="font-semibold mt-3 sm:mt-4 mb-2 flex items-center gap-2 text-sm sm:text-base text-foreground">
            <MapPin className="h-4 w-4" />
            Shipping Address
          </h4>
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

        {/* Items */}
        <div>
          <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base text-foreground">
            <Package className="h-4 w-4" />
            Items ({order.items.length})
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 sm:gap-3">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-foreground">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
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
