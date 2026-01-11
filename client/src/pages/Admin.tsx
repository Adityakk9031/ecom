import { Layout } from "@/components/Layout";
import { useProducts, useCreateProduct } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Package, ShoppingBag } from "lucide-react";

// Extend schema for form validation
const productFormSchema = insertProductSchema.extend({
  price: z.coerce.number().min(1, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

export default function Admin() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: orders, isLoading: loadingOrders } = useOrders();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof productFormSchema>) => {
    createProduct(values, {
      onSuccess: () => {
        toast({ title: "Product created" });
        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        toast({ 
          variant: "destructive",
          title: "Error",
          description: err.message
        });
      },
    });
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="btn-primary gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} className="input-field" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl><Input {...field} className="input-field" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} className="input-field min-h-[100px]" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (in cents)</FormLabel>
                          <FormControl><Input type="number" {...field} className="input-field" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl><Input type="number" {...field} className="input-field" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl><Input {...field} className="input-field" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isCreating} className="btn-primary w-full">
                      {isCreating ? "Creating..." : "Create Product"}
                    </button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted rounded-lg inline-flex">
            <TabsTrigger value="products" className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Products</TabsTrigger>
            <TabsTrigger value="orders" className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  Product Inventory
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Slug</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingProducts ? (
                      <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                    ) : products?.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30">
                        <td className="p-4 font-medium">{p.name}</td>
                        <td className="p-4">${(p.price / 100).toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{p.slug}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  Recent Orders
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingOrders ? (
                      <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                    ) : orders?.map((o) => (
                      <tr key={o.id} className="hover:bg-muted/30">
                        <td className="p-4 font-mono text-muted-foreground">#{o.id}</td>
                        <td className="p-4">{o.userEmail}</td>
                        <td className="p-4">{(o.items as any[]).length} items</td>
                        <td className="p-4 font-medium">${(o.total / 100).toFixed(2)}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
