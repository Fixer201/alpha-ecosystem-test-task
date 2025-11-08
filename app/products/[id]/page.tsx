import ProductDetailClient from "./ProductDetailClient";

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function ProductDetailPage({params}: ProductDetailPageProps) {
    const {id} = await params;

    return <ProductDetailClient id={id} />;
}

export async function generateStaticParams() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();

        return products.map((product: any) => ({
            id: product.id.toString(),
        }));
    } catch (error) {
        console.error('Failed to fetch products for static generation:', error);
        return [];
    }
}
