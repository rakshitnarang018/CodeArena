'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar,
  Github,
  Video,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface SubmissionCardProps {
  submission: Submission;
  onEdit: (submission: Submission) => void;
  onDelete: (submissionId: string) => void;
}

function SubmissionCard({ submission, onEdit, onDelete }: SubmissionCardProps) {
  const isSubmitted = !!submission.submittedAt;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {submission.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{submission.teamName || `Team ${submission.teamId}`}</span>
                  <span>•</span>
                  <span>{submission.eventName || `Event ${submission.eventId}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isSubmitted ? "default" : "secondary"}
                  className={isSubmitted ? "bg-green-100 text-green-800" : ""}
                >
                  {isSubmitted ? "Submitted" : "Draft"}
                </Badge>
                <Badge variant="outline">{submission.track}</Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {submission.description}
            </p>

            {/* Links */}
            <div className="flex items-center gap-4">
              {submission.githubUrl && (
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {submission.videoUrl && (
                <a
                  href={submission.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Video className="h-4 w-4" />
                  Demo Video
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {submission.docs.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {submission.docs.length} document{submission.docs.length > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {isSubmitted ? 'Submitted' : 'Updated'} {formatDistanceToNow(new Date(isSubmitted ? submission.submittedAt : submission.updatedAt))} ago
                </span>
              </div>
              {submission.round > 1 && (
                <Badge variant="outline" className="text-xs">
                  Round {submission.round}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(submission)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(submission._id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubmissionCard;