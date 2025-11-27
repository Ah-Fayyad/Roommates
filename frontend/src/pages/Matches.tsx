import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Heart, MessageCircle, MapPin, Star, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

interface Match {
    id: string;
    name: string;
    age: number;
    university: string;
    major: string;
    bio: string;
    image: string;
    matchScore: number;
    compatibility: {
        lifestyle: number;
        cleanliness: number;
        schedule: number;
        budget: number;
        interests: number;
    };
    topMatches: string[];
    verified: boolean;
}

const Matches = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isCalculating, setIsCalculating] = useState(true);

    // Simulate AI calculation
    useEffect(() => {
        setTimeout(() => {
            setMatches([
                {
                    id: '1',
                    name: 'Sarah Johnson',
                    age: 22,
                    university: 'Stanford University',
                    major: 'Computer Science',
                    bio: 'Clean, organized, and friendly. Love studying in quiet environments.',
                    image: 'https://i.pravatar.cc/300?img=1',
                    matchScore: 95,
                    compatibility: {
                        lifestyle: 98,
                        cleanliness: 95,
                        schedule: 92,
                        budget: 94,
                        interests: 96
                    },
                    topMatches: ['Study habits', 'Cleanliness', 'Budget'],
                    verified: true
                },
                {
                    id: '2',
                    name: 'Emily Chen',
                    age: 21,
                    university: 'MIT',
                    major: 'Engineering',
                    bio: 'Early bird, loves cooking and keeping things tidy.',
                    image: 'https://i.pravatar.cc/300?img=5',
                    matchScore: 88,
                    compatibility: {
                        lifestyle: 85,
                        cleanliness: 90,
                        schedule: 88,
                        budget: 87,
                        interests: 90
                    },
                    topMatches: ['Schedule', 'Cooking', 'Cleanliness'],
                    verified: true
                },
                {
                    id: '3',
                    name: 'Jessica Martinez',
                    age: 23,
                    university: 'Harvard',
                    major: 'Business',
                    bio: 'Social but respectful of personal space. Non-smoker.',
                    image: 'https://i.pravatar.cc/300?img=9',
                    matchScore: 82,
                    compatibility: {
                        lifestyle: 80,
                        cleanliness: 85,
                        schedule: 78,
                        budget: 88,
                        interests: 79
                    },
                    topMatches: ['Budget', 'Social life', 'Lifestyle'],
                    verified: false
                },
                {
                    id: '4',
                    name: 'Amanda Lee',
                    age: 20,
                    university: 'UCLA',
                    major: 'Psychology',
                    bio: 'Quiet, studious, and organized. Prefer minimal guests.',
                    image: 'https://i.pravatar.cc/300?img=16',
                    matchScore: 79,
                    compatibility: {
                        lifestyle: 82,
                        cleanliness: 88,
                        schedule: 75,
                        budget: 76,
                        interests: 74
                    },
                    topMatches: ['Study environment', 'Quiet hours', 'Organization'],
                    verified: true
                }
            ]);
            setIsCalculating(false);
        }, 2000);
    }, []);

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
                        AI is Finding Your Perfect Matches
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Analyzing compatibility based on your preferences...
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
                        <span>AI-Powered Matching</span>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                        Your Perfect Matches
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Found {matches.length} compatible roommates based on your preferences
                    </p>
                </div>

                {/* AI Insights */}
                <div className="glass animate-fadeInUp stagger-1 mb-8 rounded-2xl p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">AI Insights</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                            <div className="mb-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {matches.filter(m => m.matchScore >= 90).length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Excellent Matches (90%+)</div>
                        </div>
                        <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                            <div className="mb-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {matches.filter(m => m.verified).length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Verified Profiles</div>
                        </div>
                        <div className="rounded-xl bg-pink-50 p-4 dark:bg-pink-900/20">
                            <div className="mb-1 text-2xl font-bold text-pink-600 dark:text-pink-400">
                                {Math.round(matches.reduce((acc, m) => acc + m.matchScore, 0) / matches.length)}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Average Compatibility</div>
                        </div>
                    </div>
                </div>

                {/* Matches Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {matches.map((match, index) => (
                        <div
                            key={match.id}
                            className="card-hover glass animate-fadeInUp overflow-hidden rounded-2xl"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="relative h-64 md:h-auto md:w-48">
                                    <img
                                        src={match.image}
                                        alt={match.name}
                                        className="h-full w-full object-cover"
                                    />
                                    {match.verified && (
                                        <div className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                            ✓ Verified
                                        </div>
                                    )}
                                    {/* Match Score Badge */}
                                    <div className={`absolute bottom-3 left-3 rounded-xl ${getScoreBgColor(match.matchScore)} px-4 py-2 backdrop-blur-sm`}>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className={`h-5 w-5 ${getScoreColor(match.matchScore)}`} />
                                            <span className={`text-2xl font-bold ${getScoreColor(match.matchScore)}`}>
                                                {match.matchScore}%
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Match Score</div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="mb-4">
                                        <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                                            {match.name}, {match.age}
                                        </h3>
                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            {match.major} • {match.university}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">{match.bio}</p>
                                    </div>

                                    {/* Compatibility Breakdown */}
                                    <div className="mb-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-purple-500" />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                AI Compatibility Analysis
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {Object.entries(match.compatibility).map(([key, value]) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <div className="w-24 text-xs capitalize text-gray-600 dark:text-gray-400">
                                                        {key}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                                                style={{ width: `${value}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                        {value}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Matches */}
                                    <div className="mb-4">
                                        <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                            Top Compatibility Factors:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {match.topMatches.map((factor, idx) => (
                                                <span
                                                    key={idx}
                                                    className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white"
                                                >
                                                    ✓ {factor}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link to={`/chat/${match.id}`} className="flex-1">
                                            <Button variant="gradient" className="w-full">
                                                <MessageCircle className="mr-2 h-4 w-4" />
                                                Message
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="icon">
                                            <Heart className="h-5 w-5" />
                                        </Button>
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
                            No matches yet
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            Complete your profile to get AI-powered roommate recommendations
                        </p>
                        <Link to="/profile">
                            <Button variant="gradient">
                                Complete Profile
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;
