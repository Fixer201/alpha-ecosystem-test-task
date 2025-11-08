"use client";

import Link from "next/link";
import {Heart, Trash2} from "lucide-react";
import {useProductsStore} from "@/store/products";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isFavorite: boolean;
}

export function ProductCard({ id, name, description, price, image, isFavorite }: ProductCardProps) {
  const toggleFavorite = useProductsStore((state) => state.toggleFavorite);
  const removeProduct = useProductsStore((state) => state.removeProduct);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this product?")) {
      removeProduct(id);
    }
  };

  return (
    <Link href={`/products/${id}`}>
      <article className="border border-neutral-200 hover:border-black transition-colors h-full flex flex-col group cursor-pointer">
        <div className="relative w-full h-48 bg-neutral-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors ${
                isFavorite ? "text-red-500" : "text-neutral-600"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-neutral-600 hover:text-red-600 transition-colors"
              aria-label="Delete product"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-black line-clamp-2 break-words">
            {name}
          </h3>
          <p className="text-neutral-600 text-sm line-clamp-3 break-words">
            {description}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <span className="text-xl font-bold text-black">
              {price}
            </span>
            <span className="text-sm text-neutral-500 group-hover:text-black transition-colors">
              View details →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
