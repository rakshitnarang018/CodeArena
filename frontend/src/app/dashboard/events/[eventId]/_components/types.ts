// Event interface matching the API response exactly
export interface Event {
  EventID: number;
  OrganizerID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: 'Online' | 'Offline' | 'Hybrid';
  StartDate: string;
  EndDate: string;
  SubmissionDeadline: string | null;
  ResultDate: string | null;
  Rules: string;
  Timeline: string;
  Tracks: string;
  Prizes: string;
  MaxTeamSize: number;
  Sponsors: string | null;
  IsActive: boolean;
  CreatedAt: string;
}

