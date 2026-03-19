import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Heart, MessageCircle, MapPin, Star, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/constants';
import { useTranslation } from 'react-i18next';

interface Match {
    user: {
        id: string;
        fullName: string;
        avatar: string;
        university: string;
        bio: string;
        isVerified: boolean;
    };
    score: number;
    insights: string[];
}

const Matches = () => {
    const { t } = useTranslation();
    const { token } = useAuth();
    const [matches, setMatches] = useState<Match[]>([]);
    const [isCalculating, setIsCalculating] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/matches`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMatches(response.data);
            } catch (error) {
                console.error('Failed to fetch matches', error);
            } finally {
                setIsCalculating(false);
            }
        };

        if (token) fetchMatches();
    }, [token]);

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 80) return 'text-blue-600 dark:text-blue-400';
        if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-50 dark:bg-green-900/20';
        if (score >= 80) return 'bg-blue-50 dark:bg-blue-900/20';
        if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20';
        return 'bg-gray-50 dark:bg-gray-900/20';
    };

    if (isCalculating) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
                        <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {t('finding_matches')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('analyzing_compatibility')}
                    </p>
                    <div className="mt-6 flex justify-center gap-2">
                        <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-3 w-3 animate-bounce rounded-full bg-purple-600" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-3 w-3 animate-bounce rounded-full bg-pink-600" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 animate-fadeInUp">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                        <Sparkles className="h-4 w-4" />
                        <span>{t('ai_powered_matching')}</span>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                        {t('your_perfect_matches')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t('found_matches_desc', { count: matches.length })}
                    </p>
                </div>

                {/* AI Insights Summary */}
                <div className="glass animate-fadeInUp stagger-1 mb-8 rounded-2xl p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('ai_compatibility_overview')}</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                            <div className="mb-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {matches.filter(m => m.score >= 75).length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('great_matches')}</div>
                        </div>
                        <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                            <div className="mb-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length) : 0}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('average_match_score')}</div>
                        </div>
                    </div>
                </div>

                {/* Matches Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {matches.map((match, index) => (
                        <div
                            key={match.user.id}
                            className="card-hover glass animate-fadeInUp overflow-hidden rounded-2xl"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="relative h-64 md:h-auto md:w-48">
                                    <img
                                        src={match.user.avatar || 'https://images.unsplash.com/photo-1535711861845-e1fc4c208451?q=80&w=400'}
                                        alt={match.user.fullName}
                                        className="h-full w-full object-cover"
                                    />
                                    {match.user.isVerified && (
                                        <div className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                            ✓ {t('verified')}
                                        </div>
                                    )}
                                    <div className={`absolute bottom-3 left-3 rounded-xl ${getScoreBgColor(match.score)} px-4 py-2 backdrop-blur-sm`}>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className={`h-5 w-5 ${getScoreColor(match.score)}`} />
                                            <span className={`text-2xl font-bold ${getScoreColor(match.score)}`}>
                                                {match.score}%
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{t('match_score')}</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="mb-4">
                                        <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                                            {match.user.fullName}
                                        </h3>
                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            {match.user.university}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 italic">"{match.user.bio}"</p>
                                    </div>

                                    {/* AI Insights & Detailed Analysis */}
                                    <div className="mb-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-purple-500" />
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                                {t('ai_compatibility_logic')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {match.insights.map((insight, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500"></div>
                                                    {insight}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link to={`/chat/${match.user.id}`} className="flex-1">
                                            <Button variant="gradient" className="w-full">
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                {t('start_conversation')}
                                            </Button>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Matches */}
                {matches.length === 0 && (
                    <div className="glass animate-fadeIn rounded-2xl p-12 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Users className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            {t('no_matches_yet')}
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            {t('complete_profile_desc_matches')}
                        </p>
                        <Link to="/profile">
                            <Button variant="gradient">
                                {t('complete_profile')}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;
