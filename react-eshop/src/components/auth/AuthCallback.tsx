import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { toast } from "react-hot-toast";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
          toast.error(`Authentication failed: ${error}`);
          navigate("/login");
          return;
        }

        if (code) {
          // For demo purposes, create a mock user
          // In a real app, you would exchange the code for tokens
          const mockUser = {
            id: "1",
            email: "user@example.com",
            name: "Demo User",
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
        } else {
          toast.error("Authentication failed - no authorization code received");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">
          Please wait while we process your authentication.
        </p>
      </div>
    </div>
  );
};
