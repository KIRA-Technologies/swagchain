"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "ETH Hoodie",
    price: "$49.99",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Crypto Watch",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    tag: "New",
  },
  {
    id: 3,
    name: "Web3 Tee",
    price: "$34.99",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop",
    tag: "Trending",
  },
];

export function HeroCarousel() {
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />

      {/* Animated Orbs */}
      <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Live: 127 orders today</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure Payments
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Instant Checkout
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          {/* Left - Text */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-8 border border-white/10">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span>Rated 4.9/5 by 2,500+ customers</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Premium
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Crypto Swag
              </span>
            </h1>

            <p className="text-xl text-white/70 max-w-lg mb-10 leading-relaxed">
              Rep your favorite chains with style. Premium quality merch,
              pay with ETH, USDC, or USDT via Kira-Pay.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="#products">
                <Button size="lg" className="h-14 px-8 text-base bg-white text-foreground hover:bg-white/90 shadow-xl shadow-white/10">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#products">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                  View All
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-white/50 text-sm">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-white/50 text-sm">Products Sold</p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.9</p>
                <p className="text-white/50 text-sm">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right - Product Cards */}
          <div className="relative h-[500px] lg:h-[600px]">
            {products.map((product, index) => {
              const isActive = index === activeProduct;
              const isPrev = index === (activeProduct - 1 + products.length) % products.length;
              const isNext = index === (activeProduct + 1) % products.length;

              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProduct(index)}
                  className={cn(
                    "absolute cursor-pointer transition-all duration-700 ease-out",
                    "w-[280px] sm:w-[320px] rounded-3xl overflow-hidden shadow-2xl",
                    isActive && "z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 opacity-100",
                    isPrev && "z-20 top-1/2 left-0 -translate-y-1/2 scale-90 opacity-60 hover:opacity-80",
                    isNext && "z-20 top-1/2 right-0 -translate-y-1/2 scale-90 opacity-60 hover:opacity-80",
                    !isActive && !isPrev && !isNext && "opacity-0 scale-75"
                  )}
                >
                  <div className="relative aspect-[4/5] bg-white/10 backdrop-blur-sm">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Tag */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      {product.tag}
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="font-semibold text-lg">{product.name}</p>
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Indicators */}
            <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveProduct(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === activeProduct
                      ? "w-8 bg-primary"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Marquee */}
        <div className="mt-8 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 mr-12">
                {["ETH", "USDC", "USDT", "BTC", "SOL", "MATIC"].map((coin) => (
                  <span key={coin} className="text-white/20 text-4xl font-bold tracking-wider">
                    {coin}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
