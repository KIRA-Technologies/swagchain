import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orderItems: true, likes: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
          <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">No products yet</h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            Get started by adding your first product.
          </p>
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                {/* Image */}
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-muted">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate text-sm sm:text-base text-foreground">{product.name}</h3>
                    {product.featured && (
                      <Badge className="shrink-0 text-xs">Featured</Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                    </span>
                    <span className="hidden sm:inline">Stock: {product.stock}</span>
                    <span className="hidden md:inline">Category: {product.category}</span>
                    <span className="hidden lg:inline">Orders: {product._count.orderItems}</span>
                    <span className="hidden lg:inline">Likes: {product._count.likes}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
