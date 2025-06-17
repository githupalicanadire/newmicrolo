import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Users,
  Award,
  Truck,
} from "lucide-react";
import { useAllProducts } from "@/hooks/useApi";
import { ProductGrid } from "@/components/products/ProductGrid";

export const HomePage = () => {
  const { data: productsResponse, isLoading } = useAllProducts();
  const featuredProducts = productsResponse?.products?.slice(0, 8) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-black opacity-20" />

        <div className="relative container mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to EShop
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto animate-slide-up">
            Discover amazing products at unbeatable prices. Your one-stop shop
            for everything you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              to="/products"
              className="btn btn-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100 flex items-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Shop Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/products"
              className="btn btn-lg px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all"
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-sm opacity-80">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-sm opacity-80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-sm opacity-80">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-80">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EShop?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best shopping experience with top-quality products
              and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly with our reliable shipping
                partners. Free shipping on orders over $50.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
              <p className="text-gray-600">
                All our products come with a quality guarantee. Not satisfied?
                Get your money back within 30 days.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available 24/7 to help you with any
                questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the best products available
              right now.
            </p>
          </div>

          <ProductGrid products={featuredProducts} isLoading={isLoading} />

          <div className="text-center mt-12">
            <Link to="/products" className="btn btn-primary btn-lg">
              View All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                avatar: "SJ",
                rating: 5,
                comment:
                  "Amazing quality products and super fast delivery! I'm a customer for life.",
              },
              {
                name: "Mike Chen",
                avatar: "MC",
                rating: 5,
                comment:
                  "Great customer service and competitive prices. Highly recommend EShop!",
              },
              {
                name: "Emily Davis",
                avatar: "ED",
                rating: 5,
                comment:
                  "Love the variety of products available. Easy to navigate and secure checkout.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="flex items-center">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-secondary">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who love shopping with us.
          </p>
          <Link
            to="/products"
            className="btn btn-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
};
