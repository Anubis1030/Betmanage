import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Mock data for demonstration
const mockBets = [
  {
    id: 1,
    user: "John Doe",
    match: "Manchester United vs Liverpool",
    selectedTeam: "Liverpool",
    betAmount: 100,
    odds: 1.8,
    timestamp: "2024-07-21T15:00:00",
  },
  {
    id: 2,
    user: "Jane Smith",
    match: "Arsenal vs Chelsea",
    selectedTeam: "Arsenal",
    betAmount: 200,
    odds: 2.1,
    timestamp: "2024-07-21T16:00:00",
  },
  {
    id: 3,
    user: "Alex Lee",
    match: "Barcelona vs Real Madrid",
    selectedTeam: "Real Madrid",
    betAmount: 150,
    odds: 2.3,
    timestamp: "2024-07-21T17:00:00",
  },
  {
    id: 4,
    user: "Priya Patel",
    match: "Juventus vs AC Milan",
    selectedTeam: "Juventus",
    betAmount: 120,
    odds: 2.0,
    timestamp: "2024-07-21T18:00:00",
  },
];

const AdminBets = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/admin/dashboard" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">All User Bets</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Bets Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Odds</TableHead>
                    <TableHead>Placed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell className="font-medium">{bet.user}</TableCell>
                      <TableCell>{bet.match}</TableCell>
                      <TableCell>
                        <Badge variant="info">{bet.selectedTeam}</Badge>
                      </TableCell>
                      <TableCell>{bet.betAmount} coins</TableCell>
                      <TableCell>{bet.odds}x</TableCell>
                      <TableCell>{new Date(bet.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBets; 