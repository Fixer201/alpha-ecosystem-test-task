"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ProductCard} from "@/components/ProductCard";
import {ArrowLeft, Search} from "lucide-react";
import {useProductsStore} from "@/store/products";
import {useEffect, useMemo, useState} from "react";
import {ITEMS_PER_PAGE} from "@/lib/constants";

export default function ProductsPage() {
    const products = useProductsStore((state) => state.products);
    const isLoading = useProductsStore((state) => state.isLoading);
    const fetchProducts = useProductsStore((state) => state.fetchProducts);

    const [searchQuery, setSearchQuery] = useState("");
    const [favoriteFilter, setFavoriteFilter] = useState<"all" | "favorites">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch products on mount if empty
    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [products.length, fetchProducts]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(products.map((p) => p.category));
        return Array.from(cats);
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Favorite filter
        if (favoriteFilter === "favorites") {
            filtered = filtered.filter((p) => p.isFavorite);
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "price-asc") {
                return parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""));
            } else {
                return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
            }
        });

        return filtered;
    }, [products, searchQuery, favoriteFilter, categoryFilter, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, favoriteFilter, categoryFilter, sortBy]);

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-6 py-24 max-w-7xl">
                <section className="space-y-8 mb-12">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-black -ml-2">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Home
                        </Button>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black">
                            All Products
                        </h1>
                        <p className="text-xl text-neutral-600">
                            Browse our complete collection
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"/>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Favorite Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-black">Show</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFavoriteFilter("all")}
                                    className={`flex-1 px-4 py-2 border transition-colors ${
                                        favoriteFilter === "all"
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-neutral-300 hover:border-black"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFavoriteFilter("favorites")}
                                    className={`flex-1 px-4 py-2 border transition-colors ${
                                        favoriteFilter === "favorites"
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-neutral-300 hover:border-black"
                                    }`}
                                >
                                    Favorites
                                </button>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-semibold text-black">Category</label>
                            <select
                                id="category"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-neutral-300 focus:border-black focus:outline-none transition-colors capitalize"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="capitalize">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="space-y-2">
                            <label htmlFor="sort" className="text-sm font-semibold text-black">Sort By</label>
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                className="w-full px-4 py-2 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                            >
                                <option value="name">Name</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <span className="text-sm text-neutral-600">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </span>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="mb-12">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600">Loading products...</p>
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-600">No products found</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <section className="flex justify-center items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="border-black text-black hover:bg-black hover:text-white disabled:opacity-50"
                        >
                            Previous
                        </Button>

                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 border transition-colors ${
                                    currentPage === page
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-black border-neutral-300 hover:border-black"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="border-black text-black hover:bg-black hover:text-white disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </section>
                )}
            </main>
        </div>
    );
}