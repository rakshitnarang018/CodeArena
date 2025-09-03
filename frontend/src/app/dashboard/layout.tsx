"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { getSidebarConfig } from "@/lib/sidebar-config";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get role-based sidebar configuration
  const sidebarMenuGroups = getSidebarConfig(user?.role || 'participant');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getCurrentPageTitle = () => {
    const path = pathname.split("/").pop();
    if (pathname === "/dashboard") return "Dashboard";
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
  };

  return (
    <div className="flex h-[92vh] bg-background w-full">
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-card border-r border-border transition-width dashboard-sidebar flex flex-col`}
      >
        {/* Sidebar Header */}
        {/* <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
               CodeArena
              </span>
            )}
          </div>
        </div> */}

        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt="User avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto scroll-container">
          {sidebarMenuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {!sidebarCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors-fast ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant={
                                item.badge === "New"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs px-2 py-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full justify-center"
          >
            {sidebarCollapsed ? "→" : "←"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{getCurrentPageTitle()}</h1>
            <Separator orientation="vertical" className="h-6" />
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="w-64 pl-9 h-9"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header> */}

        {/* Page Content */}
        <main className="flex-1 overflow-auto scroll-container dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
