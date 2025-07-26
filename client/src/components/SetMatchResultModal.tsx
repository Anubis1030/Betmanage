import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { MatchesAPI } from "@/api";

interface SetMatchResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  onMatchUpdated: () => void;
}

const SetMatchResultModal = ({ isOpen, onClose, match, onMatchUpdated }: SetMatchResultModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    winner: '',
    teamAScore: '',
    teamBScore: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      winner: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultData = {
        winner: formData.winner,
        teamAScore: parseInt(formData.teamAScore),
        teamBScore: parseInt(formData.teamBScore)
      };

      await MatchesAPI.setMatchResult(match._id, resultData);
      
      toast({
        title: "Match Result Set",
        description: "The match result has been successfully recorded."
      });
      
      onMatchUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to set match result.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Match Result</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="winner">Winner</Label>
            <Select onValueChange={handleSelectChange} value={formData.winner}>
              <SelectTrigger>
                <SelectValue placeholder="Select winner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TeamA">{match?.teamA || 'Team A'}</SelectItem>
                <SelectItem value="TeamB">{match?.teamB || 'Team B'}</SelectItem>
                <SelectItem value="Draw">Draw</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamAScore">{match?.teamA || 'Team A'} Score</Label>
              <Input
                id="teamAScore"
                name="teamAScore"
                type="number"
                min="0"
                placeholder="0"
                value={formData.teamAScore}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamBScore">{match?.teamB || 'Team B'} Score</Label>
              <Input
                id="teamBScore"
                name="teamBScore"
                type="number"
                min="0"
                placeholder="0"
                value={formData.teamBScore}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.winner || !formData.teamAScore || !formData.teamBScore || loading}>
              {loading ? "Saving..." : "Save Result"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetMatchResultModal;