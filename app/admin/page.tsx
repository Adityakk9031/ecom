"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
    const [token, setToken] = useState("");
    const [authorized, setAuthorized] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);

    // Form State
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [rate, setRate] = useState("0");
    const [count, setCount] = useState("0");

    const [dbStatus, setDbStatus] = useState<"connected" | "disconnected" | "checking">("checking");
    const [dbError, setDbError] = useState("");

    const [products, setProducts] = useState<any[]>([]);

    const checkAuth = () => {
        // In a real app we'd verify with server, here we just store it to use in headers
        if (token) setAuthorized(true);
    };

    useEffect(() => {
        if (authorized) {
            fetchOrders();
            fetchProducts();
        }
    }, [authorized]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (e) {
            console.error("Error fetching products:", e);
        }
    };

    const fetchOrders = async () => {
        try {
            setDbStatus("checking");
            const res = await fetch("/api/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                setDbStatus("connected");
            } else {
                if (res.status === 403) {
                    setAuthorized(false);
                    alert("Invalid Admin Token. Please log in again.");
                    return;
                }
                setDbStatus("disconnected");
                const err = await res.json();
                setDbError(res.status === 500 ? "Database Unreachable" : err.message || "Error");
            }
        } catch (e) {
            console.error(e);
            setDbStatus("disconnected");
            setDbError("Network Error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dbStatus === "disconnected") {
            alert("Cannot add product: Database is unreachable.");
            return;
        }
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    price: parseFloat(price),
                    description,
                    category,
                    image,
                    rating: { rate: parseFloat(rate), count: parseInt(count) }
                })
            });

            if (res.ok) {
                alert("Product added!");
                // Reset form
                setTitle("");
                setPrice("");
                setDescription("");
                setCategory("");
                setImage("");
                // Refresh products list
                fetchProducts();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error?.message || "Failed"}`);
            }
        } catch (e) {
            console.error(e);
            alert("Error submitting form");
        }
    };

    if (!authorized) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-md">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="Enter Admin Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-gray-900"
                    />
                    <button
                        onClick={checkAuth}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Access Dashboard
                    </button>
                    <p className="text-sm text-gray-500">Hint: use 'supersecretadmintoken'</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={() => setAuthorized(false)} className="text-red-600 hover:underline">Logout</button>
            </div>



            {/* Horizontal Product List */}
            <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
                    {products.map((p) => (
                        <div key={p.id} className="flex-shrink-0 w-32 bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-white rounded-md mb-2 relative overflow-hidden">
                                <img src={p.image} alt={p.title} className="object-contain w-full h-full" />
                            </div>
                            <p className="text-xs font-medium text-gray-900 line-clamp-2" title={p.title}>
                                {p.title}
                            </p>
                            <p className="text-xs text-blue-600 font-bold mt-1">${p.price}</p>
                        </div>
                    ))}
                    {products.length === 0 && <p className="text-gray-500 italic text-sm">No products found.</p>}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Add Product Form */}
                <div className="bg-white p-6 rounded-xl border shadow-sm h-fit text-gray-900">
                    <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded text-gray-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border rounded text-gray-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input value={category} onChange={e => setCategory(e.target.value)} required className="w-full p-2 border rounded text-gray-900" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Image</label>
                            <input type="url" value={image} onChange={e => setImage(e.target.value)} required className="w-full p-2 border rounded text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded h-24 text-gray-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rate (0-5)</label>
                                <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} className="w-full p-2 border rounded text-gray-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Count</label>
                                <input type="number" value={count} onChange={e => setCount(e.target.value)} className="w-full p-2 border rounded text-gray-900" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium">
                            Create Product
                        </button>
                    </form>
                </div>

                {/* Orders List */}
                <div className="text-gray-900">
                    <h2 className="text-xl font-bold mb-6 text-white">Recent Orders ({orders.length})</h2>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-sm text-gray-500">{order.id}</span>
                                    <span className="font-bold text-green-600">${(order.total / 100).toFixed(2)}</span>
                                </div>
                                <div className="text-sm mb-2">
                                    <span className="font-medium">User:</span> {order.email}
                                </div>
                                <div className="text-sm bg-gray-50 p-2 rounded">
                                    {/* JSON parsing safe check */}
                                    {Array.isArray(order.items) ? order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center py-1">
                                            <span className="line-clamp-1">{item.title} (x{item.qty})</span>
                                            <span>${item.price}</span>
                                        </div>
                                    )) : "Invalid items data"}
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                    {new Date(order.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <div className="text-gray-500 italic">No orders found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
