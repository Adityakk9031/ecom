import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchExternalProduct, type Product } from "@/lib/fakeStore";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    try {
        if (id.startsWith("external:")) {
            const externalId = parseInt(id.split(":")[1]);
            if (isNaN(externalId)) {
                return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
            }
            const product = await fetchExternalProduct(externalId);
            if (!product) {
                return NextResponse.json({ message: "Product not found" }, { status: 404 });
            }
            return NextResponse.json(product);
        } else {
            // Local product
            const product = await prisma.product.findUnique({
                where: { id },
            });

            if (!product) {
                return NextResponse.json({ message: "Product not found" }, { status: 404 });
            }

            const formattedProduct: Product = {
                id: product.id,
                title: product.title,
                price: product.price,
                description: product.description || "",
                category: product.category || "",
                image: product.image,
                rating: (product.rating as any) || { rate: 0, count: 0 },
                source: "local",
            };

            return NextResponse.json(formattedProduct);
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
