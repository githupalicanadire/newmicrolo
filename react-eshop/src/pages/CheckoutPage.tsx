import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CreditCard, Lock, MapPin, User, ArrowLeft } from "lucide-react";
import { useCartStore, useAuthStore } from "@/store";
import { useCheckout } from "@/hooks/useApi";
import {
  formatPrice,
  getProductImageUrl,
  formatCardNumber,
  validateCardNumber,
} from "@/lib/utils";
import { CheckoutData, PaymentMethod } from "@/types";
import { toast } from "react-hot-toast";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { mutate: checkout, isLoading } = useCheckout();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CheckoutData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: user?.email || "",
      addressLine: "",
      country: "United States",
      state: "",
      zipCode: "",
      cardName: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
      paymentMethod: PaymentMethod.CreditCard,
    },
  });

  const cardNumber = watch("cardNumber");

  // Format card number on change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue("cardNumber", formatted);
  };

  const onSubmit = async (data: CheckoutData) => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateCardNumber(data.cardNumber)) {
      toast.error("Please enter a valid card number");
      return;
    }

    try {
      const checkoutData = {
        ...data,
        userName: user?.email || "anonymous",
        customerId: user?.id || "anonymous",
        totalPrice: cart.totalPrice * 1.08, // Including tax
      };

      await checkout(checkoutData);

      // Success handled by the mutation
      navigate("/orders");
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
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
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center text-gray-600 hover:text-primary-600 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="input"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="input"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        {...register("emailAddress", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Please enter a valid email",
                          },
                        })}
                        type="email"
                        className="input"
                        placeholder="john@example.com"
                      />
                      {errors.emailAddress && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.emailAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        {...register("addressLine", {
                          required: "Address is required",
                        })}
                        className="input"
                        placeholder="123 Main Street"
                      />
                      {errors.addressLine && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.addressLine.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select {...register("country")} className="input">
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        {...register("state", {
                          required: "State is required",
                        })}
                        className="input"
                        placeholder="California"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        {...register("zipCode", {
                          required: "ZIP code is required",
                        })}
                        className="input"
                        placeholder="90210"
                      />
                      {errors.zipCode && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Payment Information
                    </h2>
                    <Lock className="h-4 w-4 text-gray-400 ml-2" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        {...register("cardName", {
                          required: "Cardholder name is required",
                        })}
                        className="input"
                        placeholder="John Doe"
                      />
                      {errors.cardName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.cardName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        {...register("cardNumber", {
                          required: "Card number is required",
                          validate: (value) =>
                            validateCardNumber(value) ||
                            "Please enter a valid card number",
                        })}
                        onChange={handleCardNumberChange}
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          {...register("expiration", {
                            required: "Expiry date is required",
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                              message: "Please enter MM/YY format",
                            },
                          })}
                          className="input"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiration && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.expiration.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          {...register("cvv", {
                            required: "CVV is required",
                            pattern: {
                              value: /^\d{3,4}$/,
                              message: "Please enter a valid CVV",
                            },
                          })}
                          className="input"
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Complete Order
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}`}
                      className="flex items-center space-x-3"
                    >
                      <img
                        src={getProductImageUrl(item.productName)}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} • {item.color}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t pt-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
