"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Trash2, Pencil} from "lucide-react";
import {useProductsStore} from "@/store/products";
import {useRouter, notFound} from "next/navigation";
import {useState, use} from "react";
import Image from "next/image";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const product = useProductsStore((state) => state.getProductById(id));
  const removeProduct = useProductsStore((state) => state.removeProduct);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsDeleting(true);

    try {
      // Delete from store
      removeProduct(id);

      // Also delete from API
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      // Redirect to products page
      router.push("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
      setIsDeleting(false);
    }
  };

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <section className="space-y-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-black -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          <div className="space-y-6">
            {/* Image */}
            <div className="relative w-full h-96 bg-neutral-100 border border-neutral-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black">
                  {product.name}
                </h1>
                <p className="text-4xl font-bold text-black">{product.price}</p>
                <p className="text-sm text-neutral-500 capitalize">Category: {product.category}</p>
              </div>

              <div className="flex gap-2">
                <Link href={`/products/${id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-8 mt-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Description
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-neutral-200 pt-8 mt-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                Product Details
              </h2>
              <dl className="space-y-4">
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="font-semibold text-black">Product ID</dt>
                  <dd className="text-neutral-600">{product.id}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="font-semibold text-black">Name</dt>
                  <dd className="text-neutral-600">{product.name}</dd>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-3">
                  <dt className="font-semibold text-black">Price</dt>
                  <dd className="text-neutral-600">{product.price}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}