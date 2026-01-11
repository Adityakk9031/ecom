import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "supersecretadmintoken";

function isAdmin(req: any) {
  return req.headers['x-admin-token'] === ADMIN_TOKEN || req.query.admin_token === ADMIN_TOKEN;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const orders = await storage.getOrders();
    res.json(orders);
  });

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const products = [
      {
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        description: "Experience crystal clear sound with our premium wireless headphones. Features active noise cancellation and 30-hour battery life.",
        price: 29999, // $299.99
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        stock: 50
      },
      {
        name: "Ergonomic Office Chair",
        slug: "ergonomic-office-chair",
        description: "Work in comfort with our ergonomic office chair. Adjustable lumbar support and breathable mesh back.",
        price: 19900, // $199.00
        imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
        stock: 20
      },
      {
        name: "Smart Watch Series 5",
        slug: "smart-watch-series-5",
        description: "Track your fitness and stay connected with the latest Smart Watch Series 5. Water-resistant and heart rate monitoring.",
        price: 34950, // $349.50
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        stock: 100
      },
      {
        name: "Minimalist Backpack",
        slug: "minimalist-backpack",
        description: "A stylish and functional backpack for your daily commute. Water-resistant material and laptop compartment.",
        price: 7999, // $79.99
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        stock: 45
      }
    ];

    for (const product of products) {
      await storage.createProduct(product);
    }
    console.log("Seeded database with products");
  }
}

// Call seed in the background
seedDatabase().catch(console.error);
