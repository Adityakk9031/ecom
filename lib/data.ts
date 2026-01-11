import { prisma } from "@/lib/prisma";
import { fetchExternalProducts, type Product } from "@/lib/fakeStore";

export async function getAllProducts(): Promise<Product[]> {
    // User requested "short term fix": Push all data to DB and rely on it.
    // We have seeded the DB, so now we strictly fetch from there.
    // This avoids duplicates and external API failures.

    let localProducts: any[] = [];
    try {
        localProducts = await prisma.product.findMany();
    } catch (error) {
        console.error("Database connection failed:", error);
        return [];
    }

    // Format Local
    const formattedLocalProducts: Product[] = localProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description || "",
        category: p.category || "",
        image: p.image,
        rating: (p.rating as any) || { rate: 0, count: 0 },
        source: "local",
    }));

    return formattedLocalProducts;
}
