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

export function generateStaticParams() {
    return [
        { id: '1' },
    ];
}
