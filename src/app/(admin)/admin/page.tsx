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
      color: "text-primary",
    },
    {
      label: "Total Orders",
      value: orderCount.toString(),
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "text-secondary",
    },
    {
      label: "Total Users",
      value: userCount.toString(),
      icon: Users,
      href: "#",
      color: "text-accent",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenue._sum.totalAmount || 0),
      icon: DollarSign,
      href: "/admin/orders",
      color: "text-primary",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Manage your products, orders, and store settings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 text-foreground">Product Management</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            Add, edit, or remove products from your store.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admin/products/new">
              <Button className="w-full sm:w-auto">Add New Product</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full sm:w-auto group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 text-foreground">Order Management</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            View and update order statuses.
          </p>
          <Link href="/admin/orders">
            <Button variant="outline" className="w-full sm:w-auto group">
              Manage Orders
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
