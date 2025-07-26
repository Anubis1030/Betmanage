import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { AuthRequiredAction } from "@/components/AuthRequiredAction";
import { Gamepad, Trophy, Coins, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthAPI, TransactionAPI } from "@/api";

const PlayGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [userCoins, setUserCoins] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [claimingReward, setClaimingReward] = useState(false);

  useEffect(() => {
    // Try to get user profile to display available coins
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await AuthAPI.getProfile();
          setUserCoins(data.coinBalance || 1250); // Fallback to 1250 if not available
          setUserId(data._id || null);
        }
      } catch (err) {
        console.error("Could not fetch user profile", err);
        // Don't show error toast as this is optional information
      }
    };
    fetchUserProfile();
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameScore(0);
  };

  const increaseScore = () => {
    setGameScore(prev => prev + 10);
  };

  const claimReward = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }

    const rewardAmount = Math.floor(gameScore / 10);
    if (rewardAmount <= 0) {
      toast({
        title: "Not Enough Points",
        description: "You need at least 10 points to claim a reward",
        variant: "destructive",
      });
      return;
    }

    try {
      setClaimingReward(true);
      
      await TransactionAPI.adjustUserCoins({
        userId,
        type: 'credit',
        amount: rewardAmount,
        reason: 'Game reward'
      });
      
      // Update local state
      if (userCoins !== null) {
        setUserCoins(userCoins + rewardAmount);
      }
      
      toast({
        title: "Reward Claimed!",
        description: `You earned ${rewardAmount} coins!`,
      });
      
      setGameStarted(false);
    } catch (error: any) {
      toast({
        title: "Failed to Claim Reward",
        description: error?.response?.data?.message || "An error occurred while claiming your reward",
        variant: "destructive",
      });
    } finally {
      setClaimingReward(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userCoins={userCoins || 0} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="inline-flex items-center text-football-primary hover:underline"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-center flex items-center justify-center">
              <Gamepad className="w-6 h-6 mr-2" />
              Football Prediction Game
            </CardTitle>
            <CardDescription className="text-center">
              Test your prediction skills and earn bonus coins!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!gameStarted ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Play our mini-game to earn bonus coins that you can use for betting!
                </p>
                
                <AuthRequiredAction
                  fallbackText="Login to play games and earn bonus coins"
                  buttonText="Login to Play"
                  className="mx-auto"
                  onAuthenticated={startGame}
                >
                  <Button 
                    size="lg" 
                    onClick={startGame}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  >
                    Start Game
                  </Button>
                </AuthRequiredAction>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    <span className="font-semibold">Score: {gameScore}</span>
                  </div>
                  <div className="flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-yellow-500" />
                    <span className="font-semibold">Potential Reward: {Math.floor(gameScore / 10)} coins</span>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="mb-4">Click the button to score points!</p>
                  <Button 
                    size="lg" 
                    onClick={increaseScore}
                    className="animate-pulse-gentle"
                  >
                    Score Points
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setGameStarted(false)}>
                    End Game
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={claimReward}
                    disabled={gameScore < 50 || claimingReward}
                  >
                    {claimingReward ? "Claiming..." : `Claim ${Math.floor(gameScore / 10)} Coins`}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayGame;