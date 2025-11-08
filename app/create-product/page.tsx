"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {FormEvent, useState} from "react";
import {useProductsStore} from "@/store/products";
import {useRouter} from "next/navigation";

export default function CreateProductPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addProduct = useProductsStore((state) => state.addProduct);
    const router = useRouter();

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
            // Add to local store
            addProduct({
                name,
                description,
                price: `$${price}`,
                image: image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E",
                category: category || 'other',
            });

            // Also send to API
            const response = await fetch('/api/products', {
                method: 'POST',
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

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            // Redirect to products page
            router.push('/products');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-6 py-24 max-w-2xl">
                <section className="space-y-8">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-black -ml-2">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Home
                        </Button>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black">
                            Create Product
                        </h1>
                        <p className="text-xl text-neutral-600">
                            Add a new product to your collection
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
                            className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-neutral-500">Optional: Leave empty for placeholder image</p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-semibold text-black">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
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
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </Button>
                        <Link href="/">
                            <Button type="button" variant="outline" size="lg"
                                    className="border-black text-black hover:bg-neutral-100">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}