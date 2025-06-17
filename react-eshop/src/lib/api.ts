import axios from "axios";
import { toast } from "react-hot-toast";

// API endpoints
export const API_ENDPOINTS = {
  // Gateway routes (via Vite proxy)
  CATALOG: "/api/catalog-service",
  BASKET: "/api/basket-service",
  ORDERING: "/api/ordering-service",
  IDENTITY: "/identity",
} as const;

// Axios instance for API calls
export const apiClient = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";

    if (error.response?.status === 401) {
      // Clear auth state on 401
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

// API utility functions
export const api = {
  // Catalog API
  catalog: {
    getProducts: (pageNumber = 1, pageSize = 10) =>
      apiClient.get(
        `${API_ENDPOINTS.CATALOG}/products/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      ),

    getProduct: (id: string) =>
      apiClient.get(`${API_ENDPOINTS.CATALOG}/products/${id}`),

    getProductsByCategory: (category: string) =>
      apiClient.get(`${API_ENDPOINTS.CATALOG}/products/category/${category}`),

    getAllProducts: () => apiClient.get(`${API_ENDPOINTS.CATALOG}/products`),
  },

  // Basket API
  basket: {
    getBasket: (userName: string) =>
      apiClient.get(`${API_ENDPOINTS.BASKET}/basket/${userName}`),

    storeBasket: (cart: any) =>
      apiClient.post(`${API_ENDPOINTS.BASKET}/basket`, { cart }),

    deleteBasket: (userName: string) =>
      apiClient.delete(`${API_ENDPOINTS.BASKET}/basket/${userName}`),

    checkoutBasket: (checkoutData: any) =>
      apiClient.post(`${API_ENDPOINTS.BASKET}/basket/checkout`, checkoutData),
  },

  // Ordering API
  ordering: {
    getOrders: (pageIndex = 1, pageSize = 10) =>
      apiClient.get(
        `${API_ENDPOINTS.ORDERING}/orders?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      ),

    getOrdersByName: (orderName: string) =>
      apiClient.get(`${API_ENDPOINTS.ORDERING}/orders/${orderName}`),

    getOrdersByCustomer: (customerId: string) =>
      apiClient.get(`${API_ENDPOINTS.ORDERING}/orders/customer/${customerId}`),
  },

  // Auth API
  auth: {
    getUserInfo: () =>
      apiClient.get(`${API_ENDPOINTS.IDENTITY}/connect/userinfo`),

    getAuthStatus: () =>
      apiClient.get(`${API_ENDPOINTS.IDENTITY}/api/test/auth-status`),
  },
};
