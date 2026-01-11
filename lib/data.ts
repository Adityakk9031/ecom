import { prisma } from "@/lib/prisma";
import { fetchExternalProducts, type Product } from "@/lib/fakeStore";

export async function getAllProducts(): Promise<Product[]> {
    let externalProducts: Product[] = [];
    let localProducts: any[] = [];

    // Parallel fetch for speed
    const [externalRes, localRes] = await Promise.allSettled([
        fetchExternalProducts(),
        prisma.product.findMany()
    ]);

    if (externalRes.status === 'fulfilled') {
        externalProducts = externalRes.value;
    } else {
        console.error("Failed to fetch external products:", externalRes.reason);
    }

    if (localRes.status === 'fulfilled') {
        localProducts = localRes.value;
    } else {
        console.error("Database connection failed, serving only external products:", localRes.reason);
    }

    // 3. Format Local
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

    // 4. Merge
    return [...externalProducts, ...formattedLocalProducts];
}
