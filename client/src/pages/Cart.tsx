import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { Link, useLocation } from "wouter";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCreateOrder } from "@/hooks/use-orders";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const cartTotal = total();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    createOrder(
      {
        userEmail: values.email,
        total: cartTotal,
        items: items,
        status: "placed",
      },
      {
        onSuccess: () => {
          toast({
            title: "Order Placed!",
            description: "Check your email for confirmation.",
          });
          clearCart();
          setLocation("/");
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message,
          });
        },
      }
    );
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-4xl font-display font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-6 p-6 bg-card rounded-xl border border-border shadow-sm">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="font-semibold">${(item.price * item.qty / 100).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-input rounded-md h-8">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.qty - 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-muted"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.qty + 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-muted"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ${(item.price / 100).toFixed(2)} each
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm sticky top-32">
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} className="input-field" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full btn-primary h-12 text-base justify-between group"
                    >
                      {isPending ? "Processing..." : "Checkout"}
                      {!isPending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
