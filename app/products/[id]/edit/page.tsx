import EditProductClient from "./EditProductClient";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return <EditProductClient id={id} />;
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
