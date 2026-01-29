import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, DollarSign, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, userCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { totalAmount: true },
    }),
  ]);

  const stats = [
    {
      label: "Total Products",
      value: productCount.toString(),
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: orderCount.toString(),
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      label: "Total Users",
      value: userCount.toString(),
      icon: Users,
      href: "#",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenue._sum.totalAmount || 0),
      icon: DollarSign,
      href: "/admin/orders",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your products, orders, and store settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-accent-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Product Management</h2>
          <p className="text-muted-foreground mb-4">
            Add, edit, or remove products from your store.
          </p>
          <div className="flex gap-3">
            <Link href="/admin/products/new">
              <Button>Add New Product</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Order Management</h2>
          <p className="text-muted-foreground mb-4">
            View and update order statuses.
          </p>
          <Link href="/admin/orders">
            <Button variant="outline" className="group">
              Manage Orders
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
