export type Rating = {
    rate: number;
    count: number;
};

export type Product = {
    id: string;
    externalId?: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: Rating;
    source: "external" | "local";
};

const BASE_URL = "https://fakestoreapi.com";

export async function fetchExternalProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch external products");
        const data = await res.json();

        return data.map((item: any) => ({
            id: `external:${item.id}`,
            externalId: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image,
            rating: item.rating,
            source: "external",
        }));
    } catch (error) {
        console.error("Error fetching external products:", error);
        return [];
    }
}

export async function fetchExternalProduct(id: number): Promise<Product | null> {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch external product");
        }
        const item = await res.json();
        return {
            id: `external:${item.id}`,
            externalId: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image,
            rating: item.rating,
            source: "external",
        };
    } catch (error) {
        console.error(`Error fetching external product ${id}:`, error);
        return null;
    }
}
