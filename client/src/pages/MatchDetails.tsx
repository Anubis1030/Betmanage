import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MatchDetails = () => {
  const { id } = useParams();
  const [betAmount, setBetAmount] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock match data
  const match = {
    id: id,
    teamA: "Manchester United",
    teamB: "Liverpool",
    dateTime: "2024-01-20T15:00:00",
    oddsA: 2.5,
    oddsB: 1.8,
    status: "upcoming" as const,
    totalBets: 45,
    description: "Premier League - Matchday 20",
    venue: "Old Trafford",
    userBet: null
  };

  const handlePlaceBet = () => {
    if (!selectedTeam || !betAmount) {
      toast({
        title: "Error",
        description: "Please select a team and enter bet amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Bet Placed Successfully!",
      description: `${betAmount} coins on ${selectedTeam}`,
    });
    
    setBetAmount("");
    setSelectedTeam(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userCoins={1250} />
      
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
                    {new Date(match.dateTime).toLocaleString()}
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-center mt-2">
                  {match.teamA} vs {match.teamB}
                </CardTitle>
                <CardDescription className="text-center">
                  {match.description} • {match.venue}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold">{match.teamA}</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-football-primary">
                      {match.oddsA}x
                    </div>
                    <Button
                      variant={selectedTeam === match.teamA ? "default" : "outline"}
                      onClick={() => setSelectedTeam(match.teamA)}
                      className="w-full py-2 sm:py-3 text-base sm:text-lg"
                    >
                      Bet on {match.teamA}
                    </Button>
                  </div>
                  <div className="space-y-3 mt-4 sm:mt-0">
                    <h3 className="text-lg sm:text-xl font-semibold">{match.teamB}</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-football-primary">
                      {match.oddsB}x
                    </div>
                    <Button
                      variant={selectedTeam === match.teamB ? "default" : "outline"}
                      onClick={() => setSelectedTeam(match.teamB)}
                      className="w-full py-2 sm:py-3 text-base sm:text-lg"
                    >
                      Bet on {match.teamB}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {match.totalBets} predictions placed
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
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: 1,250 coins
                  </p>
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

                <Button 
                  onClick={handlePlaceBet}
                  disabled={!selectedTeam || !betAmount}
                  className="w-full"
                >
                  Confirm Bet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;