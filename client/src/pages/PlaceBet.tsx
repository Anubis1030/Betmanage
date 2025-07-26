import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PlaceBet = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Place Your Bet</h1>
      <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
    </div>
  );
};

export default PlaceBet; 