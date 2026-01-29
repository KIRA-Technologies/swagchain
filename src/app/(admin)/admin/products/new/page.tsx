import { Card } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/product-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="mt-1 text-muted-foreground">
          Create a new product for your store
        </p>
      </div>

      <Card className="p-6">
        <ProductForm />
      </Card>
    </div>
  );
}
