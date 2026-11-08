import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Search, Shield, Users, Heart, Sparkles, Home, MessageCircle,
  MapPin, Star, ChevronRight, Calendar, Globe, Award,
  Zap, CheckCircle, ArrowRight, Waves, Mountain, Building,
  Camera, Plane, Coffee, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Destination Data ─────────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    id: 'cairo',
    name: 'Cairo',
    nameAr: 'القاهرة',
    tagline: 'Where History Meets Modernity',
    taglineAr: 'حيث يلتقي التاريخ بالحداثة',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&auto=format&fit=crop',
    listings: '120+',
    icon: Building,
    color: 'from-amber-500 to-orange-600',
    query: 'Cairo'
  },
  {
    id: 'sharm',
    name: 'Sharm El-Sheikh',
    nameAr: 'شرم الشيخ',
    tagline: 'Dive into the Red Sea Paradise',
    taglineAr: 'انغمس في جنة البحر الأحمر',
    image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&auto=format&fit=crop',
    listings: '85+',
    icon: Waves,
    color: 'from-cyan-500 to-blue-600',
    query: 'Sharm'
  },
  {
    id: 'hurghada',
    name: 'Hurghada',
    nameAr: 'الغردقة',
    tagline: 'Sun, Sand & Crystal Waters',
    taglineAr: 'شمس ورمال ومياه بلورية',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    listings: '70+',
    icon: Sun,
    color: 'from-orange-400 to-pink-500',
    query: 'Hurghada'
  },
  {
    id: 'luxor',
    name: 'Luxor',
    nameAr: 'الأقصر',
    tagline: 'World\'s Greatest Open Air Museum',
    taglineAr: 'أعظم متحف مفتوح في العالم',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&auto=format&fit=crop',
    listings: '45+',
    icon: Mountain,
    color: 'from-purple-500 to-indigo-600',
    query: 'Luxor'
  },
  {
    id: 'alex',
    name: 'Alexandria',
    nameAr: 'الإسكندرية',
    tagline: 'The Mediterranean Jewel of Egypt',
    taglineAr: 'جوهرة البحر المتوسط',
    image: 'https://images.unsplash.com/photo-1536859975388-b5e6623e9223?w=800&auto=format&fit=crop',
    listings: '60+',
    icon: Globe,
    color: 'from-blue-400 to-teal-500',
    query: 'Alexandria'
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Emma Richardson',
    country: '🇬🇧 UK',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=b6e3f4',
    text: 'Found an incredible Nile-view apartment in Zamalek within minutes. The booking process was seamless and the host was amazing!',
    rating: 5,
    stay: 'Zamalek, Cairo — 7 nights',
  },
  {
    name: 'Carlos Mendez',
    country: '🇲🇽 Mexico',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=ffd5dc',
    text: 'The beachfront chalet in Sharm was beyond our expectations. Direct Red Sea access and the coral reef was just steps away!',
    rating: 5,
    stay: 'Sharm El-Sheikh — 5 nights',
  },
  {
    name: 'Yuki Tanaka',
    country: '🇯🇵 Japan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuki&backgroundColor=c0aede',
    text: 'Stayed near Luxor Temple and it was magical. Watched the Sound & Light show every night from our rooftop. Unforgettable!',
    rating: 5,
    stay: 'Luxor East Bank — 4 nights',
  },
];

