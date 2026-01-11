import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/fakeStore";

// This is a Server Component that fetches data directly
async function getProducts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCTS_API || 'http://localhost:3000'}/api/products`, {
        cache: "no-store", // Ensure fresh data for this demo
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    return res.json();
}

export default async function Home() {
    let products: Product[] = [];
    try {
        // In a real production build, fetching from own API route in SC during build might fail if API isn't built.
        // However, for Vercel/dynamic routes this is standard pattern or we use direct DB calls.
        // To safe guard for this "single repo" dev setup where we might run dev:
        products = await getProducts();
    } catch (e) {
        console.error(e);
        // Return empty or error state
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
                <p className="text-gray-600">Explorer the combined catalog of local and external items.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">No products found or failed to load.</p>
                </div>
            )}
        </div>
    );
}
