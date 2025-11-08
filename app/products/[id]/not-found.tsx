import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-6 py-24 max-w-4xl">
        <Link href="/products">
          <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-black -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="mt-16 text-center space-y-4">
          <h1 className="text-4xl font-bold text-black">Product Not Found</h1>
          <p className="text-xl text-neutral-600">
            The product you are looking for does not exist.
          </p>
        </div>
      </main>
    </div>
  );
}
