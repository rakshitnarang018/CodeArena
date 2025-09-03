'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizer: string;
  category: 'hackathon' | 'competition' | 'workshop' | 'conference';
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationStart: string;
  registrationEnd: string;
  eventStart: string;
  eventEnd: string;
  maxTeamSize: number;
  minTeamSize: number;
  prizes: string[];
  rules: string[];
  requirements: string[];
  submissionDeadline: string;
  image: string;
  registrationCount: number;
  maxRegistrations?: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Team {
  id: string;
  name: string;
  eventId: string;
  leaderId: string;
  members: string[];
  submission?: {
    id: string;
    title: string;
    description: string;
    githubUrl?: string;
    liveUrl?: string;
    videoUrl?: string;
    submittedAt: string;
  };
}

export interface Submission {
  id: string;
  eventId: string;
  teamId: string;
  teamName: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  submittedAt: string;
  scores?: {
    judgeId: string;
    judgeName: string;
    innovation: number;
    technical: number;
    presentation: number;
    impact: number;
    feedback: string;
  }[];
  totalScore?: number;
  rank?: number;
}

interface EventState {
  events: Event[];
  myEvents: Event[];
  teams: Team[];
  submissions: Submission[];
  loading: boolean;
  selectedEvent: Event | null;
}

type EventAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: Event }
  | { type: 'SET_MY_EVENTS'; payload: Event[] }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'SET_SUBMISSIONS'; payload: Submission[] }
  | { type: 'ADD_SUBMISSION'; payload: Submission }
  | { type: 'UPDATE_SUBMISSION_SCORE'; payload: { submissionId: string; score: { judgeId: string; judgeName: string; innovation: number; technical: number; presentation: number; impact: number; feedback: string; } } }
  | { type: 'SET_SELECTED_EVENT'; payload: Event | null };

const initialState: EventState = {
  events: [],
  myEvents: [],
  teams: [],
  submissions: [],
  loading: false,
  selectedEvent: null,
};

const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'SET_MY_EVENTS':
      return { ...state, myEvents: action.payload };
    case 'SET_TEAMS':
      return { ...state, teams: action.payload };
    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
    case 'SET_SUBMISSIONS':
      return { ...state, submissions: action.payload };
    case 'ADD_SUBMISSION':
      return { ...state, submissions: [...state.submissions, action.payload] };
    case 'UPDATE_SUBMISSION_SCORE':
      return {
        ...state,
        submissions: state.submissions.map(sub =>
          sub.id === action.payload.submissionId
            ? { ...sub, scores: [...(sub.scores || []), action.payload.score] }
            : sub
        ),
      };
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    default:
      return state;
  }
};

interface EventContextType extends EventState {
  fetchEvents: () => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'registrationCount'>) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  createTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  submitProject: (submission: Omit<Submission, 'id' | 'submittedAt'>) => Promise<void>;
  scoreSubmission: (submissionId: string, score: { judgeId: string; judgeName: string; innovation: number; technical: number; presentation: number; impact: number; feedback: string; }) => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  fetchSubmissions: (eventId?: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  const fetchEvents = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call - we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data will be loaded from a separate file
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'registrationCount'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        registrationCount: 0,
      };
      dispatch({ type: 'ADD_EVENT', payload: newEvent });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const registerForEvent = async (eventId: string) => {
    // Simulate registration logic
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const createTeam = async (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_TEAM', payload: newTeam });
  };

  const submitProject = async (submissionData: Omit<Submission, 'id' | 'submittedAt'>) => {
    const newSubmission: Submission = {
      ...submissionData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SUBMISSION', payload: newSubmission });
  };

  const scoreSubmission = async (submissionId: string, score: { judgeId: string; judgeName: string; innovation: number; technical: number; presentation: number; impact: number; feedback: string; }) => {
    dispatch({ type: 'UPDATE_SUBMISSION_SCORE', payload: { submissionId, score } });
  };

  const fetchMyEvents = async () => {
    // Simulate fetching user's events
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const fetchSubmissions = async (eventId?: string) => {
    // Simulate fetching submissions
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const value: EventContextType = {
    ...state,
    fetchEvents,
    createEvent,
    registerForEvent,
    createTeam,
    submitProject,
    scoreSubmission,
    fetchMyEvents,
    fetchSubmissions,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
