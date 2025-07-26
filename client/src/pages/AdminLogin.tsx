import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthAPI } from "@/api/authAPI";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/admin/dashboard';

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await AuthAPI.getProfile();
          if (data && data.role === "admin") {
            navigate(redirect);
          }
        } catch {}
      }
    };
    checkAdmin();
  }, [navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First login the user
      const loginResponse = await AuthAPI.login(credentials);
      
      if (loginResponse.data && loginResponse.data.token) {
        localStorage.setItem("token", loginResponse.data.token);
        
        // Then get the user's profile to verify role
        const profileResponse = await AuthAPI.getProfile();
        
        if (profileResponse.data.role === "admin") {
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin dashboard!",
          });
          navigate(redirect);
        } else {
          toast({
            title: "Access Denied",
            description: "You are not authorized as an admin. Redirecting to user dashboard.",
            variant: "destructive",
          });
          navigate("/profile");
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message || "Invalid credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-football-accent/20 to-football-primary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-football-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>Secure administrative portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Access Admin Panel
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-football-primary hover:underline">
              Back to Home
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/admin/bets">
              <Button variant="outline" className="text-base font-semibold">
                Go to Admin Bets (dev)
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;