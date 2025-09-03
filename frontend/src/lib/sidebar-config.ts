import {
  Home,
  Calendar,
  Trophy,
  Users,
  Settings,
  User,
  Bell,
  BookOpen,
  BarChart3,
  MessageSquare,
  FileText,
  Award,
  Target,
  Plus,
  TrendingUp,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Presentation,
  Database,
  Shield,
  Zap,
} from "lucide-react";

export interface SidebarMenuItem {
  icon: any;
  label: string;
  href: string;
  badge?: string;
}

export interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItem[];
}

export const organizerSidebarConfig: SidebarMenuGroup[] = [
  {
    title: "Main",
    items: [
      { icon: Home, label: "Overview", href: "/dashboard" },
      { icon: Calendar, label: "My Events", href: "/dashboard/events" },
      { icon: Plus, label: "Create Event", href: "/dashboard/events/create" },
    ],
  },
  {
    title: "Management",
    items: [
      {
        icon: Users,
        label: "Event Enrollments",
        href: "/dashboard/enrollments",
      },
      { icon: FileText, label: "Submissions", href: "/dashboard/submissions" },
      { icon: MessageSquare, label: "Event Chat", href: "/dashboard/chat" },
      { icon: Trophy, label: "Certificates", href: "/dashboard/certificates" },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        icon: BarChart3,
        label: "Event Analytics",
        href: "#",
      },
      {
        icon: TrendingUp,
        label: "Participant Stats",
        href: "#",
      },
      { icon: Presentation, label: "Reports", href: "#" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", href: "#" },
      { icon: Bell, label: "Announcements", href: "#" },
      { icon: Settings, label: "Settings", href: "#" },
    ],
  },
];

export const participantSidebarConfig: SidebarMenuGroup[] = [
  {
    title: "Main",
    items: [
      { icon: Home, label: "Overview", href: "/dashboard" },
      // { icon: Trophy, label: "Competitions", href: "/competitions" },
      { icon: Calendar, label: "My Events", href: "/dashboard/events" },
      // {
      //   icon: Target,
      //   label: "Challenges",
      //   href: "/dashboard/challenges",
      //   badge: "New",
      // },
    ],
  },
  {
    title: "Community",
    items: [
      { icon: Users, label: "Teams", href: "/dashboard/teams" },
      {
        icon: MessageSquare,
        label: "Messages",
        href: "/dashboard/messages",
        badge: "12",
      },
      { icon: BookOpen, label: "Learning", href: "#" },
      { icon: Award, label: "Achievements", href: "#" },
    ],
  },
  {
    title: "Progress",
    items: [
      { icon: BarChart3, label: "Performance", href: "#" },
      { icon: TrendingUp, label: "Progress", href: "#" },
      {
        icon: FileText,
        label: "My Submissions",
        href: "/dashboard/submissions",
      },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", href: "#" },
      {
        icon: Bell,
        label: "Announcements",
        href: "#",
      },
      { icon: Settings, label: "Settings", href: "#" },
    ],
  },
];

export const judgeSidebarConfig: SidebarMenuGroup[] = [
  {
    title: "Main",
    items: [
      { icon: Home, label: "Overview", href: "/dashboard" },
      {
        icon: ClipboardList,
        label: "Judging Queue",
        href: "/dashboard/judging",
      },
      { icon: FileText, label: "Submissions", href: "/dashboard/submissions" },
    ],
  },
  {
    title: "Evaluation",
    items: [
      {
        icon: UserCheck,
        label: "Score Submissions",
        href: "/dashboard/scoring",
      },
      {
        icon: MessageSquare,
        label: "Judge Comments",
        href: "/dashboard/comments",
      },
      { icon: Award, label: "Results", href: "/dashboard/results" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { icon: BarChart3, label: "Judging Stats", href: "/dashboard/analytics" },
      {
        icon: TrendingUp,
        label: "Performance",
        href: "/dashboard/performance",
      },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", href: "/dashboard/profile" },
      { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ],
  },
];

export const getSidebarConfig = (userRole: string): SidebarMenuGroup[] => {
  switch (userRole) {
    case "organizer":
      return organizerSidebarConfig;
    case "judge":
      return judgeSidebarConfig;
    case "participant":
    default:
      return participantSidebarConfig;
  }
};
