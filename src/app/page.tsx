import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getProducts } from "@/actions/products";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { SearchBar } from "@/components/products/search-bar";
import { ProductGridSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Truck, Shield, CreditCard, Sparkles } from "lucide-react";
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
        {/* Hero Carousel */}
        {!hasFilters && <HeroCarousel />}

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

function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: "Pay with Crypto",
      description: "ETH, USDC, USDT accepted via Kira-Pay integration",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "Enterprise-grade security for every transaction",
      color: "accent",
    },
    {
      icon: Truck,
      title: "Global Shipping",
      description: "Fast worldwide delivery to your doorstep",
      color: "secondary",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "High-quality materials and unique designs",
      color: "primary",
    },
  ];

  const colorMap = {
    primary: { bg: "bg-primary-light", icon: "text-primary", border: "border-primary/20" },
    accent: { bg: "bg-accent-light", icon: "text-accent", border: "border-accent/20" },
    secondary: { bg: "bg-secondary-light", icon: "text-secondary", border: "border-secondary/20" },
  };

  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-surface-1 to-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Why Shop With <span className="text-primary">SwagChain</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The best crypto merchandise store with seamless payment experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const colors = colorMap[feature.color as keyof typeof colorMap];
            return (
              <div
                key={feature.title}
                className={`group relative bg-white rounded-2xl p-6 border ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 hover-lift`}
              >
                {/* Icon */}
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${colors.bg} opacity-50 rounded-bl-3xl rounded-tr-2xl -z-10`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to get your crypto swag?
          </p>
          <Link href="#products">
            <Button size="lg" variant="outline" className="border-2">
              Browse Collection
            </Button>
          </Link>
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
