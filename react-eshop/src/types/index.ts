export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageFile: string;
  category: string[];
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color: string;
}

export interface Cart {
  userName: string;
  items: CartItem[];
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderName: string;
  shippingAddress: Address;
  billingAddress: Address;
  payment: Payment;
  status: OrderStatus;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface Payment {
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: PaymentMethod;
}

export enum PaymentMethod {
  CreditCard = 1,
  PayPal = 2,
  BankTransfer = 3,
}

export enum OrderStatus {
  Pending = 1,
  Confirmed = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  count: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CheckoutData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: PaymentMethod;
}
