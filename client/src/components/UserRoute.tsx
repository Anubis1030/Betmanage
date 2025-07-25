import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "@/api/authAPI";

export default function UserRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await AuthAPI.getProfile();
        if (data && data.role === "user") {
          setIsUser(true);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return isUser ? <>{children}</> : null;
} 