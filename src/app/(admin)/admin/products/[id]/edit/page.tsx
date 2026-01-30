import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/product-form";
import { ChevronLeft } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Products
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Product</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Update product details
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <ProductForm product={product} />
      </Card>
    </div>
  );
}
