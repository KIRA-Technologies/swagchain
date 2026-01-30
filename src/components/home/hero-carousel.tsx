"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    badge: "New Collection",
    title: "Premium Crypto",
    highlight: "Swag",
    description: "Rep your favorite chains with style. High-quality merch for the web3 community.",
    cta: "Shop Now",
    ctaLink: "#products",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop",
  },
  {
    id: 2,
    badge: "Pay with Crypto",
    title: "Seamless",
    highlight: "Payments",
    description: "ETH, USDC, USDT - pay your way with Kira-Pay. Fast and secure.",
    cta: "Learn More",
    ctaLink: "#products",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  },
  {
    id: 3,
    badge: "Limited Edition",
    title: "Exclusive",
    highlight: "Drops",
    description: "Get limited edition merch before they sell out. Premium quality guaranteed.",
    cta: "View Collection",
    ctaLink: "#products",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface-2 via-background to-surface-2/50">
      {/* Subtle Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              key={`badge-${slide.id}`}
            >
              <Sparkles className="w-4 h-4" />
              {slide.badge}
            </div>

            {/* Title */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              key={`title-${slide.id}`}
            >
              {slide.title}
              <span className="block text-primary">{slide.highlight}</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 mb-8"
              key={`desc-${slide.id}`}
            >
              {slide.description}
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start mb-10">
              <Link href={slide.ctaLink}>
                <Button size="lg" className="group text-base px-8 h-12 shadow-lg shadow-primary/20">
                  {slide.cta}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <span>Crypto Payments</span>
              </div>
              <span className="text-border">•</span>
              <span>Powered by <strong className="text-foreground">Kira-Pay</strong></span>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10 bg-surface-2">
                {slides.map((s, index) => (
                  <div
                    key={s.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out",
                      index === currentSlide
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    )}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={index === 0}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                ))}

                {/* Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3">
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-2xl font-bold text-primary">$19.99</p>
                  </div>
                  <div className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                    Trending
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  )}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
