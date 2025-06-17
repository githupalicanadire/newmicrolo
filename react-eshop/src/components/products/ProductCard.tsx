import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getProductImageUrl, truncateText } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/store";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      addItem(product, 1, "Default");
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={getProductImageUrl(product.name)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-400"
              }`}
            />
          </button>

          {/* Categories Badge */}
          {product.category.length > 0 && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-md">
                {product.category[0]}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {truncateText(product.name, 50)}
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            {truncateText(product.description, 80)}
          </p>

          {/* Rating (placeholder) */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="btn btn-primary btn-sm flex items-center space-x-1"
            >
              {isLoading ? (
                <div className="spinner" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
