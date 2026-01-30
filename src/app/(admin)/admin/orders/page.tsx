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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Manage customer orders and update statuses
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
          <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">No orders yet</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Orders will appear here when customers make purchases.
          </p>
        </Card>
      ) : (
        <AdminOrdersTable orders={orders} />
      )}
    </div>
  );
}
