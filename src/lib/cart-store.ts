import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";
import { getProductById } from "./products";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartProducts: () => { product: Product; quantity: number }[];
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getCartProducts: () => {
        return get()
          .items.map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return { product, quantity: item.quantity };
          })
          .filter(Boolean) as { product: Product; quantity: number }[];
      },

      getSubtotal: () => {
        return get()
          .getCartProducts()
          .reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
      },
    }),
    { name: "haral-cart" }
  )
);
