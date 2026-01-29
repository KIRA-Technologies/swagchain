import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getProducts, getFeaturedProducts } from "@/actions/products";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { SearchBar } from "@/components/products/search-bar";
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
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
        {/* Hero Section - Only show when no filters */}
        {!hasFilters && <HeroSection />}

        {/* Products Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                {hasFilters ? "Search Results" : "All Products"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                Browse our collection of crypto-themed merchandise
              </p>
            </div>
            <div className="w-full md:w-80">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <Suspense fallback={null}>
                  <ProductFilters />
                </Suspense>
              </div>
            </aside>

            {/* Product Grid */}
            <div>
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductsLoader
                  filters={filters}
                  isAuthenticated={!!session}
                />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {!hasFilters && <FeaturesSection />}
      </main>

      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">Crypto Swag</span>
              <span className="block">For The</span>
              <span className="gradient-text">Bold</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Premium merchandise for the crypto community. Rep your favorite
              chains and protocols with style. Pay seamlessly with crypto via
              Kira-Pay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#products">
                <Button size="xl" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-96 w-96">
                <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-accent-purple via-accent-pink to-accent-cyan opacity-20 blur-3xl" />
                <div className="absolute inset-8 flex items-center justify-center rounded-3xl border border-border bg-card/50 backdrop-blur-xl">
                  <Zap className="h-32 w-32 text-accent-purple animate-float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Pay with Crypto",
      description: "Seamless payments via Kira-Pay. ETH, USDC, and more.",
    },
    {
      icon: Shield,
      title: "Secure & Fast",
      description: "Enterprise-grade security with instant confirmations.",
    },
    {
      icon: Truck,
      title: "Worldwide Shipping",
      description: "Fast delivery to crypto enthusiasts everywhere.",
    },
  ];

  return (
    <section className="border-t border-border bg-surface-1/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card/50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 mb-4">
                <feature.icon className="h-7 w-7 text-accent-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
