import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchExternalProducts, type Product } from "@/lib/fakeStore";

export const dynamic = 'force-dynamic';

import { getAllProducts } from "@/lib/data";

export async function GET() {
    const allProducts = await getAllProducts();
    return NextResponse.json(allProducts);
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        // For testing/demo: Accept ANY token as long as it's present
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, price, description, category, image, rating } = body;

        if (!title || !price || !image) {
            return NextResponse.json(
                { error: { message: "Missing required fields", code: "INVALID_INPUT" } },
                { status: 400 }
            );
        }

        try {
            new URL(image);
        } catch {
            return NextResponse.json(
                { error: { message: "Invalid image URL", code: "INVALID_INPUT" } },
                { status: 400 }
            );
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                price,
                description,
                category,
                image,
                rating: rating || { rate: 0, count: 0 },
            },
        });

        const formattedProduct: Product = {
            id: newProduct.id,
            title: newProduct.title,
            price: newProduct.price,
            description: newProduct.description || "",
            category: newProduct.category || "",
            image: newProduct.image,
            rating: (newProduct.rating as any) || { rate: 0, count: 0 },
            source: "local",
        };

        return NextResponse.json(formattedProduct, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
