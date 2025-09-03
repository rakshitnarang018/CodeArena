'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Trophy, Users, Target, Sparkles, ArrowLeft, Loader2, Plus, Trash2, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface TimelineEntry {
  date: string;
  round: string;
  description: string;
  time: string;
}

interface PrizeEntry {
  position: string;
  amount: string;
  description: string;
}

type EventMode = 'Online' | 'Offline' | '';

interface EventFormData {
  name: string;
  description: string;
  theme: string;
  mode: EventMode;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  resultDate: string;
  rules: string;
  tracks: string;
  maxTeamSize: number;
  sponsors: string;
}

interface EventAPIData {
  [key: string]: unknown;
  name: string;
  description: string;
  theme: string;
  mode: EventMode;
  startDate: string;
  endDate: string;
  submissionDeadline: string | null;
  resultDate: string | null;
  rules: string;
  timeline: string | null;
  tracks: string;
  prizes: string;
  maxTeamSize: number;
  sponsors: string | null;
  isActive: boolean;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    theme: '',
    mode: '',
    startDate: '',
    endDate: '',
    submissionDeadline: '',
    resultDate: '',
    rules: '',
    tracks: '',
    maxTeamSize: 4,
    sponsors: '',
  });

  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([
    {
      date: '',
      round: '',
      description: '',
      time: ''
    }
  ]);

  const [prizeEntries, setPrizeEntries] = useState<PrizeEntry[]>([
    {
      position: '1st Place',
      amount: '',
      description: ''
    }
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  const addTimelineEntry = useCallback((): void => {
    setTimelineEntries(prev => [...prev, {
      date: '',
      round: '',
      description: '',
      time: ''
    }]);
  }, []);

  const removeTimelineEntry = useCallback((index: number): void => {
    setTimelineEntries(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  const updateTimelineEntry = useCallback((index: number, field: keyof TimelineEntry, value: string): void => {
    setTimelineEntries(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const addPrizeEntry = useCallback((): void => {
    setPrizeEntries(prev => [...prev, {
      position: '',
      amount: '',
      description: ''
    }]);
  }, []);

  const removePrizeEntry = useCallback((index: number): void => {
    setPrizeEntries(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  const updatePrizeEntry = useCallback((index: number, field: keyof PrizeEntry, value: string): void => {
    setPrizeEntries(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const handleInputChange = useCallback((field: keyof EventFormData, value: string | number): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Event name is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error('Event description is required');
      return false;
    }
    
    if (!formData.mode) {
      toast.error('Please select an event mode');
      return false;
    }
    
    if (!formData.startDate || !formData.endDate) {
      toast.error('Start and end dates are required');
      return false;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return false;
    }
    
    if (formData.submissionDeadline && new Date(formData.submissionDeadline) > new Date(formData.endDate)) {
      toast.error('Submission deadline must be before or on the end date');
      return false;
    }
    
    if (!formData.theme.trim()) {
      toast.error('Event theme is required');
      return false;
    }
    
    if (!formData.tracks.trim()) {
      toast.error('Competition tracks are required');
      return false;
    }
    
    if (prizeEntries.length === 0 || !prizeEntries.some(prize => prize.position && prize.amount)) {
      toast.error('At least one prize entry is required');
      return false;
    }
    
    if (!formData.rules.trim()) {
      toast.error('Rules and guidelines are required');
      return false;
    }

    return true;
  };

  // Memoized computed values for better performance
  const validTimelineEntries = useMemo(() => 
    timelineEntries.filter(entry => 
      entry.date || entry.round || entry.description || entry.time
    ), [timelineEntries]
  );

  const validPrizeEntries = useMemo(() => 
    prizeEntries.filter(prize => prize.position && prize.amount), 
    [prizeEntries]
  );

  const timelineJson = useMemo(() => 
    validTimelineEntries.length > 0 ? JSON.stringify(validTimelineEntries) : null,
    [validTimelineEntries]
  );

  const prizesString = useMemo(() => 
    validPrizeEntries.map(prize => {
      const description = prize.description ? ` + ${prize.description}` : '';
      return `${prize.position}: $${prize.amount}${description}`;
    }).join(', '),
    [validPrizeEntries]
  );

  // Helper function to convert datetime-local to ISO string
  const formatDateTimeToISO = useCallback((dateTimeLocal: string): string => {
    if (!dateTimeLocal) return '';
    // datetime-local format: YYYY-MM-DDTHH:mm
    // Convert to ISO string format expected by backend
    return new Date(dateTimeLocal).toISOString();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Validate user authentication and role
    if (!user?.id) {
      toast.error('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    if (user.role !== 'organizer') {
      toast.error('Only organizers can create events.');
      setLoading(false);
      return;
    }
    
    try {
      const eventData: EventAPIData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        theme: formData.theme.trim(),
        mode: formData.mode,
        startDate: formatDateTimeToISO(formData.startDate),
        endDate: formatDateTimeToISO(formData.endDate),
        submissionDeadline: formData.submissionDeadline ? formatDateTimeToISO(formData.submissionDeadline) : null,
        resultDate: formData.resultDate ? formatDateTimeToISO(formData.resultDate) : null,
        rules: formData.rules.trim(),
        timeline: timelineJson,
        tracks: formData.tracks.trim(),
        prizes: prizesString,
        maxTeamSize: formData.maxTeamSize,
        sponsors: formData.sponsors.trim() || null,
        isActive: true
      };

      console.log(eventData)

      // Create the event using the API
      await eventsAPI.create(eventData);
      
      toast.success('Event created successfully!');
      
      // Redirect to the events list or the created event details
      router.push('/dashboard/events');
      
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, timelineJson, prizesString, validateForm, router, formatDateTimeToISO, user]);

  const handleNumberInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value) || 4;
    const clampedValue = Math.max(1, Math.min(10, value));
    handleInputChange('maxTeamSize', clampedValue);
  }, [handleInputChange]);

  const handleGoBack = useCallback((): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/dashboard/events');
    }
  }, [router]);

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect non-organizers
  if (user && user.role !== 'organizer') {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-6">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h2>
              <p className="text-muted-foreground">
                Only organizers can create events. Please contact an administrator if you need organizer access.
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div >
            <Link 
              href="/dashboard/events" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-200 mb-6 hover:gap-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-lg slide-in-right">
            <CardHeader className="space-y-4 pb-8 border-b border-border/50">
              <CardTitle className="text-3xl font-bold flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center ring-2 ring-primary/10">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                Event Details
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                Fill in the information below to create your event. All required fields are marked with an asterisk (*)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-10 p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Basic Information Section */}
                <div className="space-y-6 bounce-in">
                  <div className="border-l-4 border-primary/60 pl-6 bg-primary/5 rounded-r-lg py-3">
                    <h3 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      </div>
                      Basic Information
                    </h3>
                    <p className="text-muted-foreground">Essential details about your event</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Event Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Tech Innovation Hackathon 2025"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="theme" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Theme *
                      </Label>
                      <Input
                        id="theme"
                        type="text"
                        placeholder="e.g., AI & Machine Learning"
                        value={formData.theme}
                        onChange={(e) => handleInputChange('theme', e.target.value)}
                        required
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your event is about, its goals, and what participants can expect..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      rows={4}
                      className="bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 resize-none rounded-lg"
                    />
                  </div>
                </div>

                {/* Event Configuration Section */}
                <div className="space-y-6 slide-in-left">
                  <div className="border-l-4 border-primary/60 pl-6 bg-primary/5 rounded-r-lg py-3">
                    <h3 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      </div>
                      Event Configuration
                    </h3>
                    <p className="text-muted-foreground">Set up event parameters and logistics</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="mode" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        Event Mode *
                      </Label>
                      <Select value={formData.mode} onValueChange={(value: EventMode) => handleInputChange('mode', value)}>
                        <SelectTrigger className="h-12 bg-background/50 border-border focus:border-secondary focus:ring-ring rounded-lg">
                          <SelectValue placeholder="Select event mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Online">🌐 Online</SelectItem>
                          <SelectItem value="Offline">🏢 Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="maxTeamSize" className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-4 w-4 text-secondary" />
                        Max Team Size *
                      </Label>
                      <Input
                        id="maxTeamSize"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="4"
                        value={formData.maxTeamSize}
                        onChange={handleNumberInputChange}
                        required
                        className="h-12 bg-background/50 border-border focus:border-secondary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Important Dates Section */}
                <div className="space-y-6 fade-in">
                  <div className="border-l-4 border-primary/60 pl-6 bg-primary/5 rounded-r-lg py-3">
                    <h3 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <CalendarDays className="h-4 w-4 text-primary " />
                      </div>
                      Important Dates
                    </h3>
                    <p className="text-muted-foreground mt-2">Set key dates and deadlines for your event</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                        Start Date & Time *
                      </Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium text-foreground">
                        End Date & Time *
                      </Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        required
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="submissionDeadline" className="text-sm font-medium text-foreground">
                        Submission Deadline *
                      </Label>
                      <Input
                        id="submissionDeadline"
                        type="datetime-local"
                        value={formData.submissionDeadline}
                        onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
                        required
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resultDate" className="text-sm font-medium text-foreground">
                        Result Announcement Date
                      </Label>
                      <Input
                        id="resultDate"
                        type="datetime-local"
                        value={formData.resultDate}
                        onChange={(e) => handleInputChange('resultDate', e.target.value)}
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Competition Details Section */}
                <div className="space-y-6">
                  <div className="border-l-4 border-primary/60 pl-6 bg-primary/5 rounded-r-lg py-3">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                      <Target className="h-5 w-5 text-primary-500" />
                      Competition Details
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Define tracks and competition parameters</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="tracks" className="text-sm font-medium text-foreground">
                        Competition Tracks *
                      </Label>
                      <Textarea
                        id="tracks"
                        placeholder="e.g., Web Development, Mobile Apps, AI/ML, Blockchain, IoT (separate with commas)"
                        value={formData.tracks}
                        onChange={(e) => handleInputChange('tracks', e.target.value)}
                        required
                        rows={2}
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground">Separate multiple tracks with commas</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rules" className="text-sm font-medium text-foreground">
                        Rules & Guidelines *
                      </Label>
                      <Textarea
                        id="rules"
                        placeholder="Enter the rules, guidelines, and requirements for participants..."
                        value={formData.rules}
                        onChange={(e) => handleInputChange('rules', e.target.value)}
                        required
                        rows={4}
                        className="h-12 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Prizes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Prizes & Rewards
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Define attractive rewards to motivate participants
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={addPrizeEntry}
                      className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Prize
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {prizeEntries.map((prize, index) => (
                      <Card key={index} className="border-2 hover:shadow-md transition-all duration-200">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <Trophy className="h-4 w-4 text-amber-600" />
                              </div>
                              <span className="font-medium text-foreground">Prize #{index + 1}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePrizeEntry(index)}
                              disabled={prizeEntries.length === 1}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-amber-600" />
                                Prize Position *
                              </Label>
                              <Select
                                value={prize.position}
                                onValueChange={(value) => updatePrizeEntry(index, 'position', value)}
                              >
                                <SelectTrigger className="h-12 bg-primary border-primary ">
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1st Place">🥇 1st Place</SelectItem>
                                  <SelectItem value="2nd Place">🥈 2nd Place</SelectItem>
                                  <SelectItem value="3rd Place">🥉 3rd Place</SelectItem>
                                  <SelectItem value="4th Place">🏅 4th Place</SelectItem>
                                  <SelectItem value="5th Place">🎖️ 5th Place</SelectItem>
                                  <SelectItem value="Best Innovation">🌟 Best Innovation</SelectItem>
                                  <SelectItem value="Best Design">🎨 Best Design</SelectItem>
                                  <SelectItem value="Best Technical">⚙️ Best Technical</SelectItem>
                                  <SelectItem value="People's Choice">❤️ People's Choice</SelectItem>
                                  <SelectItem value="Special Recognition">⭐ Special Recognition</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                Prize Amount ($) *
                              </Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">$</span>
                                <Input
                                  type="number"
                                  placeholder="5000"
                                  value={prize.amount}
                                  onChange={(e) => updatePrizeEntry(index, 'amount', e.target.value)}
                                  className="h-12 bg-background/50 border-border focus:border-primary pl-8 focus:ring-ring transition-all duration-200 rounded-lg"
                                  min="0"
                                  step="100"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                              Additional Benefits (Optional)
                            </Label>
                            <Input
                              placeholder="e.g., Internship opportunity, Mentorship sessions, Course access, Certification"
                              value={prize.description}
                              onChange={(e) => updatePrizeEntry(index, 'description', e.target.value)}
                              className="bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {prizeEntries.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-amber-200 rounded-lg bg-amber-50/30">
                      <Trophy className="h-12 w-12 text-amber-400 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No prizes added yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Click "Add Prize" to create your first reward</p>
                    </div>
                  )}
                </div>

                {/* Event Timeline Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-l-4 border-primary/60 bg-primary/5 rounded-r-lg p-3">
                    <div className=" pl-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Event Timeline
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Define key phases and deadlines for your event</p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={addTimelineEntry}
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>
                    
                  <div className="space-y-4">
                    {timelineEntries.map((entry, index) => (
                      <Card key={index} className="border-2 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-foreground">Timeline #{index + 1}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimelineEntry(index)}
                              disabled={timelineEntries.length === 1}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-blue-600" />
                                Date
                              </Label>
                              <Input
                                type="date"
                                value={entry.date}
                                onChange={(e) => updateTimelineEntry(index, 'date', e.target.value)}
                                className="h-11 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Round/Phase</Label>
                              <Input
                                placeholder="e.g., Round 1: Idea Submission"
                                value={entry.round}
                                onChange={(e) => updateTimelineEntry(index, 'round', e.target.value)}
                                className="h-11 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Time</Label>
                              <Input
                                placeholder="e.g., 09:00 AM - 11:59 PM"
                                value={entry.time}
                                onChange={(e) => updateTimelineEntry(index, 'time', e.target.value)}
                                className="h-11 bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm font-medium text-foreground">Description</Label>
                            <Textarea
                              placeholder="Describe what happens in this phase..."
                              value={entry.description}
                              onChange={(e) => updateTimelineEntry(index, 'description', e.target.value)}
                              rows={2}
                              className="bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 rounded-lg"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {timelineEntries.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/30">
                      <Clock className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No timeline entries added yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Click "Add Entry" to create your first timeline phase</p>
                    </div>
                  )}
                </div>

                {/* Sponsors Section */}
                <div className="space-y-6 slide-in-right">
                  <div className="border-l-4 border-primary/60 pl-6 bg-primary/5 rounded-r-lg py-3">
                    <h3 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                      </div>
                      Sponsors & Partners
                    </h3>
                    <p className="text-muted-foreground">List your event sponsors and partners (optional)</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="sponsors" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                      Sponsor Information
                    </Label>
                    <Textarea
                      id="sponsors"
                      placeholder="List your event sponsors and partners..."
                      value={formData.sponsors}
                      onChange={(e) => handleInputChange('sponsors', e.target.value)}
                      rows={3}
                      className="bg-background/50 border-border focus:border-primary focus:ring-ring transition-all duration-200 resize-none rounded-lg"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-8 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 bg-muted hover:bg-muted/80 border-border hover:border-border font-medium rounded-lg transition-all duration-200"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Create Event
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-10 text-center fade-in">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <p className="text-muted-foreground leading-relaxed">
                Need help? Check out our{' '}
                <Link href="/help" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 underline decoration-primary/50">
                  event creation guide
                </Link>{' '}
                or{' '}
                <Link href="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 underline decoration-primary/50">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}