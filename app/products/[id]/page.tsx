import { Product, fetchExternalProduct } from "@/lib/fakeStore";
import { prisma } from "@/lib/prisma";
import Component from "./component";

// Server Component for fetching data
async function getProduct(id: string) {
    // If we are server-side, we can fetch directly to avoid self-referencing API fetch issues in some envs
    // But to stick to the requirement "Call /api/products/:id" or similar behavior logic:

    if (id.startsWith("external:")) {
        const externalId = parseInt(id.split(":")[1]);
        return fetchExternalProduct(externalId);
    } else {
        // Local
        const p = await prisma.product.findUnique({ where: { id } });
        if (!p) return null;
        return {
            id: p.id,
            title: p.title,
            price: p.price,
            description: p.description || "",
            category: p.category || "",
            image: p.image,
            rating: (p.rating as any) || { rate: 0, count: 0 },
            source: "local",
        } as Product;
    }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    return <Component product={product} />;
}
