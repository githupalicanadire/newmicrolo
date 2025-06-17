import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, Package } from "lucide-react";
import { useAuthStore } from "@/store";
import { toast } from "react-hot-toast";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Demo login - in real app, this would call your backend
      const mockUser = {
        id: "1",
        email: formData.email,
        name: formData.email.split("@")[0],
        roles: ["user"],
      };

      // Store the mock token
      localStorage.setItem("access_token", "mock-token-" + Date.now());

      login(mockUser);
      toast.success("Successfully signed in!");

      // Redirect to intended page or home
      const returnUrl = localStorage.getItem("auth_return_url") || "/";
      localStorage.removeItem("auth_return_url");
      navigate(returnUrl);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDemoLogin = (userType: "admin" | "user") => {
    const demoUsers = {
      admin: {
        email: "admin@toyshop.com",
        password: "Admin123!",
      },
      user: {
        email: "john.doe@example.com",
        password: "User123!",
      },
    };

    const demoUser = demoUsers[userType];
    setFormData(demoUser);

    // Auto-submit after a short delay
    setTimeout(() => {
      const mockUser = {
        id: userType === "admin" ? "admin" : "1",
        email: demoUser.email,
        name: userType === "admin" ? "Admin User" : "John Doe",
        roles: userType === "admin" ? ["admin", "user"] : ["user"],
      };

      localStorage.setItem("access_token", "mock-token-" + Date.now());
      login(mockUser);
      toast.success(`Successfully signed in as ${userType}!`);

      const returnUrl = localStorage.getItem("auth_return_url") || "/";
      localStorage.removeItem("auth_return_url");
      navigate(returnUrl);
    }, 500);
  };

  const handleIdentityServerLogin = () => {
    // Redirect to Identity Server
    const identityServerUrl = "http://localhost:6006";
    const clientId = "shopping.web";
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/auth/callback",
    );
    const scope = encodeURIComponent(
      "openid profile email shopping.web catalog.api basket.api ordering.api",
    );

    const authUrl =
      `${identityServerUrl}/connect/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `response_mode=query`;

    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Package className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-primary-100">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Demo Login Options */}
        <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick Demo Login
            </h3>
            <p className="text-sm text-gray-600">
              Try the app with demo accounts
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin("admin")}
              className="btn btn-secondary btn-sm"
            >
              Admin Demo
            </button>
            <button
              onClick={() => handleDemoLogin("user")}
              className="btn btn-secondary btn-sm"
            >
              User Demo
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or use Identity Server
              </span>
            </div>
          </div>

          <button
            onClick={handleIdentityServerLogin}
            className="btn btn-primary btn-md w-full"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign in with Identity Server
          </button>
        </div>

        {/* Manual Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white/10 rounded-lg p-4 text-white text-sm">
          <h4 className="font-semibold mb-2">Demo Credentials:</h4>
          <div className="space-y-1">
            <p>
              <strong>Admin:</strong> admin@toyshop.com / Admin123!
            </p>
            <p>
              <strong>User:</strong> john.doe@example.com / User123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
