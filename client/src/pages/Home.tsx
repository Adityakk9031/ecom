import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center bg-secondary/50">
        <div className="container-custom grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in slide-in-from-left duration-700 fade-in">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase bg-accent/10 rounded-full">
              New Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-tight">
              Refined <br /> Simplicity.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Discover our curated collection of premium goods designed to elevate your everyday life.
            </p>
          </div>
          <div className="hidden md:block relative h-full w-full min-h-[400px]">
             {/* Unsplash image for lifestyle/hero */}
             {/* abstract architectural shapes minimalist */}
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000"
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold">Latest Arrivals</h2>
            <p className="mt-2 text-muted-foreground">Handpicked for quality and style.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex items-center justify-center text-red-500">
            Failed to load products. Please try again later.
          </div>
        ) : products?.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center text-muted-foreground">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
