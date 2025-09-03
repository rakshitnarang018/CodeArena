'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { 
  ReadOnlySubmissionCard,
  LoadingState
} from './_components';

interface Submission {
  _id: string;
  eventId: number;
  teamId: number;
  title: string;
  description: string;
  track: string;
  githubUrl?: string;
  videoUrl?: string;
  docs: string[];
  round: number;
  submittedAt: string;
  updatedAt: string;
  eventName?: string;
  teamName?: string;
}

export default function ParticipantSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ data: Submission[] }>('/submissions/my-submissions');
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Submissions</h1>
          <p className="text-muted-foreground mt-1">
            View your project submissions across all events
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No submissions yet</h3>
              <p className="text-sm text-muted-foreground">
                Your project submissions will appear here. Submit from active event pages.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map((submission) => (
                <ReadOnlySubmissionCard
                  key={submission._id}
                  submission={submission}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submissions.filter(s => s.submittedAt).length === 0 ? (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No submitted projects</h3>
              <p className="text-sm text-muted-foreground">
                Your submitted projects will appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions
                .filter(s => s.submittedAt)
                .map((submission) => (
                  <ReadOnlySubmissionCard
                    key={submission._id}
                    submission={submission}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
