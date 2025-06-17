import { Link } from "react-router-dom";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore, useUIStore, useAuthStore } from "@/store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { useUpdateCart } from "@/hooks/useApi";

export const CartSidebar = () => {
  const { cart, updateQuantity, removeItem } = useCartStore();
  const { cartOpen, setCartOpen } = useUIStore();
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

  if (!cartOpen) return null;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shopping Cart
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some products to get started!
              </p>
              <Link
                to="/products"
                onClick={() => setCartOpen(false)}
                className="btn btn-primary btn-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart!.items.map((item) => (
                <div
                  key={`${item.productId}-${item.color}`}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <img
                    src={getProductImageUrl(item.productName)}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                    <p className="text-sm font-medium text-primary-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      className="p-1 hover:bg-gray-100 rounded-md"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-100 rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded-md ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(cart!.totalPrice)}
              </span>
            </div>

            <div className="space-y-2">
              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="btn btn-outline btn-md w-full"
              >
                View Cart
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="btn btn-primary btn-md w-full"
                >
                  Checkout
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setCartOpen(false)}
                  className="btn btn-primary btn-md w-full"
                >
                  Sign In to Checkout
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
