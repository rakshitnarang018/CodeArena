"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import EventCard from "@/components/EventCard";
import AnnouncementWidget from "@/components/AnnouncementWidget";
import { mockEvents } from "@/lib/mockData";
import { Event } from "@/contexts/EventContext";
import {
  Trophy,
  Users,
  Calendar,
  Zap,
  ArrowRight,
  Search,
  Sparkles,
  Target,
  Globe,
  Star,
  TrendingUp,
  Clock,
  Award,
  Plus,
  ChevronDown,
  Menu,
  Code,
  Briefcase,
  GraduationCap,
  UserCheck,
  Building,
} from "lucide-react";

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Filter events by status
    const upcoming = mockEvents
      .filter((event) => event.status === "upcoming")
      .slice(0, 6);
    const ongoing = mockEvents.filter((event) => event.status === "ongoing");
    const featured = mockEvents.slice(0, 3); // Take first 3 as featured

    setUpcomingEvents(upcoming);
    setOngoingEvents(ongoing);
    setFeaturedEvents(featured);
  }, []);

  const categoryCards = [
    {
      title: "Internships",
      description: "Gain",
      highlight: "Practical Experience",
      gradient: "from-green-400 to-green-600",
      icon: GraduationCap,
    },
    {
      title: "Jobs",
      description: "Explore",
      highlight: "Diverse Careers",
      gradient: "from-blue-400 to-blue-600",
      icon: Briefcase,
    },
    {
      title: "Competitions",
      description: "Battle",
      highlight: "For Excellence",
      gradient: "from-yellow-400 to-yellow-600",
      icon: Trophy,
    },
    {
      title: "Mentorships",
      description: "Guidance",
      highlight: "From Top Mentors",
      gradient: "from-orange-400 to-orange-600",
      icon: UserCheck,
    },
    {
      title: "Practice",
      description: "Refine",
      highlight: "Skills Daily",
      gradient: "from-purple-400 to-purple-600",
      icon: Code,
    },
    {
      title: "More",
      description: "",
      highlight: "",
      gradient: "from-pink-400 to-pink-600",
      icon: Menu,
      isMore: true,
    },
  ];

  const whoUsesUnstop = [
    {
      title: "Students and Professionals",
      description: "Unlock Your Potential:",
      subtitle: "Compete, Build Resume, Grow and get Hired!",
      gradient: "from-blue-500 to-cyan-500",
      icon: GraduationCap,
    },
    {
      title: "Companies and Recruiters",
      description: "Discover Right Talent:",
      subtitle: "Hire, Engage, and Brand Like Never Before!",
      gradient: "from-purple-500 to-pink-500",
      icon: Building,
    },
    {
      title: "Colleges",
      description: "Bridge Academia and Industry:",
      subtitle: "Empower Students with Real-World Opportunities!",
      gradient: "from-yellow-500 to-orange-500",
      icon: Award,
    },
  ];

  const stats = [
    {
      label: "Active Events",
      value: "50+",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      label: "Participants",
      value: "10K+",
      icon: Users,
      color: "text-green-600",
    },
    {
      label: "Prize Pool",
      value: "$500K+",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      label: "Success Rate",
      value: "95%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with Next.js and modern web technologies",
      color: "text-yellow-500",
    },
    {
      icon: Globe,
      title: "Global Community",
      description:
        "Connect with developers and innovators from around the world",
      color: "text-blue-500",
    },
    {
      icon: Award,
      title: "Fair Judging",
      description: "Transparent scoring system with industry expert judges",
      color: "text-purple-500",
    },
    {
      icon: Target,
      title: "Goal Oriented",
      description: "Focused on creating real-world solutions and innovations",
      color: "text-green-500",
    },
  ];

  return (
    <div className="relative">
      <section className="py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              <span className="text-muted-foreground">CodeArena:</span>{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                Unlock
              </span>{" "}
              Your Career
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Explore opportunities from across the globe to grow, showcase
              skills, gain CV points & get hired by your dream company.
            </p>

            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-700 rounded-full px-4 py-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground">Kavya</span>
                <span className="font-semibold text-foreground">
                  Just Went CodeArena Pro!
                  <span className="text-primary ml-1">Explore Pro</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <Card
                    key={card.title}
                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${
                      card.gradient
                    } border-0 text-white group ${
                      card.isMore ? "flex items-center justify-center" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      {card.isMore ? (
                        <div className="flex items-center gap-2 text-white">
                          <Menu className="w-5 h-5" />
                          <span className="font-semibold">More</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <IconComponent className="w-5 h-5" />
                            <h3 className="font-bold text-lg">{card.title}</h3>
                          </div>
                          <p className="text-white/90">
                            {card.description}
                            <br />
                            <span className="font-semibold">
                              {card.highlight}
                            </span>
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Who&apos;s using CodeArena?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {whoUsesUnstop.map((user, index) => {
            const IconComponent = user.icon;
            return (
              <Card
                key={user.title}
                className="p-6 hover:shadow-xl transition-all duration-300 border-border/50"
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {user.title}
                      </h3>
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {user.description}
                        </span>{" "}
                        {user.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${user.gradient} flex items-center justify-center ml-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Know How
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Platform Statistics
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of developers and innovators
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="text-center group">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose CodeArena?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with modern technology and designed for the future of
            competitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 group hover:border-primary/20"
              >
                <CardContent className="p-0 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Events
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover amazing opportunities and challenges
            </p>
          </div>
          <Button asChild className="hidden md:flex">
            <Link href="/events">
              View All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {featuredEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="text-center md:hidden">
          <Button asChild className="w-full">
            <Link href="/events">
              View All Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
          <CardContent className="p-0 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of developers, designers, and innovators who are
                building the future through competitions and hackathons.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/events">
                    Browse Events
                    <Search className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <AnnouncementWidget />
    </div>
  );
}
