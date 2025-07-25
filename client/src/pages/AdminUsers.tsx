import { useEffect, useState } from "react";
import { AdminAPI } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await AdminAPI.getAllUsers({ page, search });
        setUsers(data.data || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, search]);

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4 gap-2">
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setPage(1)}>Search</Button>
        </div>
        {loading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Coins</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user._id}>
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border">{user.coinBalance}</td>
                    <td className="p-2 border">{user.isBlocked ? "Blocked" : "Active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span>Page {page}</span>
              <Button disabled={users.length < 20} onClick={() => setPage(page + 1)}>Next</Button>
              <span>Total: {total}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 