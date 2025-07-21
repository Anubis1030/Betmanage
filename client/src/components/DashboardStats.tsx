import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Trophy, Target } from "lucide-react";

interface DashboardStatsProps {
  totalCoins: number;
  activeBets: number;
  winRate: number;
  totalWinnings: number;
}

export const DashboardStats = ({
  totalCoins,
  activeBets,
  winRate,
  totalWinnings
}: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-card shadow-card animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
          <Coins className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{totalCoins.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Available for betting
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bets</CardTitle>
          <Target className="h-4 w-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">{activeBets}</div>
          <p className="text-xs text-muted-foreground">
            Pending results
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{winRate}%</div>
          <p className="text-xs text-muted-foreground">
            Prediction accuracy
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
          <Trophy className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{totalWinnings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Coins earned
          </p>
        </CardContent>
      </Card>
    </div>
  );
};