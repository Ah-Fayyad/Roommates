import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Search, Shield, Users, Heart, Sparkles, Home, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Landing = () => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated && user?.role === 'ADMIN') {
            navigate('/admin');
        }
    }, [isAuthenticated, user, navigate]);

    const features = [
        {
            icon: Users,
            title: t('smart_matching'),
            description: t('smart_matching_desc'),
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
        {
            icon: Shield,
            title: t('verified_profiles'),
            description: t('verified_profiles_desc'),
            color: 'text-pink-500',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20'
        },
        {
            icon: Heart,
            title: t('lifestyle_fit'),
            description: t('lifestyle_fit_desc'),
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            icon: Home,
            title: t('quality_listings'),
            description: t('quality_listings_desc'),
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
        {
            icon: MessageCircle,
            title: t('instant_chat'),
            description: t('instant_chat_desc'),
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            icon: Sparkles,
            title: t('ai_assistant'),
            description: t('ai_assistant_desc'),
            color: 'text-amber-500',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20'
        }
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-20 md:py-32">
                {/* Animated background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950"></div>
                    <div className="absolute start-1/4 top-20 h-96 w-96 animate-float rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20"></div>
                    <div className="absolute end-1/4 top-40 h-96 w-96 animate-float rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-600/20" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-1/2 h-96 w-96 animate-float rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-600/20" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="container mx-auto max-w-6xl text-center">
                    <div className="animate-fadeInUp">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-indigo-600 shadow-lg backdrop-blur-sm dark:bg-gray-800/80 dark:text-indigo-400">
                            <Sparkles className="h-4 w-4" />
                            <span>{t('ai_badge')}</span>
                        </div>
                    </div>

                    <h1 className="animate-fadeInUp stagger-1 mb-6 text-5xl font-extrabold tracking-tight md:text-7xl leading-tight text-gray-900 dark:text-white">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {t('hero_title_1')}
                        </span>
                        <br />
                        <span className="relative inline-block pb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {t('hero_title_2')}
                            <svg className="absolute -bottom-1 start-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                                <path d="M2 10C60 2 140 2 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="50%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h1>

                    <p className="animate-fadeInUp stagger-2 mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl">
                        {t('hero_subtitle1')}
                        <br className="hidden md:block" />
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{t('hero_subtitle2')}</span>
                    </p>

                    <div className="animate-fadeInUp stagger-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link to="/listings" className="w-full sm:w-auto">
                            <Button size="lg" className="btn-animate gradient-primary w-full border-0 px-8 py-6 text-lg font-semibold text-white shadow-xl hover:shadow-2xl sm:w-auto">
                                <Search className="me-2 h-5 w-5" />
                                {t('browse_listings')}
                            </Button>
                        </Link>
                        {!isAuthenticated ? (
                            <Link to="/signup" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full border-2 border-indigo-600 px-8 py-6 text-lg font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950 sm:w-auto">
                                    {t('create_account')}
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full border-2 border-purple-600 px-8 py-6 text-lg font-semibold text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950 sm:w-auto">
                                    {t('dashboard')}
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="animate-fadeInUp stagger-4 mt-16 grid grid-cols-3 gap-8">
                        <div className="glass rounded-2xl p-6">
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">10K+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats_users')}</div>
                        </div>
                        <div className="glass rounded-2xl p-6">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5K+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats_matches')}</div>
                        </div>
                        <div className="glass rounded-2xl p-6">
                            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">98%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats_satisfaction')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-20 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            {t('why_choose_us')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {t('everything_you_need')}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="card-hover group glass rounded-2xl p-8"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`mb-6 inline-flex rounded-2xl ${feature.bgColor} p-4 transition-transform duration-300 group-hover:scale-110`}>
                                        <Icon className={`h-8 w-8 ${feature.color}`} />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

                <div className="container relative mx-auto px-4 text-center">
                    <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                        {t('ready_to_find')}
                    </h2>
                    <p className="mb-8 text-xl text-white/90">
                        {t('join_thousands')}
                    </p>
                    <Link to={isAuthenticated ? "/listings" : "/signup"}>
                        <Button size="lg" className="btn-animate bg-white px-8 py-6 text-lg font-semibold text-indigo-600 hover:bg-gray-100">
                            {isAuthenticated ? t('browse_listings') : t('get_started_free')}
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
