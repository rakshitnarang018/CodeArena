"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Calendar, Star, Eye, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Announcement {
  _id: string;
  eventId: number;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  eventName?: string;
}

export default function ParticipantAnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [importantAnnouncements, setImportantAnnouncements] = useState<
    Announcement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    fetchAnnouncements();
    fetchImportantAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Use the new endpoint to get all announcements for participant's enrolled events
      const response = await apiRequest<{ data: Announcement[] }>(
        "/announcements/my-all"
      );
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const fetchImportantAnnouncements = async () => {
    try {
      const response = await apiRequest<{ data: Announcement[] }>(
        "/announcements/my-important"
      );
      setImportantAnnouncements(response.data || []);
    } catch (error) {
      console.error("Error fetching important announcements:", error);
      toast.error("Failed to fetch important announcements");
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || announcement.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 font-medium";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 font-medium";
      case "low":
        return "bg-green-100 text-green-800 border-green-200 font-medium";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 font-medium";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Card Skeleton */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="h-6 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Important Announcements Skeleton */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <div className="h-6 bg-orange-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-orange-100 rounded w-64 animate-pulse"></div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-white to-orange-25 p-6 rounded-xl border border-orange-200 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regular Announcements Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="border-0 shadow-lg border-l-4 border-l-gray-200"
            >
              <CardContent className="p-8">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6 animate-pulse"></div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest announcements from your events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Megaphone className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Megaphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">
                  Total Announcements
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredAnnouncements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Star className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-destructive">Important</p>
                <p className="text-2xl font-bold text-foreground">
                  {importantAnnouncements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Eye className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-foreground">
                  Recent Updates
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {
                    filteredAnnouncements.filter(
                      (a) =>
                        new Date(a.createdAt) >
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg mb-8 bg-card border-border">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5" />
            Search & Filter Announcements
          </CardTitle>
          <CardDescription>
            Find specific announcements from your enrolled events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input focus:ring-ring"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-input">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Important Announcements Section */}
      {importantAnnouncements.length > 0 && (
        <Card className="shadow-xl mb-8 overflow-hidden bg-card ">
          <div className=" p-1">
            <div className=" rounded-sm">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Star className="h-5 w-5 fill-current" />
                  Important Announcements
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  High priority updates that require your attention
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {importantAnnouncements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="group bg-card p-6 rounded-xl border border-destructive/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-xl text-foreground group-hover:text-destructive transition-colors">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-destructive fill-current animate-pulse" />
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-bold px-3 py-1">
                          {announcement.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                      {announcement.message}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-primary font-medium">
                        <Calendar className="h-4 w-4" />
                        {announcement.eventName}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {formatDistanceToNow(new Date(announcement.createdAt))}{" "}
                        ago
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>
          </div>
        </Card>
      )}

      {/* All Announcements */}
      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <Card className="shadow-lg bg-card border-border">
            <CardContent className="text-center py-16">
              <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Megaphone className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                No announcements found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm || priorityFilter !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "There are no announcements available at the moment. Check back later for updates!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Megaphone className="h-6 w-6 text-primary" />
                </div>
                All Announcements
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {filteredAnnouncements.length}
                </Badge>
              </h2>
            </div>

            <div className="grid gap-6">
              {filteredAnnouncements.map((announcement) => {
                const priorityStyles = {
                  high: "border-l-destructive bg-destructive/5 hover:bg-destructive/10",
                  medium: "border-l-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10",
                  low: "border-l-green-500 bg-green-500/5 hover:bg-green-500/10",
                };

                return (
                  <Card
                    key={announcement._id}
                    className={`shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-l-4 bg-card border-border ${
                      priorityStyles[announcement.priority]
                    }`}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-xl text-foreground hover:text-primary transition-colors cursor-pointer">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          {announcement.isImportant && (
                            <div className="bg-destructive/10 rounded-full p-1">
                              <Star className="h-4 w-4 text-destructive fill-current animate-pulse" />
                            </div>
                          )}
                          <Badge
                            className={`${getPriorityColor(
                              announcement.priority
                            )} px-3 py-1 text-xs font-bold tracking-wide`}
                          >
                            {announcement.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed text-lg font-medium">
                        {announcement.message}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-semibold text-primary">
                            {announcement.eventName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="font-medium">
                            {formatDistanceToNow(
                              new Date(announcement.createdAt)
                            )}{" "}
                            ago
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
