"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_CATEGORIES } from "@/types";

interface ProductFiltersProps {
  maxPrice?: number;
}

export function ProductFilters({ maxPrice = 500 }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || maxPrice;
  const minRating = Number(searchParams.get("minRating")) || 0;
  const sort = searchParams.get("sort") || "newest";

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === 0) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const updateFilters = (params: Record<string, string | number | null>) => {
    const queryString = createQueryString(params);
    router.push(`/?${queryString}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push("/", { scroll: false });
  };

  const hasActiveFilters =
    category || minPrice > 0 || maxPriceParam < maxPrice || minRating > 0;

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-muted-foreground">Category</Label>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={cat}
                checked={category === cat}
                onCheckedChange={(checked) =>
                  updateFilters({ category: checked ? cat : null })
                }
              />
              <label
                htmlFor={cat}
                className="text-sm cursor-pointer hover:text-accent-purple transition-colors"
              >
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-muted-foreground">
          Price Range: ${minPrice} - ${maxPriceParam}
        </Label>
        <Slider
          value={[minPrice, maxPriceParam]}
          min={0}
          max={maxPrice}
          step={10}
          onValueChange={([min, max]) =>
            updateFilters({ minPrice: min, maxPrice: max })
          }
          className="py-2"
        />
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-muted-foreground">Minimum Rating</Label>
        <Select
          value={minRating.toString()}
          onValueChange={(value) =>
            updateFilters({ minRating: Number(value) || null })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any rating</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="2">2+ stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-muted-foreground">Sort By</Label>
        <Select
          value={sort}
          onValueChange={(value) => updateFilters({ sort: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
