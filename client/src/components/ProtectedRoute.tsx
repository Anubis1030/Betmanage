import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAuth?: boolean; // Optional parameter to determine if authentication is required
}

/**
 * A component that protects routes requiring authentication.
 * If requireAuth is true and no token exists, redirects to login.
 * The login page will receive the current path as a redirect parameter.
 */
export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // If requireAuth is false, we don't need to check for a token
  // This allows public access to routes that contain protected functionality
  if (requireAuth && !token) {
    toast({
      title: "Authentication Required",
      description: "Please login to access this feature",
      variant: "destructive",
    });
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }

  return children;
};