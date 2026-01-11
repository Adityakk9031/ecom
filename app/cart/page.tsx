"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CartItem = {
    id: string;
    title: string;
    price: number;
    image: string;
    qty: number;
};

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(stored);
    }, []);

    const updateQty = (id: string, delta: number) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, qty: Math.max(1, item.qty + delta) };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const remove = (id: string) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const checkout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    items: cart.map(item => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        qty: item.qty,
                        image: item.image
                    })),
                    total: Math.round(total * 100) // store in cents
                }),
            });

            if (res.ok) {
                localStorage.removeItem("cart");
                setCart([]);
                alert("Order placed successfully!");
                router.push("/");
            } else {
                alert("Failed to place order");
            }
        } catch (err) {
            console.error(err);
            alert("Error placing order");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/" className="text-blue-600 hover:underline">
                    Go shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
                            <img src={item.image} alt={item.title} className="w-24 h-24 object-contain bg-white" />
                            <div className="flex-grow">
                                <Link href={`/products/${item.id}`} className="font-medium hover:text-blue-600">
                                    {item.title}
                                </Link>
                                <div className="text-gray-600 mt-1">${item.price.toFixed(2)}</div>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center bg-gray-50 rounded-lg text-gray-900">
                                        <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 hover:bg-gray-200 rounded-l-lg">-</button>
                                        <span className="w-8 text-center">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 hover:bg-gray-200 rounded-r-lg">+</button>
                                    </div>
                                    <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 text-sm">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 h-fit sticky top-24">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    <div className="flex justify-between mb-6 text-lg">
                        <span>Total</span>
                        <span className="font-bold">${total.toFixed(2)}</span>
                    </div>

                    <form onSubmit={checkout} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                placeholder="Enter your email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Processing..." : "Checkout"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
