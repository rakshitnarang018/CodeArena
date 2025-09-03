"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAnnouncements } from "@/lib/mockData";
import {
  Bell,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "warning" | "success" | "announcement";
  eventId?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  readStatus?: boolean;
}

const AnnouncementWidget = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all");
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const enhancedAnnouncements = mockAnnouncements.map((ann, index) => ({
      ...ann,
      priority: ["urgent", "high", "medium", "low"][
        index % 4
      ] as Announcement["priority"],
      category: [
        "Event Update",
        "System Notice",
        "Competition Alert",
        "General",
      ][index % 4],
      readStatus: Math.random() > 0.5,
    }));
    setAnnouncements(enhancedAnnouncements);
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      switch (filter) {
        case "unread":
          return !ann.readStatus;
        case "urgent":
          return ann.priority === "urgent" || ann.priority === "high";
        default:
          return true;
      }
    });
  }, [announcements, filter]);

  const unreadCount = useMemo(
    () => announcements.filter((ann) => !ann.readStatus).length,
    [announcements]
  );

  const urgentCount = useMemo(
    () => announcements.filter((ann) => ann.priority === "urgent").length,
    [announcements]
  );

  const dismissAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, readStatus: true } : ann))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAnnouncements((prev) =>
      prev.map((ann) => ({ ...ann, readStatus: true }))
    );
  }, []);

  const getIcon = (
    type: Announcement["type"],
    priority?: Announcement["priority"]
  ) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (priority?: Announcement["priority"]) => {
    switch (priority) {
      case "urgent":
        return <Zap className="h-3 w-3 text-destructive" />;
      case "high":
        return <TrendingUp className="h-3 w-3 text-primary" />;
      case "medium":
        return <Star className="h-3 w-3 text-secondary-foreground" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTypeGradient = (
    type: Announcement["type"],
    priority?: Announcement["priority"]
  ) => {
    const baseClass = priority === "urgent" ? "ring-1 ring-destructive/20" : "";

    switch (type) {
      case "info":
        return `bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border-primary/20 ${baseClass}`;
      case "warning":
        return `bg-gradient-to-br from-yellow-500/8 via-yellow-500/4 to-transparent border-yellow-500/20 ${baseClass}`;
      case "success":
        return `bg-gradient-to-br from-green-500/8 via-green-500/4 to-transparent border-green-500/20 ${baseClass}`;
      case "announcement":
        return `bg-gradient-to-br from-purple-500/8 via-purple-500/4 to-transparent border-purple-500/20 ${baseClass}`;
      default:
        return `bg-gradient-to-br from-muted/40 via-muted/20 to-transparent border-border ${baseClass}`;
    }
  };

  const getTypeColor = (type: Announcement["type"]) => {
    switch (type) {
      case "info":
        return "text-primary";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "success":
        return "text-green-600 dark:text-green-400";
      case "announcement":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-muted-foreground";
    }
  };

  if (announcements.length === 0) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Bell className="h-6 w-6 text-primary-foreground" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
          {urgentCount > 0 && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full" />
          )}
          <Sparkles className="absolute -top-1 -left-1 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card
        className={`w-96 shadow-2xl border border-border/50 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 transition-all duration-300 ease-out ${
          isExpanded ? "h-[32rem]" : "h-auto"
        } hover:shadow-primary/10 hover:shadow-xl`}
      >
        <CardHeader
          className="pb-3 cursor-pointer relative overflow-hidden group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <Bell className="h-5 w-5 text-primary-foreground" />
                </div>
                {urgentCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                    <Zap className="h-2 w-2 text-destructive-foreground" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  Announcements
                  <Sparkles className="h-4 w-4 text-primary" />
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {filteredAnnouncements.length} total
                  </Badge>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-all duration-300"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="flex gap-2 mt-3 relative">
              {["all", "unread", "urgent"].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "ghost"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter(filterType as typeof filter);
                  }}
                  className={`text-xs capitalize transition-all duration-300 ${
                    filter === filterType
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent"
                  }`}
                >
                  {filterType}
                  {filterType === "unread" && unreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 w-4 p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  {filterType === "urgent" && urgentCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-1 h-4 w-4 p-0 text-xs"
                    >
                      {urgentCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 h-80 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2">
              <div className="space-y-3">
                {filteredAnnouncements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No announcements found</p>
                  </div>
                ) : (
                  filteredAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer group ${getTypeGradient(
                        announcement.type,
                        announcement.priority
                      )}`}
                      onClick={() => markAsRead(announcement.id)}
                    >
                      {!announcement.readStatus && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                      )}

                      {announcement.priority === "urgent" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent rounded-xl" />
                      )}

                      <div className="relative">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`p-1.5 rounded-lg ${getTypeColor(
                                announcement.type
                              )}`}
                            >
                              {getIcon(
                                announcement.type,
                                announcement.priority
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                {getPriorityIcon(announcement.priority)}
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-background/50 border-border/50"
                                >
                                  {announcement.category}
                                </Badge>
                                {announcement.priority === "urgent" && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    URGENT
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!announcement.readStatus && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissAnnouncement(announcement.id);
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-foreground leading-tight">
                            {announcement.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {announcement.message}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(announcement.timestamp, {
                              addSuffix: true,
                            })}
                          </span>

                          <div className="flex items-center gap-1">
                            {announcement.priority === "high" && (
                              <TrendingUp className="h-3 w-3 text-primary" />
                            )}
                            {announcement.readStatus ? (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              >
                                Read
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs bg-primary/10 text-primary border-primary/20"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        )}

        {!isExpanded && filteredAnnouncements.length > 0 && (
          <CardContent className="pt-0">
            <div
              className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${getTypeGradient(
                filteredAnnouncements[0].type,
                filteredAnnouncements[0].priority
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div
                    className={`p-1 rounded ${getTypeColor(
                      filteredAnnouncements[0].type
                    )}`}
                  >
                    {getIcon(
                      filteredAnnouncements[0].type,
                      filteredAnnouncements[0].priority
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {filteredAnnouncements[0].title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPriorityIcon(filteredAnnouncements[0].priority)}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          filteredAnnouncements[0].timestamp,
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {!filteredAnnouncements[0].readStatus && (
                  <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                )}
              </div>
            </div>

            {filteredAnnouncements.length > 1 && (
              <div className="mt-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  +{filteredAnnouncements.length - 1} more announcements
                </Button>
              </div>
            )}
          </CardContent>
        )}

        {isExpanded && (
          <div className="absolute bottom-4 left-4">
            <Button
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnnouncementWidget;
