import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MatchesAPI, BetsAPI, AuthAPI } from "@/api";
import { AuthRequiredAction } from "@/components/AuthRequiredAction";
import { InsufficientCoinsAlert } from "@/components/InsufficientCoinsAlert";

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const { toast } = useToast();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placingBet, setPlacingBet] = useState(false);
  const [userCoins, setUserCoins] = useState<number | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const { data } = await MatchesAPI.getMatchById(id!);
        setMatch(data);
        setError(null);
      } catch (err) {
        setError("Failed to load match");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMatch();
  }, [id]);

  useEffect(() => {
    // Try to get user profile to display available coins
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await AuthAPI.getProfile();
          setUserCoins(data.coinBalance || 1250); // Fallback to 1250 if not available
        }
      } catch (err) {
        console.error("Could not fetch user profile", err);
        // Don't show error toast as this is optional information
      }
    };
    fetchUserProfile();
  }, []);

  const handlePlaceBet = async () => {
    if (!selectedTeam || !betAmount) {
      toast({
        title: "Error",
        description: "Please select a team and enter bet amount",
        variant: "destructive",
      });
      return;
    }

    const amount = Number(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    if (userCoins !== null && amount > userCoins) {
      toast({
        title: "Insufficient Coins",
        description: "You don't have enough coins for this bet",
        variant: "destructive",
      });
      
      // Show the detailed insufficient coins alert directly in the UI
      setError("insufficient_coins");
      return;
    } else {
      // Clear any previous insufficient coins error
      if (error === "insufficient_coins") {
        setError(null);
      }
    }

    try {
      setPlacingBet(true);
      
      // Determine which team was chosen (TeamA or TeamB in the API)
      const teamChosen = selectedTeam === match.teamA ? 'TeamA' : 'TeamB';
      
      await BetsAPI.placeBet({
        matchId: id!,
        teamChosen,
        amount,
        odds: teamChosen === 'TeamA' ? match.oddsA : match.oddsB
      });
      
      toast({
        title: "Bet Placed Successfully!",
        description: `${betAmount} coins on ${selectedTeam}`,
      });
      
      // Update user coins
      if (userCoins !== null) {
        setUserCoins(userCoins - amount);
      }
      
      setBetAmount("");
      setSelectedTeam(null);
      
      // Optionally navigate to betting history
      // navigate('/betting-history');
    } catch (error: any) {
      // Display the exact error message from the server
      const errorMessage = error?.response?.data?.message || "An error occurred while placing your bet";
      toast({
        title: errorMessage.includes("Insufficient") ? "Insufficient Coins" : "Failed to Place Bet",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPlacingBet(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error && error !== "insufficient_coins" && !match) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Match not found"}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation userCoins={userCoins || 0} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-football-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matches
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Badge variant="secondary">{match.status}</Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(match.startTime).toLocaleString()}
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-center mt-2">
                  {match.teamA} vs {match.teamB}
                </CardTitle>
                <CardDescription className="text-center">
                  {match.title || "Match Details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold">{match.teamA}</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-football-primary">
                      {match.oddsA}x
                    </div>
                    <AuthRequiredAction
                      fallbackText="Login to place bets"
                      buttonText={`Bet on ${match.teamA}`}
                      className="w-full py-2 sm:py-3 text-base sm:text-lg"
                      variant={selectedTeam === match.teamA ? "default" : "outline"}
                    >
                      <Button
                        variant={selectedTeam === match.teamA ? "default" : "outline"}
                        onClick={() => setSelectedTeam(match.teamA)}
                        className="w-full py-2 sm:py-3 text-base sm:text-lg"
                        disabled={match.status !== "Scheduled" && match.status !== "Ongoing"}
                      >
                        Bet on {match.teamA}
                      </Button>
                    </AuthRequiredAction>
                  </div>
                  <div className="space-y-3 mt-4 sm:mt-0">
                    <h3 className="text-lg sm:text-xl font-semibold">{match.teamB}</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-football-primary">
                      {match.oddsB}x
                    </div>
                    <AuthRequiredAction
                      fallbackText="Login to place bets"
                      buttonText={`Bet on ${match.teamB}`}
                      className="w-full py-2 sm:py-3 text-base sm:text-lg"
                      variant={selectedTeam === match.teamB ? "default" : "outline"}
                    >
                      <Button
                        variant={selectedTeam === match.teamB ? "default" : "outline"}
                        onClick={() => setSelectedTeam(match.teamB)}
                        className="w-full py-2 sm:py-3 text-base sm:text-lg"
                        disabled={match.status !== "Scheduled" && match.status !== "Ongoing"}
                      >
                        Bet on {match.teamB}
                      </Button>
                    </AuthRequiredAction>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {match.totalBets || 0} predictions placed
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Place Your Bet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTeam && (
                  <div className="p-3 bg-football-primary/10 rounded-lg">
                    <p className="text-sm text-center">
                      Selected: <span className="font-semibold">{selectedTeam}</span>
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="bet-amount">Bet Amount (Coins)</Label>
                  <Input
                    id="bet-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    min="1"
                    max="1250"
                    className={error === "insufficient_coins" ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {userCoins !== null ? userCoins.toLocaleString() : "--"} coins
                  </p>
                  
                  {error === "insufficient_coins" && betAmount && (
                    <div className="mt-2">
                      <InsufficientCoinsAlert 
                        currentBalance={userCoins} 
                        requiredAmount={Number(betAmount)} 
                      />
                    </div>
                  )}
                </div>

                {selectedTeam && betAmount && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bet Amount:</span>
                      <span>{betAmount} coins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Potential Win:</span>
                      <span className="text-football-primary font-semibold">
                        {Math.round(Number(betAmount) * (selectedTeam === match.teamA ? match.oddsA : match.oddsB))} coins
                      </span>
                    </div>
                  </div>
                )}

                <AuthRequiredAction
                  fallbackText="Login to confirm your bet"
                  buttonText="Login to Bet"
                  className="w-full"
                >
                  <Button 
                    onClick={handlePlaceBet}
                    disabled={!selectedTeam || !betAmount || placingBet}
                    className="w-full"
                  >
                    {placingBet ? "Placing Bet..." : "Confirm Bet"}
                  </Button>
                </AuthRequiredAction>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;