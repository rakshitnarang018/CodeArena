'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { 
  Download, 
  FileText, 
  Users, 
  Award,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  Trophy,
  Star
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import CertificateTemplate from './certificate-template';
import TemplatesSelector from './templates-selector';

interface Event {
  EventID: number;
  Name: string;
  Description: string;
  StartDate: string;
  EndDate: string;
}

interface Submission {
  _id: string;
  title: string;
  teamName: string;
  teamId: string;
  eventId: number;
  eventName: string;
  isWinner: boolean;
  prize: string;
  totalScore: number;
  judgingStatus: string;
  submittedAt: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
}

const CERTIFICATE_TEMPLATES = [
  'template1', 'template2', 'template3', 'template4', 'template5',
  'template6', 'template7', 'template8', 'template9', 'template10', 'template11'
];

export default function CertificateGenerator() {
  const { user } = useAuth();
  const componentRef = useRef<HTMLDivElement>(null);
  
  // State for form data
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [heading, setHeading] = useState('Certificate of Achievement');
  const [description, setDescription] = useState('for outstanding participation and contribution to the event');
  const [authorName, setAuthorName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  // State for automation
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  // State for single certificate
  const [recipientName, setRecipientName] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('single');

  useEffect(() => {
    fetchEvents();
    fetchSubmissions(); // Fetch all submissions on mount
    setAuthorName(user?.name || '');
  }, [user]);

  useEffect(() => {
    if (selectedEvent) {
      fetchSubmissions();
      fetchParticipants();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events for certificate generator...');
      const response = await apiRequest<{ data: Event[] }>('/events');
      console.log('Events response:', response);
      setEvents(response.data || []);
      if (response.data && response.data.length > 0) {
        console.log('Successfully loaded', response.data.length, 'events');
      } else {
        console.log('No events found');
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    }
  };

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching submissions for event:', selectedEvent);
      const response = await apiRequest<{ data: Submission[] }>('/submissions');
      console.log('Submissions response:', response);
      
      if (selectedEvent) {
        const eventSubmissions =
          response.data?.filter(
            (sub) => {
              console.log(`Comparing submission eventId ${sub.eventId} with selected ${selectedEvent}`);
              return sub.eventId?.toString() === selectedEvent && sub.isWinner;
            }
          ) || [];
        console.log('Filtered submissions for event:', eventSubmissions);
        setSubmissions(eventSubmissions);
      } else {
        // Show all winners if no event is selected
        const allWinners = response.data?.filter(sub => sub.isWinner) || [];
        console.log('All winners:', allWinners);
        setSubmissions(allWinners);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      toast.error('Failed to load submissions');
    }
  };

  const fetchParticipants = async () => {
    try {
      // This would ideally come from an enrollments endpoint
      // For now, we'll simulate participants data
      setParticipants([]);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Certificate_${recipientName || 'Generated'}_${new Date().toISOString().split('T')[0]}`,
  });

  const generateBulkCertificates = async () => {
    if (selectedWinners.length === 0 && selectedParticipants.length === 0) {
      toast.error('Please select recipients for certificates');
      return;
    }

    setLoading(true);
    try {
      // Generate certificates for selected winners
      for (const submissionId of selectedWinners) {
        const submission = submissions.find(s => s._id === submissionId);
        if (submission) {
          // Here you would typically call an API to generate and save the certificate
          console.log('Generating certificate for winner:', submission.teamName);
        }
      }

      // Generate certificates for selected participants
      for (const participantId of selectedParticipants) {
        const participant = participants.find(p => p.id === participantId);
        if (participant) {
          console.log('Generating certificate for participant:', participant.name);
        }
      }

      toast.success(`Generated ${selectedWinners.length + selectedParticipants.length} certificates successfully!`);
    } catch (error) {
      console.error('Failed to generate bulk certificates:', error);
      toast.error('Failed to generate certificates');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalWinners = submissions.length;
    const totalParticipants = participants.length;
    const selectedCount = selectedWinners.length + selectedParticipants.length;
    
    return { totalWinners, totalParticipants, selectedCount };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Certificate Generator</h1>
          <p className="text-muted-foreground mt-1">
            Generate certificates for winners and participants
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card key="winners">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Winners</p>
                <p className="text-2xl font-bold">{stats.totalWinners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="participants">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">{stats.totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="selected">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Selected</p>
                <p className="text-2xl font-bold">{stats.selectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="events">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Events Loaded</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Template Configuration and Generation Options - Flex Row Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div>
            <TemplatesSelector 
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </div>

          {/* Certificate Configuration */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificate Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Certificate Content */}
                <div className="space-y-2">
                  <Label htmlFor="heading">Certificate Heading</Label>
                  <Input
                    id="heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="Certificate of Achievement"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="for outstanding participation..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Authorized By</Label>
                  <Input
                    id="author"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Organizer Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL (Optional)</Label>
                  <Input
                    id="logo"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generation Options */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Generation Options</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Single</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient Name</Label>
                      <Input
                        id="recipient"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Enter recipient name"
                      />
                    </div>
                    <Button onClick={handlePrint} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Certificate
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="bulk" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="event">Select Event ({events.length} available)</Label>
                      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Choose from ${events.length} events`} />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((event) => (
                            <SelectItem key={event.EventID} value={event.EventID.toString()}>
                              {event.Name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedEvent && (
                      <Button 
                        onClick={generateBulkCertificates} 
                        className="w-full"
                        disabled={loading || stats.selectedCount === 0}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {loading ? 'Generating...' : `Generate ${stats.selectedCount} Certificates`}
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certificate Preview - Below the configuration row */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Certificate Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50">
              <CertificateTemplate
                ref={componentRef}
                template={selectedTemplate}
                name={recipientName || 'Recipient Name'}
                heading={heading}
                description={description}
                author={authorName}
                logo={logoUrl}
              />
            </div>
          </CardContent>
        </Card>

        {/* Winners and Participants Selection for Bulk Generation */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            {/* Debug info */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Debug: Found {submissions.length} winners total. Selected event: {selectedEvent || 'None'}
                </p>
              </CardContent>
            </Card>

            {/* Winners */}
            {submissions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Winners ({submissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {submissions.map((submission) => (
                      <div
                        key={submission._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedWinners.includes(submission._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWinners([...selectedWinners, submission._id]);
                              } else {
                                setSelectedWinners(selectedWinners.filter(id => id !== submission._id));
                              }
                            }}
                            className="rounded"
                          />
                          <div>
                            <p className="font-medium">{submission.teamName}</p>
                            <p className="text-sm text-muted-foreground">{submission.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            {submission.prize || 'Winner'}
                          </Badge>
                          {submission.totalScore && (
                            <Badge variant="outline">
                              Score: {submission.totalScore}/50
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participants */}
            {participants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Participants ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(participant.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedParticipants([...selectedParticipants, participant.id]);
                              } else {
                                setSelectedParticipants(selectedParticipants.filter(id => id !== participant.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">{participant.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">Participant</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {submissions.length === 0 && participants.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No recipients found</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent 
                      ? `No winners or participants found for the selected event (ID: ${selectedEvent}).`
                      : 'Please select an event to see winners and participants.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
