import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { MatchesAPI } from "@/api";

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  onMatchUpdated: () => void;
}

const EditMatchModal = ({ isOpen, onClose, match, onMatchUpdated }: EditMatchModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    teamA: '',
    teamB: '',
    startTime: '',
    oddsA: '',
    oddsB: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match) {
      // Format the date for the datetime-local input
      const formattedDate = match.startTime 
        ? new Date(match.startTime).toISOString().slice(0, 16)
        : '';

      setFormData({
        title: match.title || '',
        teamA: match.teamA || '',
        teamB: match.teamB || '',
        startTime: formattedDate,
        oddsA: match.oddsA?.toString() || '',
        oddsB: match.oddsB?.toString() || ''
      });
    }
  }, [match]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        title: formData.title,
        teamA: formData.teamA,
        teamB: formData.teamB,
        startTime: formData.startTime,
        oddsA: parseFloat(formData.oddsA),
        oddsB: parseFloat(formData.oddsB)
      };

      await MatchesAPI.updateMatch(match._id, updateData);
      
      toast({
        title: "Match Updated",
        description: "The match details have been successfully updated."
      });
      
      onMatchUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update match.",
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
          <DialogTitle>Edit Match</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Match Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter match title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamA">Team A</Label>
              <Input
                id="teamA"
                name="teamA"
                placeholder="Enter team name"
                value={formData.teamA}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamB">Team B</Label>
              <Input
                id="teamB"
                name="teamB"
                placeholder="Enter team name"
                value={formData.teamB}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Match Date & Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oddsA">Team A Odds</Label>
              <Input
                id="oddsA"
                name="oddsA"
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
                value={formData.oddsA}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oddsB">Team B Odds</Label>
              <Input
                id="oddsB"
                name="oddsB"
                type="number"
                step="0.1"
                placeholder="e.g., 1.8"
                value={formData.oddsB}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Match'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMatchModal;