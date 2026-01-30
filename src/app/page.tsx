import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getProducts } from "@/actions/products";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { SearchBar } from "@/components/products/search-bar";
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import Link from "next/link";
import type { ProductFilters as Filters } from "@/types";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const session = await auth();
  const cartCount = session ? await getCartCount() : 0;

  const filters: Filters = {
    search: params.search,
    category: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    sort: params.sort as Filters["sort"],
  };

  const hasFilters = Object.values(params).some(Boolean);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar cartCount={cartCount} />

      <main className="flex-1">
        {/* Hero Section */}
        {!hasFilters && <HeroSection />}

        {/* Products Section */}
        <section id="products" className="py-8 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {hasFilters ? "Search Results" : "Shop All"}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base mt-1">
                    Crypto-themed merch for the community
                  </p>
                </div>
                <div className="w-full sm:w-72">
                  <Suspense fallback={null}>
                    <SearchBar />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Filters - Desktop Sidebar */}
              <aside className="hidden lg:block lg:w-64 shrink-0">
                <div className="sticky top-24">
                  <Suspense fallback={null}>
                    <ProductFilters />
                  </Suspense>
                </div>
              </aside>

              {/* Mobile Filters */}
              <div className="lg:hidden">
                <Suspense fallback={null}>
                  <MobileFilters />
                </Suspense>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                <Suspense fallback={<ProductGridSkeleton />}>
                  <ProductsLoader
                    filters={filters}
                    isAuthenticated={!!session}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        {!hasFilters && <FeaturesSection />}
      </main>

      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-surface-2/50 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Premium Crypto
            <span className="text-primary"> Swag</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            Rep your favorite chains with style. High-quality merch,
            pay with crypto via Kira-Pay.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="#products">
              <Button size="lg" className="w-full sm:w-auto">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {/* <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: "Pay with Crypto",
      description: "ETH, USDC, USDT via Kira-Pay",
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "Enterprise-grade security",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Worldwide delivery",
    },
  ];

  return (
    <section className="border-t border-border bg-surface-1">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 sm:flex-col sm:text-center sm:gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileFilters() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <Link href="/">
        <Button variant="secondary" size="sm" className="whitespace-nowrap">
          All
        </Button>
      </Link>
      <Link href="/?category=Hoodies">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Hoodies
        </Button>
      </Link>
      <Link href="/?category=T-Shirts">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          T-Shirts
        </Button>
      </Link>
      <Link href="/?category=Hats">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Hats
        </Button>
      </Link>
      <Link href="/?category=Mugs">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Mugs
        </Button>
      </Link>
      <Link href="/?category=Accessories">
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Accessories
        </Button>
      </Link>
    </div>
  );
}

async function ProductsLoader({
  filters,
  isAuthenticated,
}: {
  filters: Filters;
  isAuthenticated: boolean;
}) {
  const products = await getProducts(filters);

  return <ProductGrid products={products} isAuthenticated={isAuthenticated} />;
}
