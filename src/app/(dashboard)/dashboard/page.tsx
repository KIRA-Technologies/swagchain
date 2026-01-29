import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getCartItems } from "@/actions/cart";
import { getUserOrders } from "@/actions/orders";
import { getLikedProducts } from "@/actions/likes";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { Skeleton } from "@/components/shared/loading-skeleton";

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const session = await auth();
  const defaultTab = params.tab || "cart";

  const [cartItems, orders, likedProducts] = await Promise.all([
    getCartItems(),
    getUserOrders(),
    getLikedProducts(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your cart, orders, and liked products
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardTabs
          defaultTab={defaultTab}
          cartItems={cartItems}
          orders={orders}
          likedProducts={likedProducts}
        />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-80" />
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}
