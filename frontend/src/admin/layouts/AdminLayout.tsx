import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    Shield,
    Settings,
    LogOut,
    Flag,
    Search,
    Bell,
    User,
    ChevronRight,
    ExternalLink,
    Menu,
    X,
    Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const isArabic = i18n.language === 'ar';

    const menuItems = [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
        { path: '/admin/users', icon: <Users size={18} />, label: t('user_management') },
        { path: '/admin/reports', icon: <Flag size={18} />, label: t('reports') },
        { path: '/admin/content', icon: <FileText size={18} />, label: t('content_control') },
        { path: '/admin/moderation', icon: <Shield size={18} />, label: t('moderation') },
        { path: '/admin/settings', icon: <Settings size={18} />, label: t('settings') },
    ];

    const getPathTitle = () => {
        const item = menuItems.find(i => i.path === location.pathname);
        return item ? item.label : t('admin_panel');
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-inter overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 z-50 bg-gray-900 text-white transition-all duration-300 lg:static lg:block w-72 
                ${isArabic ? 'right-0' : 'left-0'} 
                ${isSidebarOpen ? 'translate-x-0' : (isArabic ? 'translate-x-full' : '-translate-x-full')}
                lg:translate-x-0 ${!isSidebarOpen ? 'lg:w-20' : 'lg:w-72'}`}
            >
                <div className="flex flex-col h-full w-full overflow-hidden">
                    {/* Brand */}
                    <div className="flex h-20 items-center justify-between px-6 border-b border-white/10 shrink-0">
                        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'lg:hidden'}`}>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
                                <Shield className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-black tracking-tight whitespace-nowrap">{t('admin_panel')}</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Admin Profile */}
                    <div className={`px-4 py-6 border-b border-white/5 bg-white/5 mx-4 my-6 rounded-2xl transition-all duration-300 ${!isSidebarOpen && 'opacity-0 scale-95 lg:hidden'}`}>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden shadow-md">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white font-bold"><User size={20} /></div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">{user?.fullName || t('administrator')}</p>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{user?.role || t('super_admin')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                        <div className="mb-4">
                            <p className={`text-[10px] font-black tracking-widest text-white/30 uppercase px-4 mb-3 ${!isSidebarOpen && 'lg:hidden'}`}>
                                {t('main_menu')}
                            </p>
                            <ul className="space-y-1.5">
                                {menuItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive
                                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-white/40'}`}>
                                                    {item.icon}
                                                </div>
                                                <span className={`${!isSidebarOpen && 'lg:hidden'} whitespace-nowrap transition-all`}>{item.label}</span>
                                                {isActive && isSidebarOpen && (
                                                    <div className="ms-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Public Link */}
                        <div className="mt-8">
                            <p className={`text-[10px] font-black tracking-widest text-white/30 uppercase px-4 mb-3 ${!isSidebarOpen && 'lg:hidden'}`}>
                                {t('platform')}
                            </p>
                            <Link
                                to="/"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white transition-all group"
                            >
                                <div className="p-1 px-1.5 rounded bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                    <ExternalLink size={14} />
                                </div>
                                <span className={`${!isSidebarOpen && 'lg:hidden'}`}>{t('visit_site')}</span>
                            </Link>
                        </div>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 mt-auto">
                        <button
                            onClick={logout}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-4 text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-50 hover:text-white transition-all group overflow-hidden`}
                        >
                            <LogOut size={20} />
                            <span className={`${!isSidebarOpen && 'lg:hidden'}`}>{t('logout')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 lg:px-8 shrink-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 ring-1 ring-gray-100 dark:ring-gray-800"
                        >
                            <Menu size={20} className={isSidebarOpen ? 'rotate-90 transition-transform' : ''} />
                        </button>

                        <div className="flex items-center gap-2">
                            <h2 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white tracking-tight">{getPathTitle()}</h2>
                            <span className="hidden sm:inline-block text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded uppercase tracking-wider">Live</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-gray-900 shadow-sm text-gray-400">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                className="bg-transparent border-none text-sm focus:ring-0 w-32 lg:w-48 font-medium text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link to="/admin/notifications" className="relative p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all border border-gray-100 dark:border-gray-800">
                                <Bell size={20} />
                                <span className="absolute top-2.5 end-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
                            </Link>

                            <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-1"></div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{user?.fullName}</p>
                                    <div className="flex items-center gap-1 justify-end">
                                        <div className="h-1 w-1 rounded-full bg-green-500"></div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{t(user?.role?.toLowerCase() || 'admin')}</p>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 p-0.5 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800">
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&background=6366f1&color=fff`}
                                        className="h-full w-full object-cover rounded-lg"
                                        alt="avatar"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-[1600px] mx-auto animate-fadeInUp">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
