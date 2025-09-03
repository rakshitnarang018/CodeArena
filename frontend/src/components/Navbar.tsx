"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  Bell,
  MessageCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  Trophy,
  Briefcase,
  Users,
  Target,
  ChevronDown,
  Code2,
  Plus,
  Building2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import ThemeToggleButton from "./ui/theme-toggle-button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const navItems = [
    { href: "/competitions", label: "Competitions", icon: Trophy },
  ];

  const userMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Target },
    { href: "/profile", label: "Profile", icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-background border-b border-border z-[999] transition-all duration-[400ms] max-w-[1600px] mx-auto">
      <nav
        aria-label="Main Navigation"
        className="flex justify-between items-center w-full h-full px-16"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="CodeArena Logo"
          >
            <div className="h-8 w-30 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                CodeArena
              </span>
            </div>
          </Link>

          <div className="hidden md:block relative z-[9] w-[230px]">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Opportunities"
                className="w-full pl-10 h-9 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="hidden lg:flex items-center gap-6 mr-8" role="menu">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
                aria-label={`Browse ${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <button
                className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
                aria-label="Browse More Categories"
                >
                More
                <ChevronDown className="h-4 w-4" />
                </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                <Link href="/dashboard/events" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                Events
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
              <Link href="/contact" className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Us
              </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
              <Link href="/about" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              About Us
              </Link>
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center mr-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Host"
            >
              <Plus className="h-4 w-4" />
              Host
            </Button>
          </div>

          

          <div className="flex items-center gap-2">
            <ThemeToggleButton start="top-right" />

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Open chat"
            >
              <MessageCircle className="h-5 w-5 text-foreground hover:text-primary" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-foreground hover:text-primary" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="User menu"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.avatar} alt="User avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex text-foreground hover:text-primary"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden w-10 h-10"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-10 h-10"
              aria-label="For Business"
            >
              <Building2 className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden w-10 h-10"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">
                        C
                      </span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                     CodeArena
                    </span>
                  </Link>

                  <div className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}

                    
                  </div>

                  {!isAuthenticated && (
                    <>
                      <hr className="border-border" />
                      <div className="flex flex-col space-y-3">
                        <Link
                          href="/auth/login"
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="text-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all p-2 rounded-lg text-center"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="md:hidden border-t border-border bg-background p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Opportunities"
              className="w-full pl-10 h-9 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border px-4 py-2">
        <div className="flex justify-center">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-12"
            title="CodeArena Home"
            aria-label="CodeArena Home"
          >
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                S
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
