import { useTranslation } from 'react-i18next';
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
    Settings
} from 'lucide-react';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [recentActivites, setRecentActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats and activity from backend if endpoints exist
                // For now using mock data based on role
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
                setLoading(false);
            }
        };

        if (token) fetchDashboardData();
    }, [token]);

    const isLandlord = user?.role === 'LANDLORD';

    if (loading) return <div className="flex h-screen items-center justify-center">{t('loading')}</div>;

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 animate-fadeInUp">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('welcome_back')}, {user?.fullName?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isLandlord
                            ? t('dashboard_landlord_sub')
                            : t('dashboard_user_sub')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fadeInUp stagger-1">
                    {isLandlord ? (
                        <>
                            <StatCard icon={Home} label={t('active_listings')} value="2" color="indigo" />
                            <StatCard icon={Eye} label={t('total_views')} value="1,280" color="purple" />
                            <StatCard icon={MessageCircle} label={t('new_inquiries')} value="5" color="pink" />
                            <StatCard icon={Calendar} label={t('booked_visits')} value="3" color="green" />
                        </>
                    ) : (
                        <>
                            <StatCard icon={Sparkles} label={t('smart_matches')} value="12" color="indigo" />
                            <StatCard icon={Heart} label={t('saved_rooms')} value="8" color="purple" />
                            <StatCard icon={MessageCircle} label={t('active_chats')} value="4" color="pink" />
                            <StatCard icon={TrendingUp} label={t('profile_strength')} value="85%" color="green" />
                        </>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content Area */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Recent Chats/Messages */}
                        <div className="glass rounded-3xl p-6 animate-fadeInUp stagger-2">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-indigo-600" />
                                    {t('recent_conversations')}
                                </h2>
                                <Link to="/chat" className="text-sm font-medium text-indigo-600 hover:underline">{t('view_all')}</Link>
                            </div>
                            <div className="space-y-4">
                                {/* Sample Chat Item */}
                                <Link to="/chat" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="h-12 w-12 rounded-full object-cover" alt="" />
                                    <div className="flex-1 text-start">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Sara Mousa</h3>
                                        <p className="text-sm text-gray-500 truncate">{t('mock_msg_1')}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">2m {t('ago')}</span>
                                </Link>
                                <Link to="/chat" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" className="h-12 w-12 rounded-full object-cover" alt="" />
                                    <div className="flex-1 text-start">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Omar Hassan</h3>
                                        <p className="text-sm text-gray-500 truncate">{t('mock_msg_2')}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">1h {t('ago')}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Visit Requests / Matches */}
                        <div className="glass rounded-3xl p-6 animate-fadeInUp stagger-3">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {isLandlord ? (
                                        <><Calendar className="h-5 w-5 text-indigo-600" /> {t('pending_visits')}</>
                                    ) : (
                                        <><Users className="h-5 w-5 text-indigo-600" /> {t('suggested_roommates')}</>
                                    )}
                                </h2>
                                <Link to={isLandlord ? "/visits" : "/matches"} className="text-sm font-medium text-indigo-600 hover:underline">{t('view_all')}</Link>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {isLandlord ? (
                                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-start">
                                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">{t('new_request')}</p>
                                        <h4 className="font-bold text-gray-900 dark:text-white mt-1">{t('mock_visit_title')}</h4>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" /> {t('tomorrow')}, 5:00 PM
                                        </div>
                                        <Button variant="gradient" size="sm" className="w-full mt-4">{t('confirm_visit')}</Button>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-start">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" className="h-10 w-10 rounded-full" alt="" />
                                            <h4 className="font-bold text-gray-900 dark:text-white">User 1</h4>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{t('compatibility_mock_p', { score: '92%' })}</p>
                                        <Button variant="outline" size="sm" className="w-full mt-4">{t('connect')}</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-8 animate-fadeInUp stagger-4">
                        <div className="glass rounded-3xl p-6 text-start">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{t('quick_actions')}</h2>
                            <div className="space-y-4">
                                {isLandlord ? (
                                    <>
                                        <Link to="/listings/create">
                                            <Button className="w-full justify-start gap-2" variant="gradient">
                                                <PlusCircle className="h-5 w-5" /> {t('post_new_room')}
                                            </Button>
                                        </Link>
                                        <Link to="/profile">
                                            <Button className="w-full justify-start gap-2" variant="outline">
                                                <Home className="h-5 w-5" /> {t('manage_listings')}
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/listings">
                                            <Button className="w-full justify-start gap-2" variant="gradient">
                                                <PlusCircle className="h-5 w-5" /> {t('start_search')}
                                            </Button>
                                        </Link>
                                        <Link to="/favorites">
                                            <Button className="w-full justify-start gap-2" variant="outline">
                                                <Heart className="h-5 w-5" /> {t('saved_rooms')}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                <Link to="/settings">
                                    <Button className="w-full justify-start gap-2" variant="ghost">
                                        <Settings className="h-5 w-5" /> {t('account_settings')}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* AI Tips Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-xl overflow-hidden relative group text-start">
                            <Sparkles className="absolute -right-4 -top-4 h-24 w-24 opacity-20 transform rotate-12 transition-transform duration-500 group-hover:scale-125" />
                            <h3 className="text-xl font-bold mb-2">{t('ai_tip_title')}</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                {isLandlord
                                    ? t('ai_tip_landlord')
                                    : t('ai_tip_user')}
                            </p>
                            <button className="mt-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                                {t('learn_more')} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
    <div className="glass rounded-3xl p-6 transition-all hover:scale-105">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400`}>
            <Icon className="h-6 w-6" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
);

export default Dashboard;
