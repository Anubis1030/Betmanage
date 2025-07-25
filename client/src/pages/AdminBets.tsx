import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { BetsAPI } from "@/api";

const AdminBets = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      setLoading(true);
      try {
        const { data } = await BetsAPI.getAllBets();
        setBets(data.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load bets");
      } finally {
        setLoading(false);
      }
    };
    fetchBets();
  }, []);

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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading bets...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : bets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No bets found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    bets.map((bet) => (
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
                    ))
                  )}
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