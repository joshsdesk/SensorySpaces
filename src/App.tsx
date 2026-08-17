import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Volume2,
  Sun,
  Users,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ShieldCheck,
  User,
  HelpCircle,
  Calendar,
  Sparkles,
  Map as MapIcon,
  ListFilter,
  ArrowRight,
  Info,
  SlidersHorizontal,
  X,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Moon,
  Home,
  Compass,
  FileText,
  Menu,
  ChevronRight,
  Bell,
  ThumbsUp,
  Award,
  BookOpen,
  Filter,
  Eye,
  Camera,
  Layers,
  Zap,
  TrendingUp,
  Map
} from 'lucide-react';
import { apiService } from './services/api';
import { MapComponent } from './components/MapComponent';
import { SensoryEvent, SensoryVenue, ChildProfile, WeatherAura } from './types';

export default function App() {
  // Theme & Layout State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'verification' | 'add' | 'profile'>('feed');
  const [feedCategory, setFeedCategory] = useState<'all' | 'events' | 'venues' | 'quiet_rooms'>('all');

  // Data State
  const [events, setEvents] = useState<SensoryEvent[]>([]);
  const [venues, setVenues] = useState<SensoryVenue[]>([]);
  const [unverifiedEvents, setUnverifiedEvents] = useState<SensoryEvent[]>([]);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<ChildProfile | null>(null);
  const [weatherAura, setWeatherAura] = useState<WeatherAura | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [noiseFilter, setNoiseFilter] = useState('');
  const [lightFilter, setLightFilter] = useState('');
  const [crowdFilter, setCrowdFilter] = useState('');

  // ⚡ Optimization: Debounce search query input (300ms delay) to prevent excessive API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Modals & Selections
  const [selectedEvent, setSelectedEvent] = useState<SensoryEvent | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<SensoryVenue | null>(null);
  const [showTipsModal, setShowTipsModal] = useState(false);

  // Likes & Bookmarks local interaction state
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  // Quick Post / Composer State in Feed
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postAddress, setPostAddress] = useState('Denver, CO');
  const [postNoise, setPostNoise] = useState('Low');
  const [postLighting, setPostLighting] = useState('Natural');
  const [postCrowd, setPostCrowd] = useState('Low');
  const [postQuietRoom, setPostQuietRoom] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccessMsg, setPostSuccessMsg] = useState(false);

  // Load Initial Data
  useEffect(() => {
    fetchData();
    fetchWeather();
  }, []);

  const fetchData = async () => {
    const [fetchedEvents, fetchedVenues, fetchedUnverified, fetchedProfiles] = await Promise.all([
      apiService.getEvents(),
      apiService.getVenues(),
      apiService.getUnverifiedEvents(),
      apiService.getProfiles()
    ]);

    setEvents(fetchedEvents);
    setVenues(fetchedVenues);
    setUnverifiedEvents(fetchedUnverified);
    setProfiles(fetchedProfiles);

    if (fetchedProfiles.length > 0) {
      setActiveProfile(fetchedProfiles[0]);
    }

    // Initialize random initial likes for social feel
    const initialLikes: Record<string, number> = {};
    fetchedEvents.forEach((evt, idx) => {
      initialLikes[evt._id] = 12 + (idx * 7) % 24;
    });
    fetchedVenues.forEach((ven, idx) => {
      initialLikes[ven._id] = 18 + (idx * 5) % 31;
    });
    setLikesMap(initialLikes);
  };

  const fetchWeather = async () => {
    const aura = await apiService.fetchSensoryAura();
    setWeatherAura(aura);
  };

  const handleFilterSearch = async () => {
    const filtered = await apiService.getEvents({
      q: debouncedSearchQuery,
      noise: noiseFilter || undefined,
      lights: lightFilter || undefined,
      crowds: crowdFilter || undefined
    });
    setEvents(filtered);
  };

  // ⚡ Optimization: Trigger search only when debounced query or select filters change
  useEffect(() => {
    handleFilterSearch();
  }, [debouncedSearchQuery, noiseFilter, lightFilter, crowdFilter]);

  const handleVerifyEvent = async (id: string) => {
    await apiService.verifyEvent(id);
    setUnverifiedEvents(prev => prev.filter(e => e._id !== id));
    fetchData();
  };

  const toggleLike = (id: string) => {
    const isLiked = !!userLikedMap[id];
    setUserLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setLikesMap(prev => ({ ...prev, [id]: (prev[id] || 0) + (isLiked ? -1 : 1) }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle) return;

    setIsPosting(true);
    const details = [];
    if (postQuietRoom) details.push('Quiet Room');
    details.push('Community Submitted');

    await apiService.createEvent({
      title: postTitle,
      description: postDesc,
      address: postAddress,
      date: new Date().toISOString(),
      organizer: activeProfile ? `${activeProfile.name}'s Family` : 'Community Member',
      noiseLevel: postNoise,
      lighting: postLighting,
      crowdDensity: postCrowd,
      details
    });

    setIsPosting(false);
    setPostTitle('');
    setPostDesc('');
    setPostSuccessMsg(true);
    setTimeout(() => setPostSuccessMsg(false), 3000);
    fetchData();
  };

  // Compatibility Score Calculator
  const calculateMatchScore = (evt: SensoryEvent): number => {
    if (!activeProfile) return 92;
    let score = 100;

    const profileNoise = activeProfile.preferences?.noiseLevel || ['Low'];
    const evtNoise = evt.sensoryProfile?.noiseLevel?.value;
    if (evtNoise && !profileNoise.includes(evtNoise)) {
      if (evtNoise === 'High') score -= 35;
      else score -= 15;
    }

    const profileLight = activeProfile.preferences?.lighting || ['Natural', 'Dimmed'];
    const evtLight = evt.sensoryProfile?.lighting?.value;
    if (evtLight && !profileLight.includes(evtLight)) {
      if (evtLight === 'Bright') score -= 20;
    }

    const hasQuietRoom = evt.sensoryProfile?.details?.some(d => d.value?.toLowerCase().includes('quiet room'));
    if (hasQuietRoom) score += 10;

    return Math.min(Math.max(score, 45), 100);
  };

  // Filtered lists for feed
  const displayedEvents = useMemo(() => {
    if (feedCategory === 'venues') return [];
    if (feedCategory === 'quiet_rooms') {
      return events.filter(e => e.sensoryProfile?.details?.some(d => d.value?.toLowerCase().includes('quiet room')));
    }
    return events;
  }, [events, feedCategory]);

  const displayedVenues = useMemo(() => {
    if (feedCategory === 'events') return [];
    return venues;
  }, [venues, feedCategory]);

  return (
    <div className={`min-h-screen font-sans ${theme === 'dark' ? 'dark bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-slate-800'}`}>
      
      {/* Container holding social media structure */}
      <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col md:flex-row relative overflow-x-hidden">

        {/* LEFT SIDEBAR (NAVIGATION & SHORTCUTS) */}
        <aside
          className={`w-[260px] flex-shrink-0 transition-all duration-300 z-40 border-r flex flex-col justify-between ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
          } ${
            leftSidebarOpen ? 'fixed inset-y-0 left-0 shadow-2xl' : 'hidden md:flex'
          }`}
        >
          <div className="overflow-y-auto flex-1">
            {/* Logo Bar */}
            <div className={`h-[68px] px-6 flex items-center justify-between border-b ${theme === 'dark' ? 'border-zinc-800 text-white' : 'border-slate-100 text-slate-900'}`}>
              <div className="flex items-center gap-2.5 font-bold tracking-wider text-base">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs font-black text-lg">
                  S
                </div>
                <span>SENSORY<span className="text-indigo-500">SPACES</span></span>
              </div>

              <button
                onClick={() => setLeftSidebarOpen(false)}
                className="md:hidden p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Group 1: Navigation */}
            <div className="p-6 space-y-6">
              <div>
                <div className={`text-xs font-semibold tracking-wider uppercase mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                  NAVIGATION
                </div>
                <nav className="space-y-1 text-sm font-medium">
                  <button
                    onClick={() => { setActiveTab('feed'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeTab === 'feed'
                        ? theme === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'bg-indigo-50 text-indigo-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-indigo-500" />
                    <span>Social Feed</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('map'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeTab === 'map'
                        ? theme === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'bg-indigo-50 text-indigo-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-blue-500" />
                    <span>Interactive Map</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('verification'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      activeTab === 'verification'
                        ? theme === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'bg-indigo-50 text-indigo-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Moderation Queue</span>
                    </div>
                    {unverifiedEvents.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-zinc-950 rounded-full">
                        {unverifiedEvents.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('add'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeTab === 'add'
                        ? theme === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'bg-indigo-50 text-indigo-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 text-indigo-400" />
                    <span>Submit Sensory Place</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('profile'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeTab === 'profile'
                        ? theme === 'dark' ? 'bg-zinc-800 text-white font-bold' : 'bg-indigo-50 text-indigo-700 font-bold'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-pink-500" />
                    <span>Child Preferences</span>
                  </button>
                </nav>
              </div>

              {/* Menu Group 2: Sensory Shortcuts */}
              <div>
                <div className={`text-xs font-semibold tracking-wider uppercase mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                  SENSORY SHORTCUTS
                </div>
                <div className="space-y-1.5 text-xs font-medium">
                  <button
                    onClick={() => { setSearchQuery('Library'); setActiveTab('feed'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="p-1 bg-amber-500/10 text-amber-500 rounded-lg">📚</span>
                    <span>Quiet Libraries</span>
                  </button>

                  <button
                    onClick={() => { setSearchQuery('Zoo'); setActiveTab('feed'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="p-1 bg-emerald-500/10 text-emerald-500 rounded-lg">🌳</span>
                    <span>Nature & Outdoor Parks</span>
                  </button>

                  <button
                    onClick={() => { setSearchQuery('Museum'); setActiveTab('feed'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded-lg">🎨</span>
                    <span>Low-Noise Museums</span>
                  </button>

                  <button
                    onClick={() => { setSearchQuery('Movie'); setActiveTab('feed'); setLeftSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                      theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="p-1 bg-blue-500/10 text-blue-500 rounded-lg">🎬</span>
                    <span>Dimmed Cinema Mornings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Community Footer in Left Sidebar */}
          <div className={`p-4 border-t text-xs ${theme === 'dark' ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50'}`}>
            <button
              onClick={() => setShowTipsModal(true)}
              className="w-full flex items-center justify-between p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-semibold rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Parent Sensory Guide</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* MAIN FEED CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 min-h-screen">

          {/* TOP SEARCH BAR & HEADER CONTROL */}
          <header className={`h-[68px] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 border-b backdrop-blur-md ${
            theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'
          }`}>
            {/* Mobile Left Sidebar Trigger */}
            <button
              onClick={() => setLeftSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sensory events, quiet rooms, libraries, museums..."
                className={`w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500 focus:border-indigo-500'
                    : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Action Badges & Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Switcher Toggle */}
              <button
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                  theme === 'dark'
                    ? 'bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle Light/Dark Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="hidden lg:inline">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              {/* Child Profile Indicator Badge */}
              {activeProfile && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-zinc-800/80 border-zinc-700 text-indigo-300 hover:bg-zinc-700'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{activeProfile.name}</span>
                </button>
              )}

              {/* Mobile Right Sidebar Trigger */}
              <button
                onClick={() => setRightSidebarOpen(true)}
                className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <Users className="w-5 h-5 text-indigo-400" />
              </button>
            </div>
          </header>

          {/* SCROLLABLE MAIN CONTAINER */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">

            {/* VIEW TAB 1: SOCIAL FEED */}
            {activeTab === 'feed' && (
              <div className="space-y-6">

                {/* Profile Cover / Denver Hub Header */}
                <div className={`relative rounded-2xl overflow-hidden border shadow-xs ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <div className="h-44 sm:h-52 w-full bg-slate-900 dark:bg-zinc-900 relative">
                    <img
                      src="https://images.unsplash.com/photo-1508247967583-7d982ea01526?auto=format&fit=crop&w=1600&q=80"
                      alt="Denver Hub Cover"
                      className="w-full h-full object-cover opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    
                    {/* Live Denver Hub Info Overlay */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800 text-xs font-semibold text-white">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Denver ASD Community Hub</span>
                    </div>
                  </div>

                  {/* Profile Info Row below cover */}
                  <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 z-10">
                    <div className="flex items-end gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg border-4 dark:border-zinc-900 border-white">
                        DEN
                      </div>
                      <div className="mb-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                          SensorySpaces Hub
                          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        </h1>
                        <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                          Community-verified events & low-stimulation places for children with ASD.
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats Pill Bar */}
                    <div className="flex items-center gap-2 text-xs font-medium self-stretch sm:self-auto">
                      <div className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="block font-bold text-base text-indigo-400">{events.length}</span>
                        <span className="text-[10px] text-zinc-400 uppercase">Events</span>
                      </div>
                      <div className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="block font-bold text-base text-emerald-400">{venues.length}</span>
                        <span className="text-[10px] text-zinc-400 uppercase">Venues</span>
                      </div>
                      <div className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border text-center ${theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="block font-bold text-base text-blue-400">100%</span>
                        <span className="text-[10px] text-zinc-400 uppercase">Safe ASD</span>
                      </div>
                    </div>
                  </div>

                  {/* Feed Category Menu Bar */}
                  <div className={`flex items-center border-t overflow-x-auto px-4 text-xs font-semibold ${theme === 'dark' ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <button
                      onClick={() => setFeedCategory('all')}
                      className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                        feedCategory === 'all'
                          ? 'border-indigo-500 text-indigo-400 font-bold'
                          : 'border-transparent text-zinc-400 hover:text-white'
                      }`}
                    >
                      All Posts ({events.length + venues.length})
                    </button>
                    <button
                      onClick={() => setFeedCategory('events')}
                      className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                        feedCategory === 'events'
                          ? 'border-indigo-500 text-indigo-400 font-bold'
                          : 'border-transparent text-zinc-400 hover:text-white'
                      }`}
                    >
                      Upcoming Events ({events.length})
                    </button>
                    <button
                      onClick={() => setFeedCategory('venues')}
                      className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                        feedCategory === 'venues'
                          ? 'border-indigo-500 text-indigo-400 font-bold'
                          : 'border-transparent text-zinc-400 hover:text-white'
                      }`}
                    >
                      Permanent Places ({venues.length})
                    </button>
                    <button
                      onClick={() => setFeedCategory('quiet_rooms')}
                      className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                        feedCategory === 'quiet_rooms'
                          ? 'border-indigo-500 text-indigo-400 font-bold'
                          : 'border-transparent text-zinc-400 hover:text-white'
                      }`}
                    >
                      Dedicated Quiet Nooks 🧩
                    </button>
                  </div>
                </div>

                {/* Status Composer Post Box */}
                <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-3 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {activeProfile?.name ? activeProfile.name[0] : 'P'}
                    </div>
                    <form onSubmit={handlePostSubmit} className="flex-1">
                      <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder={`Share a low-noise place or quiet event for ${activeProfile?.name || 'ASD families'}...`}
                        className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border focus:outline-none transition-all ${
                          theme === 'dark'
                            ? 'bg-zinc-800/80 border-zinc-700 text-white placeholder-zinc-500 focus:border-indigo-500'
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                        }`}
                      />
                    </form>
                  </div>

                  {postTitle && (
                    <div className="pt-3 border-t border-zinc-800 space-y-3 animate-in fade-in duration-200 text-xs">
                      <textarea
                        rows={2}
                        value={postDesc}
                        onChange={(e) => setPostDesc(e.target.value)}
                        placeholder="Add sensory details (e.g., quiet corner on 2nd floor, dim lighting available)..."
                        className={`w-full px-3.5 py-2 rounded-xl border focus:outline-none ${
                          theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 font-semibold">Noise:</span>
                          <select
                            value={postNoise}
                            onChange={(e) => setPostNoise(e.target.value)}
                            className={`px-2 py-1 rounded-lg border font-semibold ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-200'}`}
                          >
                            <option value="Low">Low Noise</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>

                          <span className="text-zinc-400 font-semibold ml-2">Light:</span>
                          <select
                            value={postLighting}
                            onChange={(e) => setPostLighting(e.target.value)}
                            className={`px-2 py-1 rounded-lg border font-semibold ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-200'}`}
                          >
                            <option value="Natural">Natural</option>
                            <option value="Dimmed">Dimmed</option>
                            <option value="Bright">Bright</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={handlePostSubmit}
                          disabled={isPosting}
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Post to Community</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {postSuccessMsg && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Submitted! Your event is now live on the social feed.
                    </div>
                  )}
                </div>

                {/* SENSORY FEED POSTS LIST */}
                <div className="space-y-4">
                  {/* Events Posts */}
                  {displayedEvents.map((evt) => {
                    const matchScore = calculateMatchScore(evt);
                    const isVerified = evt.sensoryProfile?.noiseLevel?.status === 'verified';
                    const isLiked = !!userLikedMap[evt._id];
                    const isBookmarked = !!bookmarkedMap[evt._id];
                    const likesCount = likesMap[evt._id] || 15;

                    return (
                      <article
                        key={evt._id}
                        className={`p-5 rounded-2xl border shadow-xs transition-all space-y-4 ${
                          theme === 'dark'
                            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                            : 'bg-white border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        {/* Post Author / Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                              {evt.metadata.organizer ? evt.metadata.organizer[0] : 'S'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {evt.metadata.organizer || 'Autism Society Member'}
                                </span>
                                {isVerified && (
                                  <span title="Human Verified Event">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-400">
                                Event Host • {new Date(evt.metadata.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            matchScore >= 80
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {matchScore}% Child Match
                          </div>
                        </div>

                        {/* Post Content Title & Body */}
                        <div className="space-y-2">
                          <h2
                            onClick={() => setSelectedEvent(evt)}
                            className={`text-base sm:text-lg font-bold cursor-pointer transition-colors ${
                              theme === 'dark' ? 'text-white hover:text-indigo-400' : 'text-slate-900 hover:text-indigo-600'
                            }`}
                          >
                            {evt.metadata.title}
                          </h2>

                          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>
                            {evt.metadata.description}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{evt.metadata.location?.address}</span>
                          </div>
                        </div>

                        {/* Sensory Profile Attribute Badges */}
                        <div className={`p-3 rounded-xl border flex flex-wrap items-center gap-2 text-xs ${
                          theme === 'dark' ? 'bg-zinc-800/50 border-zinc-800' : 'bg-slate-50 border-slate-100'
                        }`}>
                          <span className="px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            🔊 Noise: {evt.sensoryProfile.noiseLevel?.value || 'Low'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            💡 Light: {evt.sensoryProfile.lighting?.value || 'Natural'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            👥 Crowd: {evt.sensoryProfile.crowdDensity?.value || 'Low'}
                          </span>

                          {evt.sensoryProfile.details?.map((d, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              ✓ {d.value}
                            </span>
                          ))}
                        </div>

                        {/* Post Action Footer (Likes, Bookmarks, Comments, Details) */}
                        <div className={`pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                          theme === 'dark' ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'
                        }`}>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleLike(evt._id)}
                              className={`flex items-center gap-1.5 transition-colors ${
                                isLiked ? 'text-pink-500 font-bold' : 'hover:text-pink-400'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                              <span>{likesCount}</span>
                            </button>

                            <button
                              onClick={() => setSelectedEvent(evt)}
                              className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Details & Notes</span>
                            </button>

                            <button
                              onClick={() => toggleBookmark(evt._id)}
                              className={`flex items-center gap-1.5 transition-colors ${
                                isBookmarked ? 'text-amber-400 font-bold' : 'hover:text-amber-400'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>

                          <button
                            onClick={() => setSelectedEvent(evt)}
                            className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                          >
                            <span>View Specs</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}

                  {/* Permanent Venues Posts */}
                  {displayedVenues.map((ven) => {
                    const isLiked = !!userLikedMap[ven._id];
                    const isBookmarked = !!bookmarkedMap[ven._id];
                    const likesCount = likesMap[ven._id] || 22;

                    return (
                      <article
                        key={ven._id}
                        className={`p-5 rounded-2xl border shadow-xs transition-all space-y-4 ${
                          theme === 'dark'
                            ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                            : 'bg-white border-slate-200 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                              🏛️
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                  {ven.name}
                                </span>
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                                  PERMANENT VENUE
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-400">
                                {ven.type} • {ven.location?.address}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ven.sensoryProfile.amenities?.map((amenity, idx) => (
                            <span key={idx} className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg">
                              ✓ {amenity}
                            </span>
                          ))}
                        </div>

                        <div className={`pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                          theme === 'dark' ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'
                        }`}>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleLike(ven._id)}
                              className={`flex items-center gap-1.5 transition-colors ${
                                isLiked ? 'text-pink-500 font-bold' : 'hover:text-pink-400'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                              <span>{likesCount}</span>
                            </button>

                            <button
                              onClick={() => toggleBookmark(ven._id)}
                              className={`flex items-center gap-1.5 transition-colors ${
                                isBookmarked ? 'text-amber-400 font-bold' : 'hover:text-amber-400'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>

                          <button
                            onClick={() => setSelectedVenue(ven)}
                            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                          >
                            <span>Venue Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW TAB 2: INTERACTIVE MAP VIEW */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h2 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Sensory Map Explorer
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Violet markers indicate events, green markers indicate verified quiet venues.
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-bold">
                    Denver Regional Area
                  </span>
                </div>

                <MapComponent
                  events={events}
                  venues={venues}
                  selectedItem={selectedEvent || selectedVenue}
                  onSelectEvent={(evt) => setSelectedEvent(evt)}
                  onSelectVenue={(ven) => setSelectedVenue(ven)}
                />
              </div>
            )}

            {/* VIEW TAB 3: VERIFICATION QUEUE */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border space-y-2 ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Community Moderation & Sensory Verification
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Human moderators check submitted places to ensure low noise, dim lighting, and safe quiet spaces.
                      </p>
                    </div>
                  </div>
                </div>

                {unverifiedEvents.length === 0 ? (
                  <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                  }`}>
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Verification Queue Clear!
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      All submitted sensory events have been human-verified for accuracy.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unverifiedEvents.map((evt) => (
                      <div
                        key={evt._id}
                        className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-md">
                            PENDING VERIFICATION
                          </span>
                          <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {evt.metadata.title}
                          </h3>
                          <p className="text-xs text-zinc-400">{evt.metadata.description}</p>
                          <div className="text-xs text-zinc-500 flex items-center gap-4">
                            <span>📍 {evt.metadata.location?.address}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleVerifyEvent(evt._id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Verify</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW TAB 4: SUBMIT EVENT */}
            {activeTab === 'add' && (
              <div className={`max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border shadow-xs space-y-6 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <PlusCircle className="w-5 h-5 text-indigo-500" />
                    Submit a Sensory-Friendly Place or Event
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Help ASD families discover quiet hours, dim movie mornings, or calm outdoor parks.
                  </p>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className={`block font-bold mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>Title *</label>
                    <input
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="e.g. Quiet Morning Storytime at Denver Public Library"
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none ${
                        theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>Description</label>
                    <textarea
                      rows={3}
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      placeholder="Describe noise reduction, lighting conditions, seating layout..."
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none ${
                        theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-bold mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>Address / Location</label>
                      <input
                        type="text"
                        value={postAddress}
                        onChange={(e) => setPostAddress(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none ${
                          theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block font-bold mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>Noise Level</label>
                      <select
                        value={postNoise}
                        onChange={(e) => setPostNoise(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl border font-semibold ${
                          theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <option value="Low">Low Noise (Quiet)</option>
                        <option value="Medium">Medium Noise</option>
                        <option value="High">High Noise</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                  >
                    Publish to Social Feed
                  </button>
                </form>
              </div>
            )}

            {/* VIEW TAB 5: CHILD PROFILE PREFERENCES */}
            {activeTab === 'profile' && activeProfile && (
              <div className={`max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border shadow-xs space-y-6 ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <User className="w-5 h-5 text-indigo-500" />
                    Child Sensory Sensitivity Profile
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Set noise and lighting tolerances to dynamically generate compatibility match scores.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className={`block font-bold mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>Child Name</label>
                    <input
                      type="text"
                      value={activeProfile.name}
                      onChange={(e) => setActiveProfile({ ...activeProfile, name: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border font-bold ${
                        theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-zinc-800/50 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      Sensory Tolerances
                    </h4>

                    <div>
                      <label className="block text-zinc-400 mb-1">Tolerated Noise Levels</label>
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map((lvl) => {
                          const isSelected = activeProfile.preferences?.noiseLevel?.includes(lvl);
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => {
                                const current = activeProfile.preferences?.noiseLevel || [];
                                const updated = isSelected
                                  ? current.filter(x => x !== lvl)
                                  : [...current, lvl];
                                setActiveProfile({
                                  ...activeProfile,
                                  preferences: { ...activeProfile.preferences, noiseLevel: updated }
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-500'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }`}
                            >
                              {lvl} Noise
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      apiService.updateProfile(activeProfile._id, activeProfile);
                      alert('Child Sensory Profile saved successfully!');
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* RIGHT SIDEBAR (PROFILE WIDGET & WEATHER AURA & CONTACTS) */}
        <aside
          className={`w-[280px] flex-shrink-0 transition-all duration-300 border-l flex flex-col justify-between ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
          } ${
            rightSidebarOpen ? 'fixed inset-y-0 right-0 z-50 shadow-2xl' : 'hidden xl:flex'
          }`}
        >
          <div className="overflow-y-auto flex-1 p-5 space-y-6">

            {/* Mobile Close Button */}
            <div className="flex items-center justify-between xl:hidden pb-3 border-b border-zinc-800">
              <span className="font-bold text-sm text-white">Community Panel</span>
              <button onClick={() => setRightSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Child Profile Card Widget */}
            {activeProfile && (
              <div className={`p-4 rounded-2xl border space-y-3 ${
                theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700' : 'bg-indigo-50/70 border-indigo-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    ACTIVE CHILD PROFILE
                  </span>
                  <button onClick={() => setActiveTab('profile')} className="text-[11px] text-indigo-400 hover:underline font-semibold">
                    Edit
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-xs">
                    {activeProfile.name[0]}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {activeProfile.name}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Noise: <strong className="text-indigo-400">{activeProfile.preferences?.noiseLevel?.join(', ') || 'Low'}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sensory Weather Aura Widget */}
            {weatherAura && (
              <div className="p-4 rounded-2xl bg-zinc-800/90 text-white border border-zinc-700 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    SENSORY WEATHER AURA
                  </span>
                  <span className="text-xl">{weatherAura.icon}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{weatherAura.label}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {weatherAura.description}
                </p>
              </div>
            )}

            {/* Community Volunteers & Parent Mentors */}
            <div className="space-y-3">
              <div className={`text-xs font-semibold tracking-wider uppercase ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                COMMUNITY MODERATORS
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Sarah M. (ASD Advocate)', status: 'online', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
                  { name: 'David K. (Occupational Therapist)', status: 'online', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
                  { name: 'Denver Autism Society', status: 'idle', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }
                ].map((user, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-zinc-800/50 border-zinc-800' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <img src={user.img} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className={`font-semibold block ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {user.name}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">Verified Mentor</span>
                      </div>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150 ${
            theme === 'dark' ? 'bg-zinc-900 text-white border border-zinc-800' : 'bg-white text-slate-900'
          }`}>
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-md">
                SENSORY EVENT SPECS
              </span>
              <h3 className="text-xl font-bold">{selectedEvent.metadata.title}</h3>
              <p className="text-xs text-zinc-400">Organized by {selectedEvent.metadata.organizer}</p>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed p-3 rounded-xl border ${
              theme === 'dark' ? 'bg-zinc-800/60 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-100 text-slate-700'
            }`}>
              {selectedEvent.metadata.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-400">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">{selectedEvent.metadata.location?.address}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(selectedEvent.metadata.date).toLocaleString()}</span>
              </div>
            </div>

            {/* Sensory Profile Grid */}
            <div className="p-4 bg-indigo-500/10 rounded-xl space-y-2 border border-indigo-500/20">
              <h4 className="font-bold text-indigo-300 text-xs">Verified Sensory Profile</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white'}`}>
                  <span className="text-zinc-400 block text-[10px]">Noise</span>
                  <span className="font-bold text-emerald-400">{selectedEvent.sensoryProfile.noiseLevel?.value || 'Low'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white'}`}>
                  <span className="text-zinc-400 block text-[10px]">Lighting</span>
                  <span className="font-bold text-amber-400">{selectedEvent.sensoryProfile.lighting?.value || 'Natural'}</span>
                </div>
                <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white'}`}>
                  <span className="text-zinc-400 block text-[10px]">Crowd</span>
                  <span className="font-bold text-blue-400">{selectedEvent.sensoryProfile.crowdDensity?.value || 'Low'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* PARENT TIPS MODAL */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative ${
            theme === 'dark' ? 'bg-zinc-900 text-white border border-zinc-800' : 'bg-white text-slate-900'
          }`}>
            <button
              onClick={() => setShowTipsModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold">Parent Sensory Preparation Guide</h3>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <h4 className="font-bold text-indigo-300 mb-1">1. Pre-Visit Social Stories</h4>
                <p>Show photos of the venue before visiting so your child knows transition expectations.</p>
              </div>

              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <h4 className="font-bold text-emerald-300 mb-1">2. Identify Quiet Nooks</h4>
                <p>Upon arrival, ask staff for the nearest designated Quiet Room or soft seating area.</p>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <h4 className="font-bold text-amber-300 mb-1">3. Pack Decompression Gear</h4>
                <p>Always carry noise-reducing headphones, fidget items, and familiar sensory items.</p>
              </div>
            </div>

            <button
              onClick={() => setShowTipsModal(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
