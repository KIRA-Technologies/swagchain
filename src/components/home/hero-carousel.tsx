"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Shield } from "lucide-react";
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
    bgGradient: "from-primary/10 via-transparent to-accent/10",
  },
  {
    id: 2,
    badge: "Pay with Crypto",
    title: "Seamless",
    highlight: "Payments",
    description: "ETH, USDC, USDT - pay your way with Kira-Pay integration.",
    cta: "Learn More",
    ctaLink: "#products",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    bgGradient: "from-accent/10 via-transparent to-secondary/10",
  },
  {
    id: 3,
    badge: "Limited Edition",
    title: "Exclusive",
    highlight: "Drops",
    description: "Get limited edition merch before they sell out. Premium quality.",
    cta: "View Collection",
    ctaLink: "#products",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
    bgGradient: "from-secondary/10 via-transparent to-primary/10",
  },
];

const features = [
  { icon: Zap, text: "Instant Checkout" },
  { icon: Shield, text: "Secure Payments" },
  { icon: Sparkles, text: "Premium Quality" },
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
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-2 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-50" />

      {/* Animated Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
          slide.bgGradient
        )}
      />

      {/* Decorative Elements - Hidden on mobile */}
      <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20">
        {/* Mobile Layout: Stacked */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

          {/* Image Section - First on mobile */}
          <div className="relative mb-6 lg:mb-0 lg:order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-sm lg:max-w-lg mx-auto">
              {/* Decorative Ring - Hidden on small mobile */}
              <div className="hidden sm:block absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-dashed border-primary/20 rotate-3" />

              {/* Main Image Container */}
              <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-surface-2">
                {slides.map((s, index) => (
                  <div
                    key={s.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-in-out",
                      index === currentSlide
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 z-0"
                    )}
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br", s.bgGradient)} />
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 384px, 512px"
                      className="object-cover"
                      priority={index === 0}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ))}

                {/* Price Tag - Smaller on mobile */}
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-1 sm:px-4 sm:py-2 shadow-lg">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Starting from</p>
                  <p className="text-base sm:text-xl font-bold text-primary">$19.99</p>
                </div>

                {/* Trending Badge */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-accent text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                  Trending
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute -left-2 sm:left-0 lg:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-surface-2 transition-colors z-30"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-2 sm:right-0 lg:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-surface-2 transition-colors z-30"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Slide Indicators - Below image on mobile */}
            <div className="flex justify-center gap-2 mt-4 lg:hidden">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-border"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center lg:text-left lg:order-1">
            {/* Badge Row */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs sm:text-sm font-medium"
                key={`badge-${slide.id}`}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                {slide.badge}
              </div>

              {/* Powered by Kira-Pay - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-md">
                <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center">
                  <Shield className="w-3 h-3 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground leading-none">Powered by</p>
                  <p className="text-xs font-semibold leading-tight">Kira-Pay</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 sm:mb-4"
              key={`title-${slide.id}`}
            >
              {slide.title}
              <span className="block text-primary mt-0.5 sm:mt-1">{slide.highlight}</span>
            </h1>

            {/* Description */}
            <p
              className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-5 sm:mb-6"
              key={`desc-${slide.id}`}
            >
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5 sm:mb-6">
              <Link href={slide.ctaLink} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group shadow-lg shadow-primary/25">
                  {slide.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Features - Compact on mobile */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              {features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent-light">
                    <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Crypto Accepted - Mobile only */}
            <div className="mt-4 flex justify-center lg:hidden">
              <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-md">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground leading-none">Crypto Accepted</p>
                  <p className="text-sm font-semibold leading-tight">ETH • USDC • USDT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators - Desktop only */}
        <div className="hidden lg:flex justify-center gap-2 mt-10">
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
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
