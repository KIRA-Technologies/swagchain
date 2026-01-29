import prisma from "@/lib/prisma";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: {
        include: {
          product: { select: { name: true, images: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Manage customer orders and update statuses
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-bold text-lg mb-2">No orders yet</h3>
          <p className="text-muted-foreground">
            Orders will appear here when customers make purchases.
          </p>
        </Card>
      ) : (
        <AdminOrdersTable orders={orders} />
      )}
    </div>
  );
}
