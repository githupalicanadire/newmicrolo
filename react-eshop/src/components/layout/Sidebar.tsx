import { Link } from "react-router-dom";
import { X, Home, Package2, ShoppingBag, User, LogOut } from "lucide-react";
import { useAuthStore, useUIStore } from "@/store";

export const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl slide-in-from-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              EShop
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user.name || "User"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/products"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package2 className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Products</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Cart</span>
              </Link>

              <Link
                to="/orders"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Package2 className="h-5 w-5 text-gray-600" />
                <span className="font-medium">My Orders</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Sign In</span>
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            EShop v1.0 - Modern E-commerce
          </p>
        </div>
      </div>
    </div>
  );
};
