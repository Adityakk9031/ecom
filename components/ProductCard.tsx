"use client";

import Link from "next/link";
import { Product } from "@/lib/fakeStore";

export default function ProductCard({ product }: { product: Product }) {
    const addToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to details page
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item: any) => item.id === product.id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart!"); // Simple feedback
    };

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                <div className="aspect-[3/4] p-6 relative bg-white">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.source === "local" && (
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                            Local
                        </span>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm text-gray-600">
                                    {product.rating.rate} ({product.rating.count})
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={addToCart}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
