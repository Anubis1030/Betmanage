import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Coins, TrendingUp, Users } from "lucide-react";

interface MatchCardProps {
  id: string;
  teamA: string;
  teamB: string;
  dateTime: string;
  oddsA: number;
  oddsB: number;
  status: "upcoming" | "live" | "locked" | "finished";
  totalBets?: number;
  userBet?: {
    team: string;
    amount: number;
  };
}

export const MatchCard = ({
  id,
  teamA,
  teamB,
  dateTime,
  oddsA,
  oddsB,
  status,
  totalBets = 0,
  userBet
}: MatchCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "upcoming": return "info";
      case "live": return "success";
      case "locked": return "warning";
      case "finished": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "upcoming": return "Open for Bets";
      case "live": return "Live";
      case "locked": return "Betting Closed";
      case "finished": return "Finished";
      default: return "Unknown";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-glow border border-border/50 hover:border-primary/20 transition-all duration-500 animate-slide-up group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor() as any} className="text-xs">
              {getStatusText()}
            </Badge>
            {status === "live" && (
              <div className="flex items-center text-success">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle mr-1" />
                <span className="text-xs font-medium">LIVE</span>
              </div>
            )}
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(dateTime).toLocaleDateString()}
            </div>
            <div className="text-xs">
              {new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams */}
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground mb-2">
            {teamA} <span className="text-muted-foreground">vs</span> {teamB}
          </div>
        </div>

        {/* Odds */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-secondary/30 rounded-lg border border-secondary/50">
            <div className="font-medium text-foreground">{teamA}</div>
            <div className="text-2xl font-bold text-primary">{oddsA.toFixed(2)}x</div>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg border border-secondary/50">
            <div className="font-medium text-foreground">{teamB}</div>
            <div className="text-2xl font-bold text-primary">{oddsB.toFixed(2)}x</div>
          </div>
        </div>

        {/* User's Current Bet */}
        {userBet && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Coins className="w-4 h-4 text-accent mr-2" />
                <span className="text-sm font-medium">Your Bet</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-accent">{userBet.amount} coins</div>
                <div className="text-xs text-muted-foreground">on {userBet.team}</div>
              </div>
            </div>
          </div>
        )}

        {/* Match Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {totalBets} total bets
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Match #{id}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link to={`/match/${id}`} className="block">
            <Button variant="default" size="sm" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group-hover:scale-[1.02]">
              View Details & Bet
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};