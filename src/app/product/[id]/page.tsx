import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getProductById } from "@/actions/products";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceTag } from "@/components/shared/price-tag";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { ProductActions } from "./product-actions";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const session = await auth();
  const cartCount = session ? await getCartCount() : 0;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar cartCount={cartCount} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-1">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingCart className="h-24 w-24 text-surface-3" />
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-1"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.featured && <Badge variant="gradient">Featured</Badge>}
                </div>
                <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <RatingStars rating={product.rating} size="lg" />
                <span className="text-muted-foreground">
                  ({product.ratingCount} reviews)
                </span>
              </div>

              <PriceTag price={product.price} size="xl" />

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-400">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-destructive">Out of Stock</span>
                )}
              </div>

              {product.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />

              <ProductActions
                product={product}
                isAuthenticated={!!session}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
