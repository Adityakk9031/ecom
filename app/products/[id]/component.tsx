"use client";

import { Product } from "@/lib/fakeStore";
import { useState } from "react";

export default function ProductDetailClient({ product }: { product: Product }) {
    const [isAdded, setIsAdded] = useState(false);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((item: any) => item.id === product.id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-[500px] w-full object-contain"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-4 capitalize">
                            {product.category}
                        </span>
                        {product.source === "local" && (
                            <span className="ml-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                                Local Product
                            </span>
                        )}
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {product.title}
                        </h1>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-yellow-400 text-2xl">★</span>
                            <span className="text-lg font-medium text-gray-900">
                                {product.rating.rate}
                            </span>
                            <span className="text-gray-500">
                                ({product.rating.count} reviews)
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-8">
                            ${product.price.toFixed(2)}
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {product.description}
                        </p>
                    </div>

                    <button
                        onClick={addToCart}
                        disabled={isAdded}
                        className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 ${isAdded
                                ? "bg-green-600 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25"
                            }`}
                    >
                        {isAdded ? "Added to Cart ✓" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}
