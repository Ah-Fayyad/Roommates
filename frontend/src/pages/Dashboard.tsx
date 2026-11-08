import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    MessageCircle,
    Heart,
    Sparkles,
    TrendingUp,
    Users,
    Calendar,
    ArrowRight,
    Eye,
    PlusCircle,
    Settings,
    Bell,
    ChevronRight,
    MapPin,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import axiosInstance from '../lib/axios';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [recentActivites, setRecentActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, these would be actual API calls
                // const statsRes = await axiosInstance.get('/analytics/user-stats');
                // setStats(statsRes.data);
                
                // Simulate loading for smooth transition
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
                setLoading(false);
            }
        };

        if (token) fetchDashboardData();
    }, [token]);

    const isLandlord = user?.role === 'LANDLORD';
    const isAdmin = user?.role === 'ADMIN';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="animate-pulse font-medium text-gray-500 dark:text-gray-400">{t('loading_dashboard')}...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen pb-20 pt-6"
        >
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header Section */}
                <motion.div variants={itemVariants} className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                             <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                {isLandlord ? t('landlord_panel') : t('student_panel')}
                             </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
                            {t('hello')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.fullName?.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                            {isLandlord ? t('dashboard_landlord_sub') : t('dashboard_user_sub')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-pink-500 border-2 border-white dark:border-gray-900"></span>
                        </Button>
                        <Link to="/settings">
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <motion.div variants={itemVariants} className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {isLandlord ? (
                        <>
                            <StatCard icon={Home} label={t('my_listings')} value="3" color="indigo" trend="+1" />
                            <StatCard icon={Eye} label={t('listing_views')} value="1.2k" color="purple" trend="+12%" />
                            <StatCard icon={MessageCircle} label={t('new_messages')} value="8" color="pink" trend="جديد" highlight />
                            <StatCard icon={Calendar} label={t('visit_requests')} value="5" color="green" />
                        </>
                    ) : (
                        <>
                            <StatCard icon={Sparkles} label={t('ai_matches')} value="14" color="indigo" trend="ممتاز" highlight />
                             <StatCard icon={Heart} label={t('favorites')} value="9" color="purple" />
                            <StatCard icon={MessageCircle} label={t('active_chats')} value="6" color="pink" trend="+2" />
                            <StatCard icon={TrendingUp} label={t('match_score')} value="94%" color="green" />
                        </>
                    )}
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Main Feed Area */}
                    <div className="space-y-8 lg:col-span-8">
                        
                        {/* Highlights / Primary Action Card */}
                        {!isLandlord && (
                             <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-500/20">
                                <div className="relative z-10 md:pr-40">
                                    <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t('find_perfect_roommate')}</h2>
                                    <p className="mb-6 text-indigo-100 opacity-90 text-lg">
                                        {t('smart_matching_desc')}
                                    </p>
                                    <Link to="/listings">
                                        <Button className="rounded-2xl px-8 py-6 text-lg font-bold bg-white text-indigo-600 hover:bg-indigo-50 border-none transition-transform hover:scale-105 active:scale-95 shadow-xl">
                                            {t('explore_listings')} <ArrowRight className="ml-2 h-5 w-5 shadow-none" />
                                        </Button>
                                    </Link>
                                </div>
                                <Sparkles className="absolute -right-8 -top-8 h-64 w-64 text-white/10 rotate-12" />
                             </motion.div>
                        )}

                        {/* Recent Messages Section */}
                        <motion.div variants={itemVariants} className="glass dark:bg-gray-800/40 rounded-[2.5rem] border border-white/20 p-8 shadow-xl">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
                                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                                        <MessageCircle className="h-6 w-6" />
                                    </div>
                                    {t('recent_messages')}
                                </h2>
                                <Link to="/chat" className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                                    {t('open_messenger')} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                                </Link>
                            </div>
                            
                            <div className="grid gap-3">
                                <MessageItem 
                                    name="سارة أحمد" 
                                    message={t('mock_msg_1')} 
                                    time="10د" 
                                    avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                                    unread={true}
                                />
                                <MessageItem 
                                    name="عمر خالد" 
                                    message={t('mock_msg_2')} 
                                    time="ساعتين" 
                                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                                />
                            </div>
                        </motion.div>

                        {/* Secondary Interactive Section */}
                        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
                             <div className="glass dark:bg-gray-800/40 rounded-[2rem] p-7 border border-white/20 shadow-lg">
                                <h3 className="mb-5 text-xl font-bold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                    {isLandlord ? t('upcoming_visits') : t('my_visit_requests')}
                                </h3>
                                <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl p-5 border border-dashed border-gray-300 dark:border-gray-700">
                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                         <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                                         <p className="text-gray-500 text-sm font-medium">{t('no_upcoming_visits')}</p>
                                         <Link to={isLandlord ? "/my-listings" : "/listings"} className="mt-4 text-xs font-bold text-indigo-600 hover:underline uppercase tracking-wider">
                                            {isLandlord ? t('add_new_listing') : t('book_a_visit')}
                                         </Link>
                                    </div>
                                </div>
                             </div>

                             <div className="glass dark:bg-gray-800/40 rounded-[2rem] p-7 border border-white/20 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp className="h-20 w-20" />
                                </div>
                                <h3 className="mb-5 text-xl font-bold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                    {t('profile_strength')}
                                </h3>
                                <div className="mb-4 flex items-end justify-between">
                                    <span className="text-4xl font-black text-indigo-600">85%</span>
                                    <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> {t('high_visibility')}
                                    </span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                                    ></motion.div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">{t('complete_profile_hint')}</p>
                             </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-8 lg:col-span-4">
                        
                        <motion.div variants={itemVariants} className="glass dark:bg-gray-800/40 rounded-[2.5rem] border border-white/20 p-8 shadow-xl">
                            <h2 className="mb-6 text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">{t('quick_actions')}</h2>
                            <div className="grid gap-4">
                                {isLandlord ? (
                                    <>
                                        <SidebarButton to="/listings/create" icon={PlusCircle} label={t('post_new_room')} color="indigo" variant="gradient" />
                                        <SidebarButton to="/my-listings" icon={Home} label={t('manage_listings')} color="indigo" />
                                        <SidebarButton to="/my-visits" icon={Calendar} label={t('visit_requests')} color="purple" />
                                        <SidebarButton to="/my-bookings" icon={Calendar} label={t('booking_requests', 'Booking Requests')} color="pink" />
                                    </>
                                ) : (
                                    <>
                                        <SidebarButton to="/listings" icon={PlusCircle} label={t('start_new_search')} color="indigo" variant="gradient" />
                                        <SidebarButton to="/favorites" icon={Heart} label={t('saved_rooms')} color="pink" />
                                        <SidebarButton to="/matches" icon={Users} label={t('find_roommates')} color="indigo" />
                                        <SidebarButton to="/my-bookings" icon={Calendar} label={t('my_bookings', 'My Bookings')} color="purple" />
                                    </>
                                )}
                                <hr className="my-2 border-gray-100 dark:border-gray-700" />
                                <SidebarButton to="/settings" icon={Settings} label={t('account_settings')} color="gray" />
                            </div>
                        </motion.div>

                        {/* Info Card - Local Area Match */}
                        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white shadow-2xl">
                             <div className="absolute top-0 right-0 p-6 opacity-30">
                                <MapPin className="h-32 w-32 -mr-12 -mt-12" />
                             </div>
                             <h3 className="mb-2 text-xl font-bold">{t('around_you')}</h3>
                             <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                {t('around_you_desc')}
                             </p>
                             <div className="flex -space-x-3 mb-6">
                                {[1,2,3,4].map(i => (
                                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} className="h-10 w-10 rounded-full border-4 border-slate-900" alt="" />
                                ))}
                                <div className="h-10 w-10 rounded-full border-4 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-bold">+12</div>
                             </div>
                             <Button variant="ghost" className="w-full justify-center gap-2 bg-white/10 hover:bg-white/20 border-none text-white rounded-2xl">
                                {t('view_on_map')} <MapPin className="h-4 w-4" />
                             </Button>
                        </motion.div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, trend, highlight }: { icon: any, label: string, value: string, color: string, trend?: string, highlight?: boolean }) => (
    <div className={`group relative glass dark:bg-gray-800/40 rounded-[2rem] p-7 transition-all hover:-translate-y-2 border border-white/20 shadow-lg ${highlight ? 'ring-2 ring-indigo-500/50' : ''}`}>
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${color}-50 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 transition-transform group-hover:rotate-12`}>
            <Icon className="h-7 w-7" />
        </div>
        <div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{value}</span>
                {trend && (
                    <span className={`mb-1 text-xs font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-700/50'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400 capitalize">{label}</div>
        </div>
    </div>
);

