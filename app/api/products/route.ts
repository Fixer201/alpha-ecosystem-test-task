import {NextRequest, NextResponse} from 'next/server';

// In-memory storage
const products = [
    {
        id: "1",
        name: "Premium Package",
        description: "Everything you need to get started",
        price: "$99",
    },
    {
        id: "2",
        name: "Starter Kit",
        description: "Perfect for beginners",
        price: "$49",
    },
    {
        id: "3",
        name: "Enterprise Solution",
        description: "Advanced features for teams",
        price: "$299",
    },
    {
        id: "4",
        name: "Custom Plan",
        description: "Tailored to your needs",
        price: "$199",
    },
];

export async function GET() {
    return NextResponse.json({products});
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {name, description, price} = body;

        if (!name || !description || !price) {
            return NextResponse.json(
                {error: 'Missing required fields'},
                {status: 400}
            );
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            price,
        };

        products.push(newProduct);

        return NextResponse.json({product: newProduct}, {status: 201});
    } catch (error) {
        return NextResponse.json(
            {error: 'Invalid request body'},
            {status: 400}
        );
    }
}
