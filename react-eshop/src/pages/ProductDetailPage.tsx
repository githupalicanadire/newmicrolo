import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useProduct } from "@/hooks/useApi";
import { useCartStore, useAuthStore } from "@/store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { toast } from "react-hot-toast";

const COLORS = ["Default", "Black", "White", "Blue", "Red"];

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Default");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { data: productResponse, isLoading: isLoadingProduct } = useProduct(
    id!,
  );
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const product = productResponse?.product;

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-md"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addItem(product, quantity, selectedColor);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  const productImages = [
    getProductImageUrl(product.name, 0),
    getProductImageUrl(product.name, 1),
    getProductImageUrl(product.name, 0),
    getProductImageUrl(product.name, 1),
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= 4
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary-600 mb-4">
                {formatPrice(product.price)}
              </div>

              {/* Categories */}
              {product.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                      selectedColor === color
                        ? "border-primary-600 bg-primary-50 text-primary-600"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={isLoading}
                className="btn btn-primary btn-lg w-full"
              >
                {isLoading ? <div className="spinner mr-2" /> : null}
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="btn btn-outline btn-lg w-full flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>

              <button className="btn btn-secondary btn-lg w-full flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-5 w-5 mr-3 text-green-600" />
                  Free shipping on orders over $50
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-5 w-5 mr-3 text-blue-600" />
                  2-year warranty included
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RotateCcw className="h-5 w-5 mr-3 text-purple-600" />
                  30-day return policy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
