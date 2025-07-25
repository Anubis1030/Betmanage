import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Trophy, Coins, TrendingUp, Plus, Settings, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { MatchesAPI } from "@/api";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    dateTime: "",
    oddsA: "",
    oddsB: ""
  });
  const navigate = useNavigate();

  const adminStats = {
    totalUsers: 156,
    activeMatches: 8,
    totalCoinsInSystem: 45670,
    todaysBets: 23
  };

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", coins: 1250, status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", coins: 890, status: "active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", coins: 2100, status: "active" },
  ];

  const pendingMatches = [
    { id: 1, teamA: "Barcelona", teamB: "Real Madrid", date: "2024-01-22", status: "pending" },
    { id: 2, teamA: "Arsenal", teamB: "Chelsea", date: "2024-01-21", status: "live" },
  ];

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matchData = {
        teamA: newMatch.teamA,
        teamB: newMatch.teamB,
        startTime: newMatch.dateTime,
        oddsA: parseFloat(newMatch.oddsA),
        oddsB: parseFloat(newMatch.oddsB),
      };
      const { data } = await MatchesAPI.createMatch(matchData);
      if (data && (data._id || data.id)) {
        toast({
          title: "Match Created",
          description: `${newMatch.teamA} vs ${newMatch.teamB} scheduled successfully!`,
        });
        setNewMatch({ teamA: "", teamB: "", dateTime: "", oddsA: "", oddsB: "" });
      } else {
        throw new Error("No match created");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create match.",
        variant: "destructive",
      });
    }
  };

  const handleCoinAdjustment = (userId: number, amount: number) => {
    toast({
      title: "Coins Adjusted",
      description: `${amount > 0 ? "Added" : "Removed"} ${Math.abs(amount)} coins for user ID ${userId}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your football prediction platform</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-destructive text-white rounded hover:bg-destructive/80 transition">Logout</button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-football-primary" />
                <div>
                  <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-football-primary" />
                <div>
                  <div className="text-2xl font-bold">{adminStats.activeMatches}</div>
                  <p className="text-sm text-muted-foreground">Active Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-football-primary" />
                <div>
                  <div className="text-2xl font-bold">{adminStats.totalCoinsInSystem.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Coins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-football-primary" />
                <div>
                  <div className="text-2xl font-bold">{adminStats.todaysBets}</div>
                  <p className="text-sm text-muted-foreground">Today's Bets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matches" className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="coins" className="flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              Coins
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateMatch} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamA">Team A</Label>
                        <Input
                          id="teamA"
                          placeholder="Enter team name"
                          value={newMatch.teamA}
                          onChange={(e) => setNewMatch({ ...newMatch, teamA: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamB">Team B</Label>
                        <Input
                          id="teamB"
                          placeholder="Enter team name"
                          value={newMatch.teamB}
                          onChange={(e) => setNewMatch({ ...newMatch, teamB: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateTime">Match Date & Time</Label>
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        value={newMatch.dateTime}
                        onChange={(e) => setNewMatch({ ...newMatch, dateTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="oddsA">Team A Odds</Label>
                        <Input
                          id="oddsA"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 2.5"
                          value={newMatch.oddsA}
                          onChange={(e) => setNewMatch({ ...newMatch, oddsA: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oddsB">Team B Odds</Label>
                        <Input
                          id="oddsB"
                          type="number"
                          step="0.1"
                          placeholder="e.g., 1.8"
                          value={newMatch.oddsB}
                          onChange={(e) => setNewMatch({ ...newMatch, oddsB: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Create Match</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manage Matches</CardTitle>
                  <CardDescription>Monitor and update match statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{match.teamA} vs {match.teamB}</div>
                          <div className="text-sm text-muted-foreground">{match.date}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={match.status === "live" ? "default" : "secondary"}>
                            {match.status}
                          </Badge>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">{user.coins} coins</div>
                          <Badge variant="outline">{user.status}</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCoinAdjustment(user.id, 100)}
                          >
                            +100
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCoinAdjustment(user.id, -50)}
                          >
                            -50
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coin Distribution</CardTitle>
                <CardDescription>Manage system-wide coin allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-select">Select User</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">John Doe</SelectItem>
                          <SelectItem value="2">Jane Smith</SelectItem>
                          <SelectItem value="3">Mike Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coin-amount">Coin Amount</Label>
                      <Input id="coin-amount" type="number" placeholder="Enter amount" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input id="reason" placeholder="Reason for adjustment" />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">Add Coins</Button>
                      <Button variant="outline" className="flex-1">Remove Coins</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Recent Coin Transactions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>John Doe</span>
                        <span className="text-green-600">+150 coins</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>Jane Smith</span>
                        <span className="text-red-600">-75 coins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Matches Created:</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Matches:</span>
                      <span className="font-medium">37</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Predictions:</span>
                      <span className="font-medium">892</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Win Rate:</span>
                      <span className="font-medium">64%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Export User Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export Match Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export Coin Transactions
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex flex-wrap gap-4 mt-8">
          <Link to="/admin/bets">
            <Button variant="outline" className="text-base font-semibold">
              View All User Bets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;