import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { useUpdateCart } from "@/hooks/useApi";

export const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { mutate: updateCart } = useUpdateCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }

    // Update backend if authenticated
    if (isAuthenticated && cart) {
      const updatedCart = {
        ...cart,
        items: cart.items
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
      updateCart(updatedCart);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);

    // Update backend if authenticated
    if (isAuthenticated && cart) {
      const updatedCart = {
        ...cart,
        items: cart.items.filter((item) => item.productId !== productId),
      };
      updateCart(updatedCart);
    }
  };

  const handleClearCart = () => {
    clearCart();

    // Update backend if authenticated
    if (isAuthenticated) {
      const emptyCart = {
        userName: cart?.userName || "anonymous",
        items: [],
        totalPrice: 0,
      };
      updateCart(emptyCart);
    }
  };

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}`}
                      className="p-6"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={getProductImageUrl(item.productName)}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Color: {item.color}
                          </p>
                          <p className="text-lg font-semibold text-primary-600 mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-12 text-center font-medium text-lg">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium mt-2 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(cart.totalPrice * 0.08)}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary-600">
                        {formatPrice(cart.totalPrice * 1.08)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {isAuthenticated ? (
                    <Link
                      to="/checkout"
                      className="btn btn-primary btn-lg w-full"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-primary btn-lg w-full">
                      Sign in to Checkout
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  )}

                  <Link
                    to="/products"
                    className="btn btn-outline btn-lg w-full"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Secure checkout with SSL encryption
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    30-day return policy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
