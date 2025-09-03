import { useState, useEffect, useCallback, useRef } from "react";
import { apiRequest } from "@/lib/api";

export interface Enrollment {
  EnrollmentID: number;
  EventID: number;
  UserID: number;
  userid?: number;
  EnrollmentDate: string;
  Status: "Enrolled" | "Cancelled" | "Waitlisted" | "Pending";
  TeamID?: number;

  name?: string;
  email?: string;

  UserName?: string;
  UserEmail?: string;
  UserRole?: string;

  EventName?: string;
  EventStartDate?: string;
  EventEndDate?: string;

  TeamName?: string;
}

export interface EnrollmentStats {
  totalEnrollments: number;
  enrolledCount: number;
  cancelledCount: number;
  pendingCount: number;
  waitlistCount: number;
  eventBreakdown: Array<{
    EventID: number;
    EventName: string;
    enrollmentCount: number;
  }>;
}

export interface EventEnrollment {
  EventID: number;
  enrollments: Enrollment[];
  stats: {
    total: number;
    enrolled: number;
    cancelled: number;
    waitlisted: number;
  };
}

export const useEnrollments = (eventIds: number[]) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevEventIdsRef = useRef<number[]>([]);
  const isInitialMount = useRef(true);

  const fetchEnrollments = useCallback(async () => {
    if (eventIds.length === 0) return;

    console.log("🚀 fetchEnrollments called with eventIds:", eventIds);
    setLoading(true);
    setError(null);

    try {
      const allEnrollments: Enrollment[] = [];
      const statsData: EnrollmentStats = {
        totalEnrollments: 0,
        enrolledCount: 0,
        cancelledCount: 0,
        pendingCount: 0,
        waitlistCount: 0,
        eventBreakdown: [],
      };

      const enrollmentPromises = eventIds.map(async (eventId) => {
        try {
          const response = await apiRequest<{
            success: boolean;
            message: string;
            data: Enrollment[];
            pagination?: any;
          }>(`/events/${eventId}/enrollments`, { method: "GET" });

          const eventEnrollments = response?.data || [];

          console.log(
            `📋 Enrollments for event ${eventId}:`,
            eventEnrollments.length,
            "items"
          );
          return { eventId, enrollments: eventEnrollments };
        } catch (error) {
          console.error(
            `Error fetching enrollments for event ${eventId}:`,
            error
          );
          return { eventId, enrollments: [] };
        }
      });

      const results = await Promise.all(enrollmentPromises);

      results.forEach(({ eventId, enrollments: eventEnrollments }) => {
        allEnrollments.push(...eventEnrollments);

        const enrolledCount = eventEnrollments.filter(
          (e: Enrollment) => e.Status === "Enrolled"
        ).length;
        const eventName = eventEnrollments[0]?.EventName || `Event ${eventId}`;

        statsData.eventBreakdown.push({
          EventID: eventId,
          EventName: eventName,
          enrollmentCount: enrolledCount,
        });
      });

      statsData.totalEnrollments = allEnrollments.length;
      statsData.enrolledCount = allEnrollments.filter(
        (e: Enrollment) => e.Status === "Enrolled"
      ).length;
      statsData.cancelledCount = allEnrollments.filter(
        (e: Enrollment) => e.Status === "Cancelled"
      ).length;
      statsData.pendingCount = allEnrollments.filter(
        (e: Enrollment) => e.Status === "Pending"
      ).length;
      statsData.waitlistCount = allEnrollments.filter(
        (e: Enrollment) => e.Status === "Waitlisted"
      ).length;

      setEnrollments(allEnrollments);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch enrollments"
      );
    } finally {
      setLoading(false);
    }
  }, [eventIds.join(",")]);

  useEffect(() => {
    const eventIdsString = eventIds.join(",");
    const prevEventIdsString = prevEventIdsRef.current.join(",");

    console.log("📊 useEnrollments useEffect:", {
      eventIds,
      eventIdsString,
      prevEventIdsString,
      isInitialMount: isInitialMount.current,
      shouldFetch:
        isInitialMount.current || eventIdsString !== prevEventIdsString,
    });

    if (isInitialMount.current || eventIdsString !== prevEventIdsString) {
      isInitialMount.current = false;
      prevEventIdsRef.current = [...eventIds];

      if (eventIds.length > 0) {
        fetchEnrollments();
      } else {
        setEnrollments([]);
        setStats(null);
        setError(null);
        setLoading(false);
      }
    }
  }, [fetchEnrollments, eventIds]);

  const updateEnrollmentStatus = useCallback(
    async (enrollmentId: number, newStatus: string) => {
      try {
        await apiRequest(`/enrollments/${enrollmentId}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: newStatus }),
          headers: { "Content-Type": "application/json" },
        });

        await fetchEnrollments();
      } catch (error) {
        console.error("Error updating enrollment status:", error);
        throw error;
      }
    },
    [fetchEnrollments]
  );

  const bulkUpdateEnrollments = useCallback(
    async (enrollmentIds: number[], newStatus: string) => {
      try {
        await apiRequest("/enrollments/bulk-update", {
          method: "PUT",
          body: JSON.stringify({ enrollmentIds, status: newStatus }),
          headers: { "Content-Type": "application/json" },
        });

        await fetchEnrollments();
      } catch (error) {
        console.error("Error bulk updating enrollments:", error);
        throw error;
      }
    },
    [fetchEnrollments]
  );

  const deleteEnrollment = useCallback(
    async (enrollmentId: number) => {
      try {
        await apiRequest(`/enrollments/${enrollmentId}`, {
          method: "DELETE",
        });

        await fetchEnrollments();
      } catch (error) {
        console.error("Error deleting enrollment:", error);
        throw error;
      }
    },
    [fetchEnrollments]
  );

  const exportEnrollments = useCallback(
    (format: "csv" | "excel" = "csv") => {
      if (enrollments.length === 0) return;

      const headers = [
        "Enrollment ID",
        "Event Name",
        "User Name",
        "User Email",
        "User Role",
        "Enrollment Date",
        "Status",
        "Team Name",
      ];

      const rows = enrollments.map((enrollment) => [
        enrollment.EnrollmentID,
        enrollment.EventName,
        enrollment.UserName,
        enrollment.UserEmail,
        enrollment.UserRole,
        new Date(enrollment.EnrollmentDate).toLocaleDateString(),
        enrollment.Status,
        enrollment.TeamName || "N/A",
      ]);

      if (format === "csv") {
        const csvContent = [headers, ...rows]
          .map((row) => row.map((cell) => `"${cell}"`).join(","))
          .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `enrollments-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    [enrollments]
  );

  return {
    enrollments,
    stats,
    loading,
    error,
    refetch: fetchEnrollments,
    updateEnrollmentStatus,
    bulkUpdateEnrollments,
    deleteEnrollment,
    exportEnrollments,
  };
};
