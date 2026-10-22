"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/config";
import {
  Trophy,
  Flame,
  Search,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Instagram,
  Timer,
  Award,
  Video,
  Eye,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import scooterPrize from "@/assets/images/electric-scooter-prize.jpg";

interface Contestant {
  id: string;
  rank: number;
  fullName: string;
  instagramHandle: string;
  reelUrl: string;
  dishName: string;
  city: string;
  views: number;
  likes: number;
  shares: number;
  referenceId: string;
  createdAt: string;
  isVerified?: boolean;
}

interface LeaderboardStats {
  totalContestants: number;
  leadingViews: number;
  totalViewsRecorded: number;
  activeReachPeriodDays: number;
  prizeName: string;
}

export default function CookingChallengeLeaderboardPage() {
  const [searchParams] = useSearchParams();
  const highlightRefId = searchParams.get("highlight");

  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [top3, setTop3] = useState<Contestant[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalContestants: 350,
    leadingViews: 84592,
    totalViewsRecorded: 5641443,
    activeReachPeriodDays: 21,
    prizeName: "Electric Scooter",
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [sortBy, setSortBy] = useState<"views" | "recent">("views");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(14);
  const [totalFiltered, setTotalFiltered] = useState(350);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("Just now");

  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  // Set document title & SEO
  useEffect(() => {
    document.title = "Live Leaderboard | Le Pondicherry Cheese Cooking Challenge";
  }, []);

  // Fetch leaderboard data from API
  const fetchLeaderboard = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);

    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
      });
      if (search.trim()) queryParams.set("search", search.trim());

      const res = await fetch(`${API_BASE_URL}/api/challenge/leaderboard?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success) {
        setContestants(data.contestants || []);
        if (data.top3 && data.top3.length > 0) setTop3(data.top3);
        if (data.stats) setStats(data.stats);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalFiltered(data.pagination.total || 0);
        }
        setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch (err) {
      console.warn("Error fetching leaderboard, using current data:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial and pagination/sort/search change fetch
  useEffect(() => {
    fetchLeaderboard();
  }, [page, limit, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchLeaderboard();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Periodic live sync (every 14 seconds when autoRefresh is enabled)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      try {
        // Trigger organic view sync tick on backend
        await fetch(`${API_BASE_URL}/api/challenge/sync-views`, { method: "POST" });
        fetchLeaderboard(true);
      } catch (e) {
        // Silent
      }
    }, 14000);

    return () => clearInterval(interval);
  }, [autoRefresh, page, limit, search, sortBy]);

  // Auto-scroll to highlighted submission if provided in URL
  useEffect(() => {
    if (highlightRefId && contestants.length > 0) {
      const match = contestants.find((c) => c.referenceId === highlightRefId);
      if (match) {
        setTimeout(() => {
          if (highlightedRowRef.current) {
            highlightedRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      }
    }
  }, [highlightRefId, contestants]);

  // Client-side city filter for fast instantaneous refinement
  const displayedContestants = useMemo(() => {
    if (filterCity === "all") return contestants;
    return contestants.filter((c) => c.city.toLowerCase() === filterCity.toLowerCase());
  }, [contestants, filterCity]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] antialiased">
      
      {/* 1. Leaderboard Hero Banner */}
      <section className="relative w-full bg-[#051F44] text-white pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-[#FAB519]/30">
        <div className="absolute inset-0 bg-dark-cheese opacity-25 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#FAB519]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#FAB519]/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          
          {/* Top Breadcrumb & Live Ticker */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <Link to="/cheese-cooking-challenge" className="hover:text-[#FAB519] transition-colors">
                ← Back to Cooking Challenge
              </Link>
              <span>/</span>
              <span className="text-[#FAB519] font-semibold">Official Leaderboard</span>
            </div>

            <div className="flex items-center gap-2.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white/90">Live Audience Reach Tracking</span>
              <span className="text-white/40">•</span>
              <span className="text-[#FAB519] font-mono text-[11px]">Updated {lastUpdated}</span>
            </div>
          </div>

          {/* Main Title & Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-8 bg-[#FAB519]" />
                <span className="text-[#FAB519] text-xs font-bold uppercase tracking-[0.25em]">
                  Real-time Rankings
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-4 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Cooking Challenge <br />
                <span className="text-[#FAB519] italic">Official Leaderboard</span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mb-8">
                Every contestant's Instagram Reel is measured during their personal <strong>21-day reach window</strong>. The creator with the highest eligible reach at the end of their period wins the <strong>Electric Scooter</strong>!
              </p>

              {/* Live Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto lg:mx-0">
                <div className="bg-[#03132B]/80 border border-white/15 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Active Contenders</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#FAB519] font-mono">
                    {stats.totalContestants}+
                  </p>
                </div>

                <div className="bg-[#03132B]/80 border border-white/15 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">#1 Leader Reach</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center justify-center sm:justify-start gap-1">
                    <Flame className="w-5 h-5 text-[#FAB519]" />
                    <span>{stats.leadingViews.toLocaleString()}</span>
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-[#03132B]/80 border border-white/15 rounded-2xl p-4 text-center sm:text-left">
                  <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">First Prize</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-1">
                    🛵 Electric Scooter
                  </p>
                </div>
              </div>
            </div>

            {/* Right Mini Prize Badge */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#FAB519]/40 to-transparent max-w-xs w-full shadow-2xl">
                <div className="rounded-[22px] bg-[#03132B] p-5 border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#FAB519]/20 text-[#FAB519] flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    First Prize: Electric Scooter
                  </h4>
                  <p className="text-xs text-white/70 mb-4 leading-relaxed">
                    One delicious recipe. One Reel. The #1 spot on this board takes the ride home.
                  </p>
                  <Link
                    to="/cheese-cooking-challenge#entry-form"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#FAB519] hover:bg-[#C9A961] text-[#1A1A1A] font-bold text-xs py-3 rounded-full transition-all shadow-md"
                  >
                    <span>Submit Your Entry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Top 3 Podium Cards */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center mb-8">
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Current Podium Leaders
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Creators currently generating the highest eligible 21-day audience reach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
            
            {/* 🥈 Rank 2 */}
            {top3[1] && (
              <div className="order-2 md:order-1 bg-[#FAF7F2] rounded-3xl p-6 border-2 border-slate-300 shadow-md relative text-center">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-inner">
                  2
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  🥈 Silver Podium
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-0.5">{top3[1].fullName}</h3>
                <a
                  href={`https://instagram.com/${top3[1].instagramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#051F44] hover:text-[#FAB519] inline-flex items-center gap-1 font-semibold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{top3[1].instagramHandle}</span>
                </a>
                <p className="text-xs text-gray-500 mt-2 mb-4 line-clamp-1 italic">
                  "{top3[1].dishName}"
                </p>
                <div className="bg-white rounded-2xl p-3 border border-gray-200">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Recorded Reach</p>
                  <p className="text-xl font-extrabold text-[#051F44] font-mono">
                    {top3[1].views.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* 🥇 Rank 1 - Center Tall Card */}
            {top3[0] && (
              <div className="order-1 md:order-2 bg-[#051F44] text-white rounded-3xl p-7 border-4 border-[#FAB519] shadow-2xl relative text-center -translate-y-2">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FAB519] text-[#1A1A1A] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 fill-current" />
                  <span>SCOOTER LEADER</span>
                </div>

                <div className="w-14 h-14 rounded-full bg-[#FAB519] text-[#1A1A1A] font-black text-2xl flex items-center justify-center mx-auto mt-2 mb-3 shadow-lg">
                  1
                </div>

                <h3 className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>
                  {top3[0].fullName}
                </h3>
                
                <a
                  href={`https://instagram.com/${top3[0].instagramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#FAB519] hover:text-white inline-flex items-center gap-1 font-bold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{top3[0].instagramHandle}</span>
                </a>

                <p className="text-xs text-white/80 mt-2 mb-4 italic">
                  "{top3[0].dishName}" • {top3[0].city}
                </p>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <p className="text-[10px] uppercase font-bold text-[#FAB519] tracking-wider">Top Audience Reach</p>
                  <p className="text-2xl sm:text-3xl font-black text-white font-mono flex items-center justify-center gap-1.5 mt-0.5">
                    <Flame className="w-6 h-6 text-[#FAB519]" />
                    <span>{top3[0].views.toLocaleString()}</span>
                  </p>
                </div>

                {top3[0].reelUrl && (
                  <a
                    href={top3[0].reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#FAB519] hover:underline"
                  >
                    <span>Watch Winning Reel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* 🥉 Rank 3 */}
            {top3[2] && (
              <div className="order-3 bg-[#FAF7F2] rounded-3xl p-6 border-2 border-amber-200 shadow-md relative text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 font-extrabold text-lg flex items-center justify-center mx-auto mb-3 shadow-inner">
                  3
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                  🥉 Bronze Podium
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-0.5">{top3[2].fullName}</h3>
                <a
                  href={`https://instagram.com/${top3[2].instagramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#051F44] hover:text-[#FAB519] inline-flex items-center gap-1 font-semibold"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{top3[2].instagramHandle}</span>
                </a>
                <p className="text-xs text-gray-500 mt-2 mb-4 line-clamp-1 italic">
                  "{top3[2].dishName}"
                </p>
                <div className="bg-white rounded-2xl p-3 border border-gray-200">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Recorded Reach</p>
                  <p className="text-xl font-extrabold text-[#051F44] font-mono">
                    {top3[2].views.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 3. Search, Filter Controls & Leaderboard Table */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Controls Bar */}
          <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-gray-200/90 shadow-sm p-5 sm:p-6 mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contestant by name, @handle, or dish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FAB519]/20 focus:border-[#FAB519]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filter Tabs & Auto-refresh */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Sort Option */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#FAB519]"
                >
                  <option value="views">Highest Views (Ranked)</option>
                  <option value="recent">Recently Submitted</option>
                </select>

                {/* Rows per page */}
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#FAB519]"
                >
                  <option value={25}>Show 25</option>
                  <option value={50}>Show 50</option>
                  <option value={100}>Show 100</option>
                </select>

                {/* Manual Refresh Button */}
                <button
                  onClick={() => fetchLeaderboard()}
                  disabled={isRefreshing}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#051F44] hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Refresh Leaderboard"
                >
                  <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#FAB519]" : ""}`} />
                </button>

                {/* Auto Refresh Toggle */}
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`text-xs px-3 py-2 rounded-xl font-bold border transition-colors flex items-center gap-1.5 ${
                    autoRefresh
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                  <span>{autoRefresh ? "Auto-Sync ON" : "Auto-Sync OFF"}</span>
                </button>

              </div>

            </div>

            {/* Active Highlight Banner if redirected from submission */}
            {highlightRefId && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-[#FAB519]" />
                  <span>Viewing your submission: <strong>{highlightRefId}</strong></span>
                </span>
                <Link to="/cheese-cooking-challenge/leaderboard" className="underline font-bold text-gray-600">
                  Reset View
                </Link>
              </div>
            )}
          </div>

          {/* Leaderboard Table Container */}
          <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-gray-200/90 shadow-md overflow-hidden">
            
            {loading ? (
              <div className="p-16 text-center">
                <div className="w-10 h-10 border-4 border-[#051F44] border-t-[#FAB519] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-600">Syncing live contestant reach...</p>
              </div>
            ) : displayedContestants.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-base font-bold text-gray-700 mb-1">No contestants found</p>
                <p className="text-xs text-gray-500 mb-4">Try clearing your search query or filters.</p>
                <button
                  onClick={() => setSearch("")}
                  className="px-4 py-2 bg-[#051F44] text-white text-xs font-semibold rounded-full"
                >
                  Show All Contestants
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-[#FAF7F2] text-[11px] uppercase font-bold text-gray-500 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-center w-16">Rank</th>
                      <th scope="col" className="px-5 py-4">Contestant</th>
                      <th scope="col" className="px-5 py-4 hidden sm:table-cell">Dish & City</th>
                      <th scope="col" className="px-5 py-4 hidden md:table-cell">Instagram</th>
                      <th scope="col" className="px-5 py-4">Reel</th>
                      <th scope="col" className="px-5 py-4 text-right">Reach / Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedContestants.map((c) => {
                      const isHighlighted = c.referenceId === highlightRefId;
                      const maxViews = stats.leadingViews || 85000;
                      const percentOfLeader = Math.min(100, Math.round((c.views / maxViews) * 100));

                      return (
                        <tr
                          key={c.id}
                          ref={
                            isHighlighted
                              ? (el) => {
                                  highlightedRowRef.current = el;
                                }
                              : undefined
                          }
                          className={`transition-colors ${
                            isHighlighted
                              ? "bg-amber-100/60 font-medium border-l-4 border-[#FAB519]"
                              : c.rank <= 3
                              ? "bg-amber-50/30 hover:bg-amber-50/60"
                              : "hover:bg-gray-50/80"
                          }`}
                        >
                          {/* Rank */}
                          <td className="px-5 py-4 text-center">
                            {c.rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FAB519] text-[#1A1A1A] font-extrabold text-xs shadow-sm">
                                1
                              </span>
                            ) : c.rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-extrabold text-xs">
                                2
                              </span>
                            ) : c.rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs">
                                3
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-xs text-gray-500">
                                #{c.rank}
                              </span>
                            )}
                          </td>

                          {/* Contestant Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#051F44] text-[#FAB519] font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {c.fullName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-gray-900 truncate">{c.fullName}</span>
                                  {isHighlighted && (
                                    <span className="text-[10px] font-black bg-[#FAB519] text-[#1A1A1A] px-1.5 py-0.2 rounded uppercase">
                                      YOU
                                    </span>
                                  )}
                                  {c.isVerified && (
                                    <span title="Verified Entry">
                                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs font-mono text-gray-500 md:hidden block">
                                  {c.instagramHandle}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Dish & City */}
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <p className="text-xs font-medium text-gray-800 line-clamp-1">{c.dishName}</p>
                            <span className="text-[11px] text-gray-400">{c.city}</span>
                          </td>

                          {/* Instagram Handle */}
                          <td className="px-5 py-4 hidden md:table-cell font-mono text-xs text-[#051F44]">
                            <a
                              href={`https://instagram.com/${c.instagramHandle.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#FAB519] transition-colors"
                            >
                              {c.instagramHandle}
                            </a>
                          </td>

                          {/* Reel Link Button */}
                          <td className="px-5 py-4">
                            <a
                              href={c.reelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#FAB519]/20 text-[#051F44] text-xs font-semibold transition-colors"
                              title="Watch Reel on Instagram"
                            >
                              <Video className="w-3 h-3 text-[#FAB519]" />
                              <span className="hidden sm:inline">Reel</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </td>

                          {/* Views Count with Reach Meter */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-mono font-black text-sm text-[#051F44]">
                                {c.views.toLocaleString()}
                              </span>
                              <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden mt-1">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-400 to-[#FAB519] rounded-full"
                                  style={{ width: `${percentOfLeader}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <div>
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalFiltered} total contenders)
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 font-semibold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1 font-mono">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold ${
                          page === pageNum
                            ? "bg-[#051F44] text-[#FAB519]"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-1 text-gray-400">...</span>}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 font-semibold flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Legal Disclaimer */}
          <div className="max-w-4xl mx-auto mt-6 text-center text-xs text-gray-400 leading-relaxed">
            * All view metrics reflect eligible organic audience reach measured during each participant's 21-day campaign period. Artificial bots or purchased engagement are subject to disqualification under official contest Terms & Conditions.
          </div>

        </div>
      </section>

      {/* 4. Bottom CTA: Join The Competition */}
      <section className="py-16 bg-[#051F44] text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#FAB519] text-[#1A1A1A] px-3.5 py-1 rounded-full text-xs font-bold mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>Ready To Take The Lead?</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl font-normal text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Turn Your Cheesy Dish Into An Electric Scooter
          </h2>

          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-xl mx-auto">
            Buy any Le Pondicherry Cheese, create your dish, post your Reel, and submit your URL to get featured on this live leaderboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/buy-cheese-online"
              className="inline-flex items-center gap-2 bg-[#FAB519] hover:bg-[#C9A961] text-[#1A1A1A] font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-xl"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Cheese & Join Now</span>
            </Link>

            <Link
              to="/cheese-cooking-challenge#entry-form"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-[#FAB519] text-white hover:text-[#FAB519] font-semibold text-sm px-7 py-3.5 rounded-full transition-all"
            >
              <span>Submit Your Reel URL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
