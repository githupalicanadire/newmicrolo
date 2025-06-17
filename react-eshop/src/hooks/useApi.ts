import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore, useCartStore } from "@/store";
import { toast } from "react-hot-toast";
import { Product, Cart, CheckoutData } from "@/types";

// Products
export const useProducts = (pageNumber = 1, pageSize = 12) => {
  return useQuery({
    queryKey: ["products", pageNumber, pageSize],
    queryFn: () => api.catalog.getProducts(pageNumber, pageSize),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: () => api.catalog.getAllProducts(),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api.catalog.getProduct(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => api.catalog.getProductsByCategory(category),
    select: (data) => data.data,
    enabled: !!category && category !== "all",
  });
};

// Cart/Basket
export const useCart = () => {
  const { user } = useAuthStore();
  const userName = user?.email || "anonymous";

  return useQuery({
    queryKey: ["cart", userName],
    queryFn: () => api.basket.getBasket(userName),
    select: (data) => data.data.cart,
    enabled: !!userName,
    onSuccess: (cart: Cart) => {
      useCartStore.getState().setCart(cart);
    },
    onError: () => {
      // If cart doesn't exist, that's ok
      useCartStore.getState().setCart({
        userName,
        items: [],
        totalPrice: 0,
      });
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: (cart: Cart) => api.basket.storeBasket(cart),
    onSuccess: (_, cart) => {
      setCart(cart);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart updated!");
    },
    onError: () => {
      toast.error("Failed to update cart");
    },
  });
};

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: (checkoutData: CheckoutData) =>
      api.basket.checkoutBasket(checkoutData),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
    },
    onError: () => {
      toast.error("Failed to place order");
    },
  });
};

// Orders
export const useOrders = (pageIndex = 1, pageSize = 10) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["orders", pageIndex, pageSize],
    queryFn: () => api.ordering.getOrders(pageIndex, pageSize),
    select: (data) => data.data,
    enabled: isAuthenticated,
  });
};

export const useOrdersByCustomer = (customerId: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["orders", "customer", customerId],
    queryFn: () => api.ordering.getOrdersByCustomer(customerId),
    select: (data) => data.data,
    enabled: isAuthenticated && !!customerId,
  });
};

// Auth
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["authStatus"],
    queryFn: () => api.auth.getAuthStatus(),
    select: (data) => data.data,
    retry: false,
  });
};

export const useUserInfo = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["userInfo"],
    queryFn: () => api.auth.getUserInfo(),
    select: (data) => data.data,
    enabled: isAuthenticated,
    retry: false,
  });
};
