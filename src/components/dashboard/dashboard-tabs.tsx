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
      <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
        <TabsTrigger value="cart" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {cartItems.length > 0 && (
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
              {cartItems.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="orders" className="gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Orders</span>
          {orders.length > 0 && (
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              {orders.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="likes" className="gap-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Likes</span>
          {likedProducts.length > 0 && (
            <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 font-medium">
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
