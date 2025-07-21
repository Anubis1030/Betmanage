import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Clock } from "lucide-react";

const BettingHistory = () => {
  const [filter, setFilter] = useState("all");

  const bettingHistory = [
    {
      id: 1,
      matchId: "1",
      teams: "Manchester United vs Liverpool",
      teamA: "Manchester United",
      teamB: "Liverpool", 
      betAmount: 250,
      selectedTeam: "Manchester United",
      odds: 2.5,
      result: "won",
      winAmount: 625,
      netProfit: 375,
      date: "2024-01-19",
      matchTime: "15:00",
      status: "completed",
      league: "Premier League",
      finalScore: "3-1",
      predictedResult: "Manchester United Win",
      actualResult: "Manchester United Win",
      betType: "Match Winner",
      placedAt: "2024-01-18T14:30:00",
      settledAt: "2024-01-19T17:05:00"
    },
    {
      id: 2,
      matchId: "2",
      teams: "Arsenal vs Chelsea",
      teamA: "Arsenal",
      teamB: "Chelsea",
      betAmount: 180,
      selectedTeam: "Arsenal",
      odds: 1.8,
      result: "won",
      winAmount: 324,
      netProfit: 144,
      date: "2024-01-16",
      matchTime: "17:30",
      status: "completed",
      league: "Premier League",
      finalScore: "2-0",
      predictedResult: "Arsenal Win",
      actualResult: "Arsenal Win",
      betType: "Match Winner",
      placedAt: "2024-01-15T16:45:00",
      settledAt: "2024-01-16T19:10:00"
    },
    {
      id: 3,
      matchId: "3",
      teams: "Juventus vs AC Milan",
      teamA: "Juventus",
      teamB: "AC Milan",
      betAmount: 75,
      selectedTeam: "Juventus",
      odds: 2.1,
      result: "lost",
      winAmount: 0,
      netProfit: -75,
      date: "2024-01-17",
      matchTime: "20:00",
      status: "completed",
      league: "Serie A",
      finalScore: "0-2",
      predictedResult: "Juventus Win",
      actualResult: "AC Milan Win",
      betType: "Match Winner",
      placedAt: "2024-01-16T19:20:00",
      settledAt: "2024-01-17T21:50:00"
    },
    {
      id: 4,
      matchId: "4",
      teams: "Barcelona vs Real Madrid",
      teamA: "Barcelona",
      teamB: "Real Madrid",
      betAmount: 300,
      selectedTeam: "Barcelona",
      odds: 2.2,
      result: "pending",
      winAmount: 0,
      netProfit: 0,
      potentialWin: 660,
      date: "2024-01-22",
      matchTime: "21:00",
      status: "pending",
      league: "La Liga",
      predictedResult: "Barcelona Win",
      betType: "Match Winner",
      placedAt: "2024-01-20T11:15:00"
    },
    {
      id: 5,
      matchId: "5",
      teams: "Bayern Munich vs PSG",
      teamA: "Bayern Munich",
      teamB: "PSG",
      betAmount: 150,
      selectedTeam: "Bayern Munich",
      odds: 1.9,
      result: "won",
      winAmount: 285,
      netProfit: 135,
      date: "2024-01-15",
      matchTime: "21:00",
      status: "completed",
      league: "Champions League",
      finalScore: "1-0",
      predictedResult: "Bayern Munich Win",
      actualResult: "Bayern Munich Win",
      betType: "Match Winner",
      placedAt: "2024-01-14T20:30:00",
      settledAt: "2024-01-15T22:45:00"
    },
    {
      id: 6,
      matchId: "6",
      teams: "Chelsea vs Manchester City",
      teamA: "Chelsea",
      teamB: "Manchester City",
      betAmount: 200,
      selectedTeam: "Draw",
      odds: 3.2,
      result: "lost",
      winAmount: 0,
      netProfit: -200,
      date: "2024-01-14",
      matchTime: "16:30",
      status: "completed",
      league: "Premier League",
      finalScore: "1-3",
      predictedResult: "Draw",
      actualResult: "Manchester City Win",
      betType: "Match Winner",
      placedAt: "2024-01-13T14:00:00",
      settledAt: "2024-01-14T18:20:00"
    }
  ];

  const filteredHistory = filter === "all" 
    ? bettingHistory 
    : bettingHistory.filter(bet => bet.result === filter);

  const totalBets = bettingHistory.length;
  const wonBets = bettingHistory.filter(bet => bet.result === "won").length;
  const lostBets = bettingHistory.filter(bet => bet.result === "lost").length;
  const pendingBets = bettingHistory.filter(bet => bet.result === "pending").length;

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
                <SelectItem value="all">All Bets ({bettingHistory.length})</SelectItem>
                <SelectItem value="won">Won ({wonBets})</SelectItem>
                <SelectItem value="lost">Lost ({lostBets})</SelectItem>
                <SelectItem value="pending">Pending ({pendingBets})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <Card className="bg-gradient-card shadow-card border border-border/50">
                <CardContent className="p-12 text-center">
                  <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No bets found</h3>
                  <p className="text-muted-foreground">Try adjusting your filter or place your first bet!</p>
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((bet) => (
                <Card
                  key={bet.id}
                  className={`bg-gradient-to-r from-card via-card/95 to-card border hover:shadow-lg transition-all duration-300 group ${
                    bet.result === "won"
                      ? "border-success/30 hover:border-success/50 hover:shadow-success/10"
                      : bet.result === "lost"
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
                              <h3 className="text-xl font-bold text-foreground">{bet.teams}</h3>
                              <Badge variant="outline" className="text-xs">
                                {bet.league}
                              </Badge>
                              <Badge
                                variant={
                                  bet.result === "won"
                                    ? "default"
                                    : bet.result === "lost"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="font-semibold"
                              >
                                {bet.result.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Match Date: {new Date(bet.date).toLocaleDateString()} at {bet.matchTime}</p>
                              <p>Bet Placed: {new Date(bet.placedAt).toLocaleDateString()} at {new Date(bet.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              {bet.settledAt && (
                                <p>Settled: {new Date(bet.settledAt).toLocaleDateString()} at {new Date(bet.settledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              )}
                            </div>
                          </div>
                          {bet.finalScore && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-foreground">{bet.finalScore}</div>
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
                                bet.result === "won" 
                                  ? "text-success" 
                                  : bet.result === "lost" 
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
                          bet.result === "won"
                            ? "bg-success/10 border-success/30"
                            : bet.result === "lost"
                            ? "bg-destructive/10 border-destructive/30"
                            : "bg-warning/10 border-warning/30"
                        }`}>
                          <h4 className="font-semibold mb-3 text-foreground">Financial Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Bet Amount:</span>
                              <span className="font-medium">-{bet.betAmount} coins</span>
                            </div>
                            {bet.result === "won" && (
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
                            {bet.result === "lost" && (
                              <>
                                <hr className="border-border/50" />
                                <div className="flex justify-between">
                                  <span className="font-semibold">Net Loss:</span>
                                  <span className="font-bold text-destructive">{bet.netProfit} coins</span>
                                </div>
                              </>
                            )}
                            {bet.result === "pending" && (
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

                        {bet.result === "pending" && (
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