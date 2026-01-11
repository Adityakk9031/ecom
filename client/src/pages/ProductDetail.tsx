import { Layout } from "@/components/Layout";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useRoute } from "wouter";
import { Loader2, ArrowLeft, Minus, Plus } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading, error } = useProduct(id);
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
          <p className="text-lg text-muted-foreground">Product not found.</p>
          <Link href="/" className="text-primary underline">Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    toast({
      title: "Added to cart",
      description: `${product.name} (x${qty}) added to your cart.`,
    });
  };

  return (
    <Layout>
      <div className="container-custom py-12 md:py-24">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image */}
          <div className="aspect-[3/4] bg-muted rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-8 sticky top-32">
            <div>
              <h1 className="text-4xl font-display font-bold text-primary">{product.name}</h1>
              <p className="text-2xl font-medium text-accent mt-4">${(product.price / 100).toFixed(2)}</p>
            </div>

            <div className="prose prose-neutral text-muted-foreground">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-input rounded-lg">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 hover:bg-muted transition-colors rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="p-2 hover:bg-muted transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary text-base py-4"
                >
                  Add to Cart
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
