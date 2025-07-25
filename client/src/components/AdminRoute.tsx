import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "@/api/authAPI";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await AuthAPI.getProfile();
        if (data && data.role === "admin") {
          setIsAdmin(true);
        } else {
          navigate("/admin/login");
        }
      } catch {
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return isAdmin ? <>{children}</> : null;
} 