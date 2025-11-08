"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, List} from "lucide-react";
import {ProductCard} from "@/components/ProductCard";
import {useProductsStore} from "@/store/products";
import {useEffect} from "react";

export default function Home() {
    const allProducts = useProductsStore((state) => state.products);
    const fetchProducts = useProductsStore((state) => state.fetchProducts);
    const isLoading = useProductsStore((state) => state.isLoading);

    // Fetch products on mount if empty
    useEffect(() => {
        if (allProducts.length === 0) {
            fetchProducts();
        }
    }, [allProducts.length, fetchProducts]);

    const popularProducts = allProducts.slice(0, 4);
    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-6 py-24 max-w-6xl">
                <section className="space-y-8 mb-24 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
                        Build your own future
                    </h1>

                    <p className="text-xl text-neutral-600 max-w-2xl">
                        Lots of people are waiting for your offer right now
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Link href="/create-product">
                            <Button size="lg" className="bg-black text-white hover:bg-neutral-800">
                                Create Product
                                <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </Link>
                        <Link href="/products">
                            <Button size="lg" className="bg-black text-white hover:bg-neutral-800">
                                Check another products
                                <List className="ml-2 h-4 w-4"/>
                            </Button>
                        </Link>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-black">
                            Popular Right Now
                        </h2>
                        <span className="text-sm text-neutral-600">
                          {popularProducts.length} products available
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600">Loading products...</p>
                        </div>
                    ) : popularProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600">No products available</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {popularProducts.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
