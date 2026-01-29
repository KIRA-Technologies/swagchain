"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Package, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartTab } from "@/components/cart/cart-tab";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { LikesGrid } from "@/components/dashboard/likes-grid";
import type { CartItemWithProduct, OrderWithDetails, ProductWithLikes } from "@/types";

interface DashboardTabsProps {
  defaultTab: string;
  cartItems: CartItemWithProduct[];
  orders: OrderWithDetails[];
  likedProducts: ProductWithLikes[];
}

export function DashboardTabs({
  defaultTab,
  cartItems,
  orders,
  likedProducts,
}: DashboardTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="cart" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Cart
          {cartItems.length > 0 && (
            <span className="ml-1 rounded-full bg-accent-purple/20 px-2 py-0.5 text-xs text-accent-purple">
              {cartItems.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="orders" className="gap-2">
          <Package className="h-4 w-4" />
          Orders
          {orders.length > 0 && (
            <span className="ml-1 rounded-full bg-surface-3 px-2 py-0.5 text-xs">
              {orders.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="likes" className="gap-2">
          <Heart className="h-4 w-4" />
          Likes
          {likedProducts.length > 0 && (
            <span className="ml-1 rounded-full bg-accent-pink/20 px-2 py-0.5 text-xs text-accent-pink">
              {likedProducts.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cart">
        <CartTab cartItems={cartItems} />
      </TabsContent>

      <TabsContent value="orders">
        <OrdersTable orders={orders} />
      </TabsContent>

      <TabsContent value="likes">
        <LikesGrid products={likedProducts} />
      </TabsContent>
    </Tabs>
  );
}