// ─── Why Choose Us Features ───────────────────────────────────────────────────
const getFeatures = (t: (key: string) => string) => [
  { icon: Shield, title: t('verified_profiles'), description: t('verified_profiles_desc'), color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: Zap, title: 'Instant Booking', description: 'Book your stay instantly with real-time availability confirmation', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: CheckCircle, title: 'Best Price Guarantee', description: 'We match any lower price you find for the same property', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: MessageCircle, title: t('instant_chat'), description: t('instant_chat_desc'), color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { icon: Users, title: t('smart_matching'), description: t('smart_matching_desc'), color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { icon: Sparkles, title: t('ai_assistant'), description: t('ai_assistant_desc'), color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

// ─── Hero Search Bar ──────────────────────────────────────────────────────────
const HeroSearchBar = ({ isArabic }: { isArabic: boolean }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [activeTab, setActiveTab] = useState<'tourist' | 'student'>('tourist');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab === 'tourist') {
      params.set('category', 'VACATION_RENTAL');
      if (city) params.set('search', city);
    } else {
      params.set('category', 'STUDENT_HOUSING');
      if (city) params.set('search', city);
    }
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1.5 mb-4 border border-white/30 w-fit mx-auto gap-2">
        <button
          onClick={() => setActiveTab('tourist')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'tourist' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/20'}`}
        >
          <Plane className="h-4 w-4" />
          {isArabic ? 'سياحة وإجازات' : 'Vacation Stays'}
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'student' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white hover:bg-white/20'}`}
        >
          <Home className="h-4 w-4" />
          {isArabic ? 'سكن طلابي' : 'Student Housing'}
        </button>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 border border-white/50">
        {/* City / Where */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
          <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {isArabic ? 'الوجهة' : 'Where'}
            </div>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder={isArabic ? 'القاهرة، شرم الشيخ، الغردقة...' : 'Cairo, Sharm, Hurghada...'}
              className="w-full text-gray-900 dark:text-white font-semibold bg-transparent border-none outline-none placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 my-2" />

        {/* Check In */}
        {activeTab === 'tourist' && (
          <>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Calendar className="h-5 w-5 text-indigo-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{isArabic ? 'الوصول' : 'Check In'}</div>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="text-gray-900 dark:text-white font-semibold bg-transparent border-none outline-none text-sm"
                />
              </div>
            </div>
            <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 my-2" />
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Calendar className="h-5 w-5 text-indigo-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{isArabic ? 'المغادرة' : 'Check Out'}</div>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="text-gray-900 dark:text-white font-semibold bg-transparent border-none outline-none text-sm"
                />
              </div>
            </div>
            <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 my-2" />
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Users className="h-5 w-5 text-indigo-500 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{isArabic ? 'الضيوف' : 'Guests'}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">-</button>
                  <span className="text-gray-900 dark:text-white font-semibold text-sm w-4 text-center">{guests}</span>
                  <button onClick={() => setGuests(g => Math.min(10, g + 1))} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl min-w-[120px]"
        >
          <Search className="h-5 w-5" />
          {isArabic ? 'بحث' : 'Search'}
        </button>
      </div>
    </div>
  );
};

// ─── Main Landing Component ───────────────────────────────────────────────────
const Landing = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured vacation rentals
  useEffect(() => {
    axios.get(`${API_BASE_URL}/listings?category=VACATION_RENTAL&limit=6`)
      .then(res => {
        const data = res.data?.listings || res.data || [];
        setFeaturedListings(Array.isArray(data) ? data.slice(0, 6) : []);
      })
      .catch(() => setFeaturedListings([]));
  }, []);

  const features = getFeatures(t);

  return (
    <div className="flex flex-col overflow-x-hidden">

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Full-bleed background image with overlay */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1920&auto=format&fit=crop&q=80"
            alt="Egypt"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-purple-900/70 to-indigo-900/90" />
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 animate-float"
                style={{
                  width: `${20 + Math.random() * 60}px`,
                  height: `${20 + Math.random() * 60}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          {/* Badge */}
          <div className="animate-fadeInUp mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-white border border-white/20 shadow-lg">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>{isArabic ? 'منصة السكن الذكي رقم #1 في مصر 🇪🇬' : '#1 Smart Stay Platform in Egypt 🇪🇬'}</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fadeInUp stagger-1 mb-6 text-5xl font-black tracking-tight md:text-7xl leading-[1.1] text-white">
            {isArabic ? (
              <>
                <span className="block">اكتشف مصر</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  كما لم تعشها من قبل
                </span>
              </>
            ) : (
              <>
                <span className="block">Discover Egypt</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="animate-fadeInUp stagger-2 mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl leading-relaxed">
            {isArabic
              ? 'من شقق النيل الفاخرة في الزمالك إلى شاليهات الشعاب المرجانية في شرم الشيخ — اعثر على إقامتك المثالية في مصر'
              : 'From luxury Nile-view apartments in Zamalek to coral-reef chalets in Sharm El-Sheikh — find your perfect Egyptian stay'
            }
          </p>

          {/* Hero Search */}
          <div className="animate-fadeInUp stagger-3">
            <HeroSearchBar isArabic={isArabic} />
          </div>

          {/* Trust Badges */}
          <div className="animate-fadeInUp stagger-4 mt-10 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>{isArabic ? 'حجز فوري مضمون' : 'Instant Booking'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span>{isArabic ? 'عقارات موثقة 100%' : '100% Verified Properties'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>{isArabic ? 'أفضل الأسعار مضمونة' : 'Best Price Guarantee'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-pink-400" />
              <span>{isArabic ? '+5000 مراجعة 5 نجوم' : '5,000+ Five-Star Reviews'}</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full animate-[slideDown_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS SECTION ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-3">
              <MapPin className="h-4 w-4" />
              {isArabic ? 'وجهاتنا المميزة' : 'Featured Destinations'}
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              {isArabic ? 'استكشف مصر من أجمل ما فيها' : 'Explore the Best of Egypt'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isArabic
                ? 'من قلب القاهرة التاريخية إلى شواطئ البحر الأحمر الرائعة — مصر تنتظرك'
                : 'From historic Cairo to the stunning Red Sea coast — Egypt is waiting for you'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DESTINATIONS.map((dest, idx) => {
              const Icon = dest.icon;
              return (
                <Link
                  key={dest.id}
                  to={`/listings?category=VACATION_RENTAL&search=${dest.query}`}
                  className="group relative overflow-hidden rounded-3xl aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${dest.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="mb-2">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${dest.color} text-white text-xs font-bold mb-2`}>
                        <Icon className="h-3 w-3" />
                        {dest.listings}
                      </div>
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight">
                      {isArabic ? dest.nameAr : dest.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-1 line-clamp-2 leading-snug">
                      {isArabic ? dest.taglineAr : dest.tagline}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-white/0 group-hover:text-white/90 transition-colors duration-300 text-xs font-bold">
                      {isArabic ? 'اكتشف الآن' : 'Explore Now'}
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED VACATION RENTALS ─────────────────────────────────────────── */}
      {featuredListings.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-sm uppercase tracking-widest mb-3">
                  <Heart className="h-4 w-4" />
                  {isArabic ? 'الأكثر طلباً' : 'Most Loved Stays'}
                </div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                  {isArabic ? 'عقارات مختارة بعناية' : 'Hand-Picked Properties'}
                </h2>
              </div>
              <Link to="/listings?category=VACATION_RENTAL" className="hidden md:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all">
                {isArabic ? 'عرض الكل' : 'View All'}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <FeaturedListingCard key={listing.id} listing={listing} isArabic={isArabic} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to="/listings?category=VACATION_RENTAL">
                <Button variant="outline" className="gap-2">
                  {isArabic ? 'عرض كل العقارات' : 'View All Properties'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              {isArabic ? 'كيف يعمل؟' : 'How It Works'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isArabic ? '٣ خطوات فقط لتحجز إقامتك المثالية' : 'Just 3 steps to book your perfect stay'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: Search,
                title: isArabic ? 'ابحث عن وجهتك' : 'Search Your Destination',
                desc: isArabic ? 'اختر مدينتك وتواريخ إقامتك وعدد الضيوف' : 'Choose your city, dates, and number of guests',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                step: '02',
                icon: Heart,
                title: isArabic ? 'اختر عقارك' : 'Choose Your Property',
                desc: isArabic ? 'تصفح المئات من العقارات الموثقة بصور عالية الجودة' : 'Browse hundreds of verified properties with high-quality photos',
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: isArabic ? 'احجز وتمتع' : 'Book & Enjoy',
                desc: isArabic ? 'احجز فوراً وتلقى التأكيد في ثوانٍ' : 'Book instantly and receive confirmation in seconds',
                color: 'from-pink-500 to-orange-500',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative text-center group">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-14 left-[calc(50%+60px)] right-0 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-gradient-to-br ${item.color} shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-black shadow-lg`}>
                      {item.step}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-widest mb-3">
              <Star className="h-4 w-4" />
              {isArabic ? 'آراء ضيوفنا' : 'Guest Reviews'}
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">
              {isArabic ? 'لماذا يحبنا المسافرون' : 'Why Travelers Love Us'}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Active testimonial */}
            <div className="glass rounded-3xl p-8 md:p-12 text-center shadow-xl transition-all duration-500">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
                "{TESTIMONIALS[activeTestimonial].text}"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="w-16 h-16 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900"
                />
                <div className="text-left">
                  <div className="font-black text-gray-900 dark:text-white">{TESTIMONIALS[activeTestimonial].name}</div>
                  <div className="text-sm text-gray-500">{TESTIMONIALS[activeTestimonial].country}</div>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    📍 {TESTIMONIALS[activeTestimonial].stay}
                  </div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${i === activeTestimonial ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {[
              { value: '10K+', label: isArabic ? 'مستخدم نشط' : 'Active Users', color: 'text-indigo-600' },
              { value: '5K+', label: isArabic ? 'حجز ناجح' : 'Successful Bookings', color: 'text-purple-600' },
              { value: '320+', label: isArabic ? 'عقار موثق' : 'Verified Properties', color: 'text-pink-600' },
              { value: '98%', label: isArabic ? 'رضا الضيوف' : 'Guest Satisfaction', color: 'text-emerald-600' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              {t('why_choose_us')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('everything_you_need')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-hover group glass rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`mb-6 inline-flex rounded-2xl ${feature.bg} p-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="mb-3 text-xl font-black text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STUDENT HOUSING CTA ──────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&auto=format&fit=crop&q=40')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm font-bold mb-6">
              <Home className="h-4 w-4" />
              {isArabic ? 'للطلاب الجامعيين' : 'For University Students'}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              {isArabic ? 'ابحث عن سكنك الجامعي المثالي' : 'Find Your Perfect Student Housing'}
            </h2>
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              {isArabic
                ? 'الآلاف من الغرف الموثقة بالقرب من الجامعات المصرية — اعثر على الغرفة المثالية بالسعر المناسب'
                : 'Thousands of verified rooms near Egyptian universities — find the perfect room at the right price'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/listings?category=STUDENT_HOUSING">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 font-black px-8 py-6 text-lg rounded-2xl shadow-xl">
                  <Search className="me-2 h-5 w-5" />
                  {isArabic ? 'ابحث عن سكن طلابي' : 'Find Student Housing'}
                </Button>
              </Link>
              <Link to={isAuthenticated ? '/listings' : '/signup'}>
                <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 font-black px-8 py-6 text-lg rounded-2xl">
                  {isAuthenticated ? (isArabic ? 'استكشف الكل' : 'Explore All') : (isArabic ? 'سجل مجاناً' : 'Sign Up Free')}
                  <ArrowRight className="ms-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-float"
              style={{
                width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
                left: `${10 + i * 15}%`, top: `${10 + (i % 3) * 30}%`,
                opacity: 0.2, animationDelay: `${i * 0.8}s`
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="mb-6 text-4xl font-black text-white md:text-6xl leading-tight">
              {isArabic ? 'ابدأ رحلتك الآن' : 'Start Your Journey Today'}
            </h2>
            <p className="mb-10 text-xl text-white/85 leading-relaxed">
              {isArabic
                ? 'انضم إلى أكثر من ١٠٠٠٠ مستخدم وجدوا بيتهم الثاني معنا'
                : 'Join over 10,000 users who found their perfect stay with us'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/listings?category=VACATION_RENTAL" : "/signup"}>
                <Button size="lg" className="btn-animate bg-white px-10 py-7 text-lg font-black text-indigo-600 hover:bg-gray-100 rounded-2xl shadow-2xl">
                  {isAuthenticated
                    ? (isArabic ? 'استكشف العقارات' : 'Explore Properties')
                    : (isArabic ? 'ابدأ مجاناً 🚀' : 'Get Started Free 🚀')
                  }
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold px-10 py-7 text-lg rounded-2xl">
                    {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Featured Listing Card ────────────────────────────────────────────────────
const FeaturedListingCard = ({ listing, isArabic }: { listing: any; isArabic: boolean }) => {
  const [imgSrc, setImgSrc] = useState(listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600');
  return (
    <Link to={`/listings/${listing.id}`} className="group block">
      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={imgSrc}
            alt={listing.title}
            onError={() => setImgSrc('https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600')}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
              {isArabic ? 'سياحي' : 'Vacation'}
            </span>
            {listing.viewsCount > 100 && (
              <span className="bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                🔥 {isArabic ? 'الأكثر طلباً' : 'Popular'}
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-600 shadow">
              {isArabic ? 'عرض التفاصيل' : 'View Details'} →
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-black text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {listing.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-pink-500" />
            <span className="truncate">{listing.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {(listing.dailyPrice || listing.price || 0).toLocaleString()}
                </span>
                <span className="text-sm font-bold text-gray-500">
                  EGP/{isArabic ? 'ليلة' : 'night'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold">4.9</span>
              <span className="text-gray-400">(24)</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Landing;
