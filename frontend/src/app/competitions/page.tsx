'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, Trophy, Users, MapPin, Clock, Star, ChevronRight, Eye, Heart } from 'lucide-react';

type Competition = {
  id: number;
  name: string;
  date: string;
  status: 'open' | 'upcoming' | 'planning';
  image: string;
  mode: 'online' | 'offline' | 'hybrid';
  title: string;
  description: string;
  theme: string;
  tracks: string[];
  rules: string;
  timeline: string;
  prizes: string;
  sponsors: string[];
  registrations: number;
  favorites: number;
};

const CompetitionsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'upcoming' | 'planning'>('all');

  const competitions: Competition[] = [
    {
      id: 1,
      name: "Tech Innovation Challenge 2025",
      date: "Mar 15, 2025",
      status: "open",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
      mode: "hybrid",
      title: "Build the Future of AI",
      description: "A global competition to develop innovative AI solutions for sustainability challenges.",
      theme: "Artificial Intelligence & Sustainability",
      tracks: ["AI/ML", "Climate Tech", "Social Impact"],
      rules: "Teams of 1-4 members, 48-hour development window",
      timeline: "Registration: Feb 1-28, Development: Mar 15-17, Judging: Mar 18-20",
      prizes: "$50K Grand Prize, $20K Runner-up, $10K People's Choice",
      sponsors: ["TechCorp", "GreenVentures", "InnovateFund"],
      registrations: 1247,
      favorites: 89
    },
    {
      id: 2,
      name: "Creative Design Sprint",
      date: "Apr 2, 2025",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=200&fit=crop",
      mode: "online",
      title: "Design for Impact",
      description: "Create compelling visual narratives that drive social change and awareness.",
      theme: "Social Impact Design",
      tracks: ["UX/UI", "Brand Design", "Motion Graphics"],
      rules: "Individual or team entries, original work only",
      timeline: "Registration: Mar 1-25, Submission: Apr 2-9, Results: Apr 15",
      prizes: "$15K Winner, $8K Runner-up, Portfolio Reviews",
      sponsors: ["DesignStudio", "CreativeAgency"],
      registrations: 892,
      favorites: 156
    },
    {
      id: 3,
      name: "Blockchain Developer Cup",
      date: "May 10, 2025",
      status: "planning",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      mode: "offline",
      title: "Decentralize Everything",
      description: "Build next-generation blockchain applications solving real-world problems.",
      theme: "Blockchain & Web3",
      tracks: ["DeFi", "NFTs", "DAOs", "Infrastructure"],
      rules: "Open source projects, deployed on testnet",
      timeline: "Registration: Apr 1-30, Development: May 10-12, Demo: May 13",
      prizes: "$75K in crypto prizes, Accelerator opportunities",
      sponsors: ["CryptoFund", "Web3Labs", "BlockchainVC"],
      registrations: 0,
      favorites: 234
    }
  ];

  const filteredCompetitions = useMemo(() => {
    return competitions.filter(comp => {
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || comp.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  const getStatusColor = (status: Competition['status']) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-700 border-green-200';
      case 'upcoming': return 'bg-blue-500/20 text-blue-700 border-blue-200';
      case 'planning': return 'bg-purple-500/20 text-purple-700 border-purple-200';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  const getModeIcon = (mode: Competition['mode']) => {
    switch (mode) {
      case 'online': return '🌐';
      case 'offline': return '📍';
      case 'hybrid': return '🔄';
      default: return '📅';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Competitions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and participate in cutting-edge competitions that push the boundaries of innovation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search and Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search competitions..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter by Status
                </h3>
                <div className="space-y-2">
                  {(['all', 'open', 'upcoming', 'planning'] as Array<'all' | 'open' | 'upcoming' | 'planning'>).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                        selectedFilter === filter
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
                <h3 className="text-white font-semibold mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Total Competitions</span>
                    <span className="text-white font-medium">{competitions.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Open for Registration</span>
                    <span className="text-green-400 font-medium">
                      {competitions.filter(c => c.status === 'open').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Total Participants</span>
                    <span className="text-white font-medium">
                      {competitions.reduce((sum, c) => sum + c.registrations, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Competitions Grid */}
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {filteredCompetitions.map((competition) => (
                <div
                  key={competition.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer"
                  onClick={() => router.push(`/competitions/${competition.id}`)}
                >
                  <div className="md:flex">
                    {/* Competition Image */}
                    <div className="md:w-1/3 relative overflow-hidden">
                      <img
                        src={competition.image}
                        alt={competition.name}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(competition.status)}`}>
                          {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{competition.registrations.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{competition.favorites}</span>
                        </div>
                      </div>
                    </div>

                    {/* Competition Details */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {competition.name}
                          </h3>
                          <p className="text-gray-300 text-sm mb-2">{competition.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {competition.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-base">{getModeIcon(competition.mode)}</span>
                              {competition.mode}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>

                      {/* Tracks */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {competition.tracks.slice(0, 3).map((track, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 rounded-full text-xs border border-blue-500/30"
                          >
                            {track}
                          </span>
                        ))}
                        {competition.tracks.length > 3 && (
                          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
                            +{competition.tracks.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Prize Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Trophy className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {competition.prizes.split(',')[0]}
                          </span>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                          {competition.status === 'open' ? 'Register Now' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CompetitionsPage;