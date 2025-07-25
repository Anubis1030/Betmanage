import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Clock } from "lucide-react";
import { BetsAPI } from "@/api";
import { AuthAPI } from "@/api/authAPI";

const BettingHistory = () => {
  const [filter, setFilter] = useState("all");
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      setLoading(true);
      try {
        const { data: user } = await AuthAPI.getProfile();
        const { data } = await BetsAPI.getUserBets(user._id);
        setBets(data);
        setError(null);
      } catch (err) {
        setError("Failed to load betting history");
      } finally {
        setLoading(false);
      }
    };
    fetchBets();
  }, []);

  const filteredHistory = filter === "all"
    ? bets
    : bets.filter(bet => bet.status === filter);

  const totalBets = bets.length;
  const wonBets = bets.filter(bet => bet.status === "won").length;
  const lostBets = bets.filter(bet => bet.status === "lost").length;
  const pendingBets = bets.filter(bet => bet.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation userCoins={1250} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Betting History</h1>
          <p className="text-muted-foreground">Track your predictions and performance</p>
        </div>



        {/* Detailed Betting History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Detailed Betting History</h2>
              <p className="text-muted-foreground">Complete breakdown of all your betting activity</p>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-gradient-to-r from-card to-card/80 border-border/50">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bets ({totalBets})</SelectItem>
                <SelectItem value="won">Won ({wonBets})</SelectItem>
                <SelectItem value="lost">Lost ({lostBets})</SelectItem>
                <SelectItem value="pending">Pending ({pendingBets})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {loading && (
              <Card className="bg-gradient-card shadow-card border border-border/50">
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">Loading betting history...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your bets.</p>
                </CardContent>
              </Card>
            )}
            {error && (
              <Card className="bg-gradient-card shadow-card border border-border/50">
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">Error: {error}</h3>
                  <p className="text-muted-foreground">Failed to load your betting history. Please try again later.</p>
                </CardContent>
              </Card>
            )}
            {!loading && !error && filteredHistory.length === 0 && (
              <Card className="bg-gradient-card shadow-card border border-border/50">
                <CardContent className="p-12 text-center">
                  <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No bets found</h3>
                  <p className="text-muted-foreground">Try adjusting your filter or place your first bet!</p>
                </CardContent>
              </Card>
            )}
            {!loading && !error && filteredHistory.length > 0 && (
              filteredHistory.map((bet) => (
                <Card
                  key={bet.id}
                  className={`bg-gradient-to-r from-card via-card/95 to-card border hover:shadow-lg transition-all duration-300 group ${
                    bet.status === "won"
                      ? "border-success/30 hover:border-success/50 hover:shadow-success/10"
                      : bet.status === "lost"
                      ? "border-destructive/30 hover:border-destructive/50 hover:shadow-destructive/10"
                      : "border-warning/30 hover:border-warning/50 hover:shadow-warning/10"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Match Information */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-foreground">{bet.matchDetails.teams}</h3>
                              <Badge variant="outline" className="text-xs">
                                {bet.matchDetails.league}
                              </Badge>
                              <Badge
                                variant={
                                  bet.status === "won"
                                    ? "default"
                                    : bet.status === "lost"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="font-semibold"
                              >
                                {bet.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Match Date: {new Date(bet.matchDetails.date).toLocaleDateString()} at {bet.matchDetails.matchTime}</p>
                              <p>Bet Placed: {new Date(bet.placedAt).toLocaleDateString()} at {new Date(bet.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              {bet.settledAt && (
                                <p>Settled: {new Date(bet.settledAt).toLocaleDateString()} at {new Date(bet.settledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              )}
                            </div>
                          </div>
                          {bet.matchDetails.finalScore && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-foreground">{bet.matchDetails.finalScore}</div>
                              <div className="text-sm text-muted-foreground">Final Score</div>
                            </div>
                          )}
                        </div>

                                                {/* Bet Details */}
                        <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/30">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Bet Type</div>
                              <div className="font-semibold">{bet.betType}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Selection</div>
                              <div className="font-semibold text-primary">{bet.selectedTeam}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Odds</div>
                              <div className="font-semibold">{bet.odds}x</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Bet Amount</div>
                              <div className="font-semibold">
                                {bet.betAmount} coins
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Prediction vs Result */}
                        <div className="bg-muted/20 rounded-lg p-4 border border-muted/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Your Prediction</div>
                              <div className="font-semibold text-foreground">{bet.predictedResult}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Actual Result</div>
                              <div className={`font-semibold ${
                                bet.status === "won" 
                                  ? "text-success" 
                                  : bet.status === "lost" 
                                  ? "text-destructive" 
                                  : "text-warning"
                              }`}>
                                {bet.actualResult || "Match Pending"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="space-y-4">
                        <div className={`rounded-lg p-4 border ${
                          bet.status === "won"
                            ? "bg-success/10 border-success/30"
                            : bet.status === "lost"
                            ? "bg-destructive/10 border-destructive/30"
                            : "bg-warning/10 border-warning/30"
                        }`}>
                          <h4 className="font-semibold mb-3 text-foreground">Financial Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Bet Amount:</span>
                              <span className="font-medium">-{bet.betAmount} coins</span>
                            </div>
                            {bet.status === "won" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Payout:</span>
                                  <span className="font-medium text-success">+{bet.winAmount} coins</span>
                                </div>
                                <hr className="border-border/50" />
                                <div className="flex justify-between">
                                  <span className="font-semibold">Net Profit:</span>
                                  <span className="font-bold text-success">+{bet.netProfit} coins</span>
                                </div>
                              </>
                            )}
                            {bet.status === "lost" && (
                              <>
                                <hr className="border-border/50" />
                                <div className="flex justify-between">
                                  <span className="font-semibold">Net Loss:</span>
                                  <span className="font-bold text-destructive">{bet.netProfit} coins</span>
                                </div>
                              </>
                            )}
                            {bet.status === "pending" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Potential Win:</span>
                                  <span className="font-medium text-success">+{bet.potentialWin} coins</span>
                                </div>
                                <hr className="border-border/50" />
                                <div className="flex justify-between">
                                  <span className="font-semibold">Potential Profit:</span>
                                  <span className="font-bold text-warning">+{(bet.potentialWin || 0) - bet.betAmount} coins</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {bet.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-card to-card/80 border-warning/30 hover:border-warning/50 hover:bg-warning/5"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Match in Progress
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingHistory; 