import {NextRequest, NextResponse} from 'next/server';

// This should be shared with route.ts
const getProducts = () => {
    // fetch from database
    return [];
};

export async function GET(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    const products = getProducts();
    const product = products.find((p: any) => p.id === id);

    if (!product) {
        return NextResponse.json(
            {error: 'Product not found'},
            {status: 404}
        );
    }

    return NextResponse.json({product});
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;

    // delete from database
    return NextResponse.json({success: true});
}

export async function PATCH(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    const body = await request.json();

    // update in database
    return NextResponse.json({product: {id, ...body}});
}
