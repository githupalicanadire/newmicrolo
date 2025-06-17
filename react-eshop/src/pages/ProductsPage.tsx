import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { useAllProducts, useProductsByCategory } from "@/hooks/useApi";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useUIStore } from "@/store";

const CATEGORIES = [
  "all",
  "electronics",
  "computers",
  "phones",
  "accessories",
  "gaming",
  "audio",
];

const SORT_OPTIONS = [
  { value: "name", label: "Name A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCategory, setSelectedCategory } = useUIStore();
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchQuery = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "all";

  // Sync URL with state
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl, setSelectedCategory]);

  // Fetch products based on category
  const { data: allProductsResponse, isLoading: isLoadingAll } =
    useAllProducts();

  const { data: categoryProductsResponse, isLoading: isLoadingCategory } =
    useProductsByCategory(selectedCategory === "all" ? "" : selectedCategory);

  const isLoading =
    selectedCategory === "all" ? isLoadingAll : isLoadingCategory;
  const products =
    selectedCategory === "all"
      ? allProductsResponse?.products || []
      : categoryProductsResponse?.products || [];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product) => {
      if (!searchQuery) return true;
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return b.id.localeCompare(a.id);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "All Products"}
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedProducts.length}{" "}
            {filteredAndSortedProducts.length === 1 ? "product" : "products"}{" "}
            found
          </p>
        </div>

        <div className="lg:flex lg:space-x-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-primary-100 text-primary-800 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Under $50
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      $50 - $100
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      $100 - $200
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Over $200
                    </span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {rating} stars & up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn btn-outline btn-sm flex items-center"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-1" />
                    Filters
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">View:</span>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md ${
                        viewMode === "grid"
                          ? "bg-primary-100 text-primary-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md ${
                        viewMode === "list"
                          ? "bg-primary-100 text-primary-600"
                          : "text-gray-400"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="input text-sm"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={filteredAndSortedProducts}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
