"use client";

import {
  CalendarDays,
  Clock,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactElement } from "react";
import { Event } from "./types";

interface EventTimelineProps {
  event: Event;
  formatDateTime: (dateString: string) => string;
  formatList: (text: string) => ReactElement[];
}

export const EventTimeline = ({
  event,
  formatDateTime,
  formatList,
}: EventTimelineProps) => {
  const parseCustomTimeline = () => {
    try {
      if (event.Timeline && event.Timeline.trim().startsWith("[")) {
        return JSON.parse(event.Timeline);
      }
      return null;
    } catch {
      return null;
    }
  };

  const customTimeline = parseCustomTimeline();

  const formatTimelineDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  const getPhaseColors = (index: number) => {
    // Use consistent primary color scheme for all phases
    return {
      dateBg: "bg-primary/10 dark:bg-primary/20",
      dateBorder: "border-primary/30",
      dateText: "text-primary",
      dateSubText: "text-primary/70",
      connector: "bg-primary",
      line: "bg-primary/30",
      cardBg: "bg-primary/5 dark:bg-primary/10",
      cardBorder: "border-primary/20",
    };
  };

  if (customTimeline && Array.isArray(customTimeline)) {
    return (
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            Event Timeline
          </CardTitle>
          <CardDescription>
            Follow the complete journey of the event from start to finish
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {customTimeline.map((item: { title?: string; description?: string; date: string; time?: string; round?: string }, index: number) => {
              const dateInfo = formatTimelineDate(item.date);
              return (
                <div key={index} className="flex gap-4">
                  {/* Date Card */}
                  <div className="flex-shrink-0">
                    <div
                      className={`${getPhaseColors(index).dateBg} border ${
                        getPhaseColors(index).dateBorder
                      } rounded-lg p-3 text-center min-w-[60px] shadow-sm`}
                    >
                      <div
                        className={`text-xl font-bold ${
                          getPhaseColors(index).dateText
                        }`}
                      >
                        {dateInfo.day}
                      </div>
                      <div
                        className={`text-xs ${
                          getPhaseColors(index).dateSubText
                        } uppercase tracking-wide`}
                      >
                        {dateInfo.month}
                      </div>
                    </div>
                  </div>

                  {/* Timeline connector */}
                  <div className="flex flex-col items-center pt-2">
                    <div
                      className={`w-3 h-3 ${
                        getPhaseColors(index).connector
                      } rounded-full shadow-sm`}
                    ></div>
                    {index < customTimeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          getPhaseColors(index).line
                        } mt-2`}
                      ></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`${getPhaseColors(index).cardBg} border ${
                        getPhaseColors(index).cardBorder
                      } rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                    >
                      <h3
                        className={`font-semibold ${
                          getPhaseColors(index).dateText
                        } mb-2`}
                      >
                        {item.round || `Phase ${index + 1}`}
                      </h3>
                      <p
                        className={`text-sm ${
                          getPhaseColors(index).dateSubText
                        } mb-3`}
                      >
                        {item.description || "Event phase description"}
                      </p>

                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center gap-2 text-xs ${
                            getPhaseColors(index).dateSubText
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            Start: {item.time?.split(" - ")[0] || "TBD"}
                          </span>
                        </div>
                        {item.time?.includes(" - ") && (
                          <div
                            className={`flex items-center gap-2 text-xs ${
                              getPhaseColors(index).dateSubText
                            }`}
                          >
                            <span>End: {item.time.split(" - ")[1]}</span>
                          </div>
                        )}
                      </div>

                      {/* Additional info buttons with matching colors */}
                      <div className="flex gap-2 mt-3">
                        <button
                          className={`px-3 py-1 text-xs ${
                            getPhaseColors(index).dateBg
                          } ${
                            getPhaseColors(index).dateText
                          } rounded-full border ${
                            getPhaseColors(index).dateBorder
                          } hover:scale-105 transition-all duration-200 font-medium`}
                        >
                          Details
                        </button>
                        <button
                          className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground rounded-full border border-border hover:scale-105 transition-all duration-200 font-medium"
                        >
                          FAQs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          Event Timeline
        </CardTitle>
        <CardDescription>
          Follow the complete journey of the event from start to finish
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Registration Phase */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-3 text-center min-w-[60px] shadow-sm">
                <div className="text-xl font-bold text-primary">
                  {new Date(event.StartDate).getDate() - 1}
                </div>
                <div className="text-xs text-primary/70 uppercase tracking-wide">
                  {new Date(event.StartDate).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center pt-2">
              <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
              <div className="w-0.5 h-16 bg-primary/30 mt-2"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="font-semibold text-primary mb-2">
                  Registration Opens
                </h3>
                <p className="text-sm text-primary/70 mb-3">
                  Teams can register and submit their initial details for the
                  event
                </p>
                <div className="flex items-center gap-2 text-xs text-primary/70">
                  <Clock className="h-3 w-3" />
                  <span>Before event starts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Start */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-3 text-center min-w-[60px] shadow-sm">
                <div className="text-xl font-bold text-primary">
                  {new Date(event.StartDate).getDate()}
                </div>
                <div className="text-xs text-primary/70 uppercase tracking-wide">
                  {new Date(event.StartDate).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center pt-2">
              <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
              <div className="w-0.5 h-16 bg-primary/30 mt-2"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="font-semibold text-primary mb-2">
                  Event Begins
                </h3>
                <p className="text-sm text-primary/70 mb-3">
                  Opening ceremony and project development phase starts
                </p>
                <div className="flex items-center gap-2 text-xs text-primary/70">
                  <Clock className="h-3 w-3" />
                  <span>{formatDateTime(event.StartDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Deadline */}
          {event.SubmissionDeadline && (
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-3 text-center min-w-[60px] shadow-sm">
                  <div className="text-xl font-bold text-primary">
                    {new Date(event.SubmissionDeadline).getDate()}
                  </div>
                  <div className="text-xs text-primary/70 uppercase tracking-wide">
                    {new Date(event.SubmissionDeadline).toLocaleDateString(
                      "en-US",
                      { month: "short" }
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center pt-2">
                <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
                <div className="w-0.5 h-16 bg-primary/30 mt-2"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-primary mb-2">
                    Submission Deadline
                  </h3>
                  <p className="text-sm text-primary/70 mb-3">
                    Final submissions must be completed by this time
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary/70">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(event.SubmissionDeadline)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {event.ResultDate && (
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-3 text-center min-w-[60px] shadow-sm">
                  <div className="text-xl font-bold text-primary">
                    {new Date(event.ResultDate).getDate()}
                  </div>
                  <div className="text-xs text-primary/70 uppercase tracking-wide">
                    {new Date(event.ResultDate).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center pt-2">
                <div className="w-3 h-3 bg-primary rounded-full shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-primary mb-2">
                    Results Announcement
                  </h3>
                  <p className="text-sm text-primary/70 mb-3">
                    Winners announced and awards ceremony
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary/70">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(event.ResultDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show text timeline if available and not JSON */}
        {event.Timeline &&
          event.Timeline.trim() &&
          !event.Timeline.trim().startsWith("[") && (
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                Additional Timeline Details
              </h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="prose prose-sm max-w-none">
                  {formatList(event.Timeline)}
                </div>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
};
