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

export function generateStaticParams() {
  return [
    { id: '1' },
  ];
}
