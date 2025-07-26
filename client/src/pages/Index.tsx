import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { DashboardStats } from "@/components/DashboardStats";
import { MatchCard } from "@/components/MatchCard";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy, History } from "lucide-react";
import { MatchesAPI } from "@/api";
import { AuthAPI } from "@/api/authAPI";

// Mock data
const mockActivities = [
  {
    id: "1",
    type: "win" as const,
    description: "Prediction won - Correct result!",
    amount: 250,
    timestamp: "2024-01-19T18:30:00",
    match: "Bayern Munich vs PSG",
    odds: 2.5,
    selectedTeam: "Bayern Munich",
    matchResult: "Bayern Munich won 3-1",
    matchScore: "3-1",
    potentialWin: 250,
    matchDate: "2024-01-19"
  },
  {
    id: "2",
    type: "bet" as const,
    description: "New bet placed - Active prediction",
    amount: 100,
    timestamp: "2024-01-19T14:15:00",
    match: "Manchester United vs Liverpool",
    odds: 1.8,
    selectedTeam: "Manchester United",
    potentialWin: 180,
    matchDate: "2024-01-20"
  },
  {
    id: "3",
    type: "bonus" as const,
    description: "Weekly active user bonus",
    amount: 150,
    timestamp: "2024-01-18T09:00:00"
  },
  {
    id: "4",
    type: "loss" as const,
    description: "Prediction lost - Wrong result",
    amount: 75,
    timestamp: "2024-01-17T21:45:00",
    match: "Juventus vs AC Milan",
    odds: 2.1,
    selectedTeam: "Juventus",
    matchResult: "AC Milan won 2-0",
    matchScore: "0-2",
    matchDate: "2024-01-17"
  },
  {
    id: "5",
    type: "win" as const,
    description: "Perfect prediction - High odds win!",
    amount: 420,
    timestamp: "2024-01-16T16:20:00",
    match: "Chelsea vs Arsenal",
    odds: 3.5,
    selectedTeam: "Chelsea",
    matchResult: "Chelsea won 4-2",
    matchScore: "4-2",
    potentialWin: 420,
    matchDate: "2024-01-16"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const { data } = await MatchesAPI.getActiveMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        setError("Failed to load matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const { data: user } = await AuthAPI.getProfile();
        const { data } = await AuthAPI.getStats(user._id);
        setStats(data);
        setStatsError(null);
      } catch (err) {
        setStatsError("Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      setActivityLoading(true);
      try {
        const { data: user } = await AuthAPI.getProfile();
        const { data } = await AuthAPI.getActivity(user._id);
        setActivities(data);
        setActivityError(null);
      } catch (err) {
        setActivityError("Failed to load recent activity");
      } finally {
        setActivityLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation userCoins={1250} />
      
      {activeTab === "dashboard" && <HeroSection />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {statsLoading ? (
              <div>Loading stats...</div>
            ) : statsError ? (
              <div className="text-red-500">{statsError}</div>
            ) : stats ? (
              <DashboardStats
                totalCoins={stats.totalCoins}
                activeBets={stats.activeBets}
                winRate={stats.winRate}
                totalWinnings={stats.totalWinnings}
              />
            ) : null}
            
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Upcoming Matches</h2>
                  <Button variant="outline" onClick={() => setActiveTab("matches")}>
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div className="text-red-500">{error}</div>
                  ) : (
                    matches.slice(0, 2).map((match) => (
                      <MatchCard key={match._id || match.id} id={match._id} {...match} />
                    ))
                  )}
                </div>
              </div>
              
              {activityLoading ? (
                <div>Loading activity...</div>
              ) : activityError ? (
                <div className="text-red-500">{activityError}</div>
              ) : (
                <RecentActivity activities={activities} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">All Matches</h2>
              <p className="text-muted-foreground">Place your predictions and earn coins</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                matches.map((match) => (
                  <MatchCard key={match._id || match.id} id={match._id} {...match} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Prediction History</h2>
              <p className="text-muted-foreground">Track your betting performance</p>
            </div>
            
            <RecentActivity activities={mockActivities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
