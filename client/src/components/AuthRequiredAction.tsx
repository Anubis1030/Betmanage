import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AuthRequiredActionProps {
  children: React.ReactNode;
  fallbackText?: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
  onAuthenticated?: () => void; // Callback to execute after successful authentication
}

/**
 * A component that wraps actions requiring authentication.
 * If the user is not authenticated, it shows a button that redirects to login.
 * If the user is authenticated, it renders the children.
 */
export const AuthRequiredAction = ({
  children,
  fallbackText = "Login to continue",
  buttonText = "Login",
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  onAuthenticated,
}: AuthRequiredActionProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Effect to run onAuthenticated callback when token becomes available
  // This would be useful when redirected back from login
  useEffect(() => {
    if (token && onAuthenticated) {
      onAuthenticated();
    }
  }, [token, onAuthenticated]);
  
  const handleLoginRedirect = () => {
    toast({
      title: "Authentication Required",
      description: "Please login to access this feature",
      variant: "destructive",
    });
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
  };

  if (!token) {
    return (
      <div className="space-y-2">
        {fallbackText && <p className="text-sm text-muted-foreground">{fallbackText}</p>}
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          onClick={onClick || handleLoginRedirect}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};