const MessageItem = ({ name, message, time, avatar, unread }: { name: string, message: string, time: string, avatar: string, unread?: boolean }) => (
    <Link to="/chat" className={`flex items-center gap-4 p-4 rounded-3xl transition-all border border-transparent ${unread ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-800/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}>
        <div className="relative">
            <img src={avatar} className="h-14 w-14 rounded-[1.25rem] object-cover ring-2 ring-white dark:ring-gray-800" alt="" />
            {unread && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white dark:border-gray-800 animate-bounce"></span>}
        </div>
        <div className="flex-1 text-start overflow-hidden">
            <div className="flex items-center justify-between">
                <h4 className={`font-bold text-gray-900 dark:text-white ${unread ? 'text-indigo-600' : ''}`}>{name}</h4>
                <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{time}</span>
            </div>
            <p className={`text-sm truncate ${unread ? 'text-gray-900 dark:text-gray-300 font-medium' : 'text-gray-500'}`}>{message}</p>
        </div>
    </Link>
);

const SidebarButton = ({ to, icon: Icon, label, color, variant = 'outline' }: { to: string, icon: any, label: string, color: string, variant?: 'outline' | 'gradient' }) => (
    <Link to={to}>
        <Button 
            className={`w-full justify-start gap-4 px-6 py-6 rounded-2xl group border-2 ${variant === 'outline' ? 'hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10' : ''}`} 
            variant={variant}
        >
            <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
                <Icon className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">{label}</span>
        </Button>
    </Link>
);

export default Dashboard;

