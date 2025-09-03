'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';

interface JudgingDialogProps {
  submission: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function JudgingDialog({ submission, isOpen, onClose, onUpdate }: JudgingDialogProps) {
  const [scores, setScores] = useState({
    innovation: submission.scores?.innovation || 5,
    technical: submission.scores?.technical || 5,
    presentation: submission.scores?.presentation || 5,
    impact: submission.scores?.impact || 5,
    overall: submission.scores?.overall || 5
  });
  const [comments, setComments] = useState(submission.judgeComments || '');
  const [isWinner, setIsWinner] = useState(submission.isWinner || false);
  const [prize, setPrize] = useState(submission.prize || '');
  const [loading, setLoading] = useState(false);

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const handleScoreChange = (criteria: string, value: number[]) => {
    setScores(prev => ({ ...prev, [criteria]: value[0] }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const judgeData = {
        scores,
        totalScore,
        judgeComments: comments,
        isWinner,
        prize: isWinner ? prize : null,
        judgingStatus: 'judged'
      };

      await apiRequest(`/submissions/${submission._id}/judge`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(judgeData)
      });

      toast.success('Submission judged successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error judging submission:', error);
      toast.error('Failed to judge submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            Judge Submission: {submission.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Submission Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{submission.teamName || `Team ${submission.teamId}`}</Badge>
                <Badge variant="outline">{submission.track}</Badge>
                <Badge variant="outline">{submission.eventName || `Event ${submission.eventId}`}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{submission.description}</p>
            </CardContent>
          </Card>

          {/* Scoring Criteria */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Scoring Criteria (0-10 each)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(scores).map(([criteria, score]) => (
                <div key={criteria} className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="capitalize">{criteria}</Label>
                    <span className="font-medium">{score}/10</span>
                  </div>
                  <Slider
                    value={[score]}
                    onValueChange={(value) => handleScoreChange(criteria, value)}
                    max={10}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Total Score</Label>
                  <span className="text-2xl font-bold text-purple-600">{totalScore}/50</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Judge Comments</Label>
            <Textarea
              id="comments"
              placeholder="Provide detailed feedback about the submission..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          {/* Winner Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Winner Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isWinner"
                  checked={isWinner}
                  onChange={(e) => setIsWinner(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isWinner">Mark as Winner</Label>
              </div>
              
              {isWinner && (
                <div className="space-y-2">
                  <Label htmlFor="prize">Prize/Position</Label>
                  <Select value={prize} onValueChange={setPrize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prize/position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Place">1st Place</SelectItem>
                      <SelectItem value="2nd Place">2nd Place</SelectItem>
                      <SelectItem value="3rd Place">3rd Place</SelectItem>
                      <SelectItem value="Best Innovation">Best Innovation</SelectItem>
                      <SelectItem value="Best Technical">Best Technical Implementation</SelectItem>
                      <SelectItem value="Best Presentation">Best Presentation</SelectItem>
                      <SelectItem value="People's Choice">People's Choice</SelectItem>
                      <SelectItem value="Special Recognition">Special Recognition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Judging...' : 'Submit Judgment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
