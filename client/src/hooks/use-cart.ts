import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@shared/schema';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.productId === newItem.productId);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.productId === newItem.productId
                ? { ...item, qty: item.qty + 1 }
                : item
            ),
          };
        }
        return { items: [...state.items, { ...newItem, qty: 1 }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId),
      })),
      updateQuantity: (productId, qty) => set((state) => {
        if (qty <= 0) {
          return {
            items: state.items.filter(item => item.productId !== productId),
          };
        }
        return {
          items: state.items.map(item =>
            item.productId === productId ? { ...item, qty } : item
          ),
        };
      }),
      clearCart: () => set({ items: [] }),
      total: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + (item.price * item.qty), 0);
      }
    }),
    {
      name: 'shopping-cart-storage',
    }
  )
);
