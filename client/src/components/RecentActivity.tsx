import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Clock, TrendingDown } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "bet" | "win" | "loss" | "bonus";
  description: string;
  amount: number;
  timestamp: string;
  match?: string;
  odds?: number;
  selectedTeam?: string;
  matchResult?: string;
  potentialWin?: number;
  matchScore?: string;
  matchDate?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bet":
        return <Clock className="h-4 w-4 text-info" />;
      case "win":
        return <Trophy className="h-4 w-4 text-success" />;
      case "loss":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "bonus":
        return <Coins className="h-4 w-4 text-accent" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "bet":
        return <Badge variant="info">Bet Placed</Badge>;
      case "win":
        return <Badge variant="success">Won</Badge>;
      case "loss":
        return <Badge variant="destructive">Lost</Badge>;
      case "bonus":
        return <Badge variant="warning">Bonus</Badge>;
      default:
        return <Badge variant="secondary">Activity</Badge>;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case "win":
      case "bonus":
        return "text-success";
      case "loss":
        return "text-destructive";
      case "bet":
        return "text-warning";
      default:
        return "text-foreground";
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case "win":
      case "bonus":
        return "+";
      case "loss":
      case "bet":
        return "-";
      default:
        return "";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-lg bg-gradient-to-r from-card via-card/95 to-card border border-border/50 hover:border-primary/30 transition-all duration-300 animate-slide-up group hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {getActivityBadge(activity.type)}
                        {activity.odds && (
                          <Badge variant="outline" className="text-xs border-primary/30">
                            {activity.odds}x
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right font-bold text-lg ${getAmountColor(activity.type)}`}>
                    <div className="flex items-center justify-end">
                      {getAmountPrefix(activity.type)}{activity.amount.toLocaleString()}
                      <Coins className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-2">
                  {activity.match && (
                    <div className="bg-secondary/20 rounded-md p-3 border border-secondary/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {activity.match}
                          </p>
                          {activity.selectedTeam && (
                            <p className="text-xs text-muted-foreground">
                              Selected: <span className="text-primary font-medium">{activity.selectedTeam}</span>
                            </p>
                          )}
                          {activity.matchScore && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Final Score: <span className="font-medium">{activity.matchScore}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {activity.potentialWin && activity.type === "bet" && (
                            <p className="text-xs text-muted-foreground">
                              Potential: <span className="text-success font-medium">+{activity.potentialWin.toLocaleString()}</span>
                            </p>
                          )}
                          {activity.matchResult && (
                            <p className="text-xs text-muted-foreground">
                              Result: <span className={activity.type === "win" ? "text-success" : activity.type === "loss" ? "text-destructive" : "text-warning"}>{activity.matchResult}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>
                      {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {activity.matchDate && activity.matchDate !== activity.timestamp.split('T')[0] && (
                      <p>
                        Match Date: {new Date(activity.matchDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};