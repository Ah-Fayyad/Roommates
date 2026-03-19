import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/constants';
import { Button } from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';
import {
    Users,
    Home,
    MessageCircle,
    TrendingUp,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    Activity,
    FileText,
    ChevronRight,
    Sparkles
} from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    activeListings: number;
    messagesCount: number;
    matchesCount: number;
}

const Dashboard = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeListings: 0,
        messagesCount: 0,
        matchesCount: 0
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchActivity();
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchActivity = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/activity`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activity', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            label: t('total_users'),
            value: stats.totalUsers,
            change: '+12%',
            icon: Users,
            color: 'indigo'
        },
        {
            label: t('active_listings'),
            value: stats.activeListings,
            change: '+8%',
            icon: Home,
            color: 'purple'
        },
        {
            label: t('messages_today'),
            value: stats.messagesCount,
            change: '+24%',
            icon: MessageCircle,
            color: 'pink'
        },
        {
            label: t('matches_made'),
            value: stats.matchesCount,
            change: '+15%',
            icon: TrendingUp,
            color: 'green'
        }
    ];

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">{t('loading')}</div>;
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Page Title & Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="animate-slideInLeft">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {t('welcome_back')}, <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">{user?.fullName || 'Admin'}</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-500 animate-pulse" />
                        {t('platform_summary_desc')}
                    </p>
                </div>
                <div className="flex items-center gap-3 animate-slideInRight">
                    <Button variant="outline" className="rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-bold text-xs uppercase tracking-wider">
                        <FileText size={14} className="me-2" />
                        {t('export_data')}
                    </Button>
                    <Link to="/admin/reports">
                        <Button className="rounded-xl gradient-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                            {t('view_all_reports')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className={`absolute top-0 end-0 h-24 w-24 -me-8 -mt-8 rounded-full bg-${stat.color}-500/5 blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors`}></div>

                            <div className="flex items-start justify-between relative">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="flex items-center gap-1 text-xs font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                        <TrendingUp size={12} />
                                        {stat.change}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 relative">
                                <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    {(stat.value || 0).toLocaleString()}
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {stat.label}
                                </div>
                            </div>

                            <div className="mt-4 h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full bg-${stat.color}-500 rounded-full w-[70%] group-hover:w-[85%] transition-all duration-1000 ease-out`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Platform Command Center */}
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {t('global_pulse')}
                                </h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('live_platform_metrics')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/30">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('server_load')}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">24%</span>
                                    <span className="text-[10px] font-bold text-green-500 mb-1">-2%</span>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-800/30">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('api_latency')}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">142ms</span>
                                <span className="text-[10px] font-bold text-green-500 mb-1">{t('optimal')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{t('pending_reports')}</p>
                                </div>
                                <span className="text-lg font-black text-orange-600 group-hover:scale-110 transition-transform">04</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{t('verified_listings')}</p>
                                </div>
                                <span className="text-lg font-black text-green-600 group-hover:scale-110 transition-transform">12</span>
                            </div>
                        </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {t('audit_logs')}
                                </h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('latest_admin_decisions')}</p>
                            </div>
                            <button className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">{t('view_all')}</button>
                        </div>

                        <div className="space-y-4">
                            {activities.slice(0, 5).map((activity, idx) => {
                                const actionType = activity.actionType || '';
                                const isBan = actionType.includes('BAN');
                                const isApprove = actionType.includes('APPROVE');
                                const Icon = isBan ? AlertTriangle : isApprove ? CheckCircle : Shield;
                                const color = isBan ? 'red' : isApprove ? 'green' : 'indigo';

                                return (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
                                        <div className={`h-12 w-12 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 flex items-center justify-center border border-${color}-100 dark:border-${color}-800/50`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-${color}-100 dark:bg-${color}-900/40 text-${color}-700 dark:text-${color}-300`}>
                                                    {actionType.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {t('by_label')} <span className="text-indigo-600">{activity.admin?.fullName || t('system')}</span>
                                            </p>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 rtl:rotate-180" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-6">{t('quick_actions')}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Link to="/admin/users" className="block p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <Users size={18} className="text-gray-400 group-hover:text-indigo-600" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('manage_users')}</span>
                                </div>
                            </Link>

                            <Link to="/admin/moderation" className="block p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-purple-100 dark:hover:border-purple-900/30 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <Shield size={18} className="text-gray-400 group-hover:text-purple-600" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('review_listings')}</span>
                                </div>
                            </Link>

                            <Link to="/admin/reports" className="block p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={18} className="text-gray-400 group-hover:text-red-600" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('handle_reports')}</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden group">
                        <div className="absolute top-0 end-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Sparkles size={120} />
                        </div>
                        <h4 className="text-lg font-black tracking-tight mb-2">{t('admin_core_title')}</h4>
                        <p className="text-white/70 text-sm font-medium mb-6">{t('admin_core_desc')}</p>
                        <Button className="w-full bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                            {t('whats_new')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
