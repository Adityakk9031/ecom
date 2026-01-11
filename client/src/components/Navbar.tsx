import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X, Package } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const items = useCart((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Shop" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="glass-nav">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
             <Package className="w-6 h-6" />
             LUXE
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-[10px] font-bold text-white bg-accent rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-primary"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <div className="container-custom py-4 space-y-4">
              {links.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="block text-lg font-medium text-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
