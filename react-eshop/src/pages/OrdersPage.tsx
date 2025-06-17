import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, Download, RefreshCw } from "lucide-react";
import { useOrders, useOrdersByCustomer } from "@/hooks/useApi";
import { useAuthStore } from "@/store";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatus } from "@/types";

const STATUS_COLORS = {
  [OrderStatus.Pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.Confirmed]: "bg-blue-100 text-blue-800",
  [OrderStatus.Shipped]: "bg-purple-100 text-purple-800",
  [OrderStatus.Delivered]: "bg-green-100 text-green-800",
  [OrderStatus.Cancelled]: "bg-red-100 text-red-800",
};

const STATUS_LABELS = {
  [OrderStatus.Pending]: "Pending",
  [OrderStatus.Confirmed]: "Confirmed",
  [OrderStatus.Shipped]: "Shipped",
  [OrderStatus.Delivered]: "Delivered",
  [OrderStatus.Cancelled]: "Cancelled",
};

export const OrdersPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"all" | "customer">("all");

  const {
    data: allOrdersResponse,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useOrders(1, 20);

  const {
    data: customerOrdersResponse,
    isLoading: isLoadingCustomer,
    refetch: refetchCustomer,
  } = useOrdersByCustomer(user?.id || "");

  const isLoading = activeTab === "all" ? isLoadingAll : isLoadingCustomer;
  const orders =
    activeTab === "all"
      ? allOrdersResponse?.orders?.data || []
      : customerOrdersResponse?.orders || [];

  const handleRefresh = () => {
    if (activeTab === "all") {
      refetchAll();
    } else {
      refetchCustomer();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="h-8 w-8 mr-3 text-primary-600" />
                My Orders
              </h1>
              <button
                onClick={handleRefresh}
                className="btn btn-outline btn-sm flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "all"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setActiveTab("customer")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "customer"
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Orders
                </button>
              </nav>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "customer"
                  ? "You haven't placed any orders yet."
                  : "No orders have been placed yet."}
              </p>
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {order.orderItems.slice(0, 3).map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}

                      {order.orderItems.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.orderItems.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex space-x-3">
                      <button className="btn btn-outline btn-sm flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button className="btn btn-outline btn-sm flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </button>
                    </div>

                    {order.status === OrderStatus.Shipped && (
                      <button className="btn btn-primary btn-sm">
                        Track Package
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <button className="btn btn-outline btn-sm">Previous</button>
                <span className="text-sm text-gray-600">Page 1 of 1</span>
                <button className="btn btn-outline btn-sm">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
