"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NextStore
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === "/" ? "text-blue-600" : "text-gray-600"}`}
                    >
                        Store
                    </Link>
                    <Link
                        href="/cart"
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === "/cart" ? "text-blue-600" : "text-gray-600"}`}
                    >
                        Cart
                    </Link>
                    <Link
                        href="/admin"
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === "/admin" ? "text-blue-600" : "text-gray-600"}`}
                    >
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
}
