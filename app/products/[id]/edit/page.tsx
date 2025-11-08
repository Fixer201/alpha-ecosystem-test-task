"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {FormEvent, useState, use} from "react";
import {useProductsStore} from "@/store/products";
import {useRouter, notFound} from "next/navigation";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const product = useProductsStore((state) => state.getProductById(id));
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as string;
    const category = formData.get("category") as string;

    try {
      // Update in local store
      updateProduct(id, {
        name,
        description,
        price: `$${price}`,
        image,
        category,
      });

      // Also update via API
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: `$${price}`,
          image,
          category,
        }),
      });

      // Redirect back to product detail
      router.push(`/products/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-6 py-24 max-w-2xl">
        <section className="space-y-8">
          <Link href={`/products/${id}`}>
            <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-black -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Product
            </Button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black">
              Edit Product
            </h1>
            <p className="text-xl text-neutral-600">
              Update product information
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-black">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product.name}
              className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-black">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={product.description}
              className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors resize-none"
              placeholder="Describe your product"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-semibold text-black">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                $
              </span>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.10"
                defaultValue={product.price.replace('$', '')}
                className="w-full pl-8 pr-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-semibold text-black">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              defaultValue={product.image}
              className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-black">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={product.category}
              className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors capitalize"
            >
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-400"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
            <Link href={`/products/${id}`}>
              <Button type="button" variant="outline" size="lg" className="border-black text-black hover:bg-neutral-100">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
