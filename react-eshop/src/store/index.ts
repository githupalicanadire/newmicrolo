import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Product, Cart, CartItem } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
}

interface UIState {
  sidebarOpen: boolean;
  cartOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  setSidebarOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem("access_token");
        set({ user: null, isAuthenticated: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Cart Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      addItem: (product, quantity = 1, color = "Default") => {
        const currentCart = get().cart;
        const newItem: CartItem = {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          color,
        };

        if (!currentCart) {
          const user = useAuthStore.getState().user;
          const newCart: Cart = {
            userName: user?.email || "anonymous",
            items: [newItem],
            totalPrice: product.price * quantity,
          };
          set({ cart: newCart });
          return;
        }

        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.productId === product.id && item.color === color,
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...currentCart.items];
          updatedItems[existingItemIndex].quantity += quantity;
          const updatedCart = {
            ...currentCart,
            items: updatedItems,
            totalPrice: updatedItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            ),
          };
          set({ cart: updatedCart });
        } else {
          const updatedItems = [...currentCart.items, newItem];
          const updatedCart = {
            ...currentCart,
            items: updatedItems,
            totalPrice: updatedItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            ),
          };
          set({ cart: updatedCart });
        }
      },
      removeItem: (productId) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        const updatedItems = currentCart.items.filter(
          (item) => item.productId !== productId,
        );
        const updatedCart = {
          ...currentCart,
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        };
        set({ cart: updatedCart });
      },
      updateQuantity: (productId, quantity) => {
        const currentCart = get().cart;
        if (!currentCart) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = currentCart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        const updatedCart = {
          ...currentCart,
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        };
        set({ cart: updatedCart });
      },
      clearCart: () => set({ cart: null }),
      setCart: (cart) => set({ cart }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);

// UI Store
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  cartOpen: false,
  searchQuery: "",
  selectedCategory: "all",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));
