"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProduct, updateProduct } from "@/actions/products";
import { PRODUCT_CATEGORIES } from "@/types";
import { toast } from "sonner";
import type { Product } from "@prisma/client";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  images: z.string(),
  keywords: z.string(),
  featured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          images: product.images.join(", "),
          keywords: product.keywords.join(", "),
          featured: product.featured,
        }
      : {
          featured: false,
        },
  });

  const onSubmit = (data: ProductFormData) => {
    startTransition(async () => {
      const images = data.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const keywords = data.keywords
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        images,
        keywords,
        featured: data.featured,
      };

      const result = product
        ? await updateProduct(product.id, productData)
        : await createProduct(productData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(product ? "Product updated" : "Product created");
        router.push("/admin/products");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Bitcoin Hoodie"
          {...register("name")}
          disabled={isPending}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Premium quality hoodie with Bitcoin logo..."
          {...register("description")}
          disabled={isPending}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Price & Stock */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="89.99"
            {...register("price", { valueAsNumber: true })}
            disabled={isPending}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            placeholder="100"
            {...register("stock", { valueAsNumber: true })}
            disabled={isPending}
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={product?.category}
          disabled={isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (comma-separated)</Label>
        <Textarea
          id="images"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          {...register("images")}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Enter image URLs separated by commas
        </p>
        {errors.images && (
          <p className="text-sm text-destructive">{errors.images.message}</p>
        )}
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
        <Input
          id="keywords"
          placeholder="bitcoin, btc, hoodie, crypto"
          {...register("keywords")}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Keywords help users find this product through search
        </p>
        {errors.keywords && (
          <p className="text-sm text-destructive">{errors.keywords.message}</p>
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="featured"
          checked={watch("featured")}
          onCheckedChange={(checked) => setValue("featured", !!checked)}
          disabled={isPending}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Featured Product (shown on homepage)
        </Label>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? "Updating..." : "Creating..."}
            </>
          ) : product ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
