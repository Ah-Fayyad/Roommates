import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { aiPricePredictor, type RoomFeatures, type PricePrediction } from '../lib/aiPricePredictor';
import {
    TrendingUp, TrendingDown, CheckCircle, AlertCircle, Sparkles,
    Info, Zap, Clock, BarChart3, Target, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

interface AIPriceSuggestionProps {
    features: RoomFeatures;
    currentPrice?: number;
    onPriceSelect?: (price: number) => void;
}

// -------------------------------------------------------
// EGP Formatter
// -------------------------------------------------------
const formatEGP = (amount: number, locale: string): string => {
    if (locale === 'ar') {
        return `${amount.toLocaleString('ar-EG')} ج.م`;
    }
    return `EGP ${amount.toLocaleString('en-US')}`;
};

// -------------------------------------------------------
// Insight Key → Localized Message Resolver
// -------------------------------------------------------
function resolveInsight(key: string, t: Function, lang: string): { emoji: string; text: string } {
    const parts = key.split(':');
    const type = parts[0];
    const value = parts[1];

    const insights: Record<string, { emoji: string; text: string }> = {
        ABOVE_MARKET:        { emoji: '💰', text: t('ai_insight_above_market', { pct: value }) },
        BELOW_MARKET:        { emoji: '✨', text: t('ai_insight_below_market', { pct: value }) },
        FAIR_MARKET:         { emoji: '✅', text: t('ai_insight_fair_market') },
        NEAR_CAMPUS:         { emoji: '📍', text: t('ai_insight_near_campus') },
        FAR_CAMPUS:          { emoji: '🚗', text: t('ai_insight_far_campus', { km: value }) },
        LARGE_ROOM:          { emoji: '🏠', text: t('ai_insight_large_room') },
        COMPACT_ROOM:        { emoji: '📦', text: t('ai_insight_compact_room') },
        FULLY_EQUIPPED:      { emoji: '⭐', text: t('ai_insight_fully_equipped', { count: value }) },
        LIMITED_AMENITIES:   { emoji: '⚠️', text: t('ai_insight_limited_amenities') },
        STUDIO_INDEPENDENCE: { emoji: '🏡', text: t('ai_insight_studio') },
        SHARED_BUDGET:       { emoji: '👥', text: t('ai_insight_shared') },
    };

    return insights[type] ?? { emoji: 'ℹ️', text: key };
}

// -------------------------------------------------------
// Loading Skeleton
// -------------------------------------------------------
const AISkeleton = () => {
    const { t } = useTranslation();
    return (
        <div className="glass animate-fadeIn rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 animate-pulse">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{t('ai_analyzing')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('ai_calculating_price')}</p>
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                {[0, 150, 300].map((delay) => (
                    <div
                        key={delay}
                        className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
            {/* Shimmer bars */}
            <div className="space-y-3 pt-2">
                {[100, 75, 50].map((w, i) => (
                    <div key={i} className={`h-3 w-${w === 100 ? 'full' : w === 75 ? '3/4' : '1/2'} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse`} />
                ))}
            </div>
        </div>
    );
};

// -------------------------------------------------------
// Main Component
// -------------------------------------------------------
const AIPriceSuggestion: React.FC<AIPriceSuggestionProps> = ({ features, currentPrice, onPriceSelect }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const isArabic = lang === 'ar';

    const [prediction, setPrediction] = useState<PricePrediction | null>(null);
    const [isCalculating, setIsCalculating] = useState(true);
    const [activeStrategy, setActiveStrategy] = useState<string>('recommended');

    useEffect(() => {
        setIsCalculating(true);
        setPrediction(null);
        const timer = setTimeout(() => {
            try {
                const result = aiPricePredictor.predictPrice(features);
                setPrediction(result);
            } catch (e) {
                console.error('AI Prediction error:', e);
            } finally {
                setIsCalculating(false);
            }
        }, 1800);
        return () => clearTimeout(timer);
    }, [features]);

    const suggestions = useMemo(() => {
        if (!features) return null;
        return aiPricePredictor.getSuggestedPrice(features);
    }, [features]);

    if (isCalculating) return <AISkeleton />;
    if (!prediction || !suggestions) return null;

    const isPriceSet = currentPrice !== undefined && currentPrice > 0;
    const priceStatus = isPriceSet
        ? currentPrice < prediction.priceRange.min ? 'low'
        : currentPrice > prediction.priceRange.max ? 'high'
        : 'good'
        : null;

    const resolvedInsights = prediction.insights.map(key => resolveInsight(key, t, lang));

    const demandColor = prediction.demandLevel === 'high' ? 'text-green-600' :
                        prediction.demandLevel === 'medium' ? 'text-amber-600' : 'text-red-600';
    const demandBg    = prediction.demandLevel === 'high' ? 'bg-green-50 dark:bg-green-900/20' :
                        prediction.demandLevel === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';

    const marketBg = prediction.marketComparison === 'below' ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
        : prediction.marketComparison === 'above' ? 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800'
        : 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800';

    const strategies = [
        {
            key: 'competitive',
            icon: '🎯',
            label: t('pricing_competitive'),
            price: suggestions.competitive,
            desc: t('pricing_competitive_desc'),
            border: 'border-sky-200 dark:border-sky-800 hover:border-sky-500',
            selectedBg: 'bg-sky-50 dark:bg-sky-900/30',
            badge: 'text-sky-600 bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300'
        },
        {
            key: 'recommended',
            icon: '⭐',
            label: t('pricing_recommended'),
            price: suggestions.recommended,
            desc: t('pricing_recommended_desc'),
            border: 'border-purple-200 dark:border-purple-800 hover:border-purple-500',
            selectedBg: 'bg-purple-50 dark:bg-purple-900/30',
            badge: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300'
        },
        {
            key: 'premium',
            icon: '💎',
            label: t('pricing_premium'),
            price: suggestions.premium,
            desc: t('pricing_premium_desc'),
            border: 'border-pink-200 dark:border-pink-800 hover:border-pink-500',
            selectedBg: 'bg-pink-50 dark:bg-pink-900/30',
            badge: 'text-pink-600 bg-pink-100 dark:bg-pink-900/50 dark:text-pink-300'
        },
        {
            key: 'budget',
            icon: '💰',
            label: t('pricing_budget'),
            price: suggestions.budget,
            desc: t('pricing_budget_desc'),
            border: 'border-green-200 dark:border-green-800 hover:border-green-500',
            selectedBg: 'bg-green-50 dark:bg-green-900/30',
            badge: 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300'
        },
    ];

    return (
        <div className="space-y-5 animate-fadeInUp">

            {/* ── HERO PREDICTION CARD ── */}
            <div className="glass overflow-hidden rounded-3xl shadow-xl">
                {/* Header gradient */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-bold opacity-90 uppercase tracking-widest">
                                {t('ai_price_recommendation')}
                            </span>
                        </div>

                        {/* Main Price */}
                        <div className={`flex items-end gap-3 mb-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <span className="text-6xl font-black tracking-tight">
                                {prediction.predictedPrice.toLocaleString(isArabic ? 'ar-EG' : 'en-US')}
                            </span>
                            <div className={`mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
                                <div className="text-2xl font-bold opacity-80">{isArabic ? 'ج.م' : 'EGP'}</div>
                                <div className="text-sm opacity-70">/{t('per_month_short')}</div>
                            </div>
                        </div>

                        {/* Confidence & stats row */}
                        <div className={`flex items-center gap-4 text-sm flex-wrap ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-bold">{prediction.confidence}% {t('confidence')}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                                <BarChart3 className="h-4 w-4" />
                                <span>{t('based_on_listings', { count: prediction.similarListings })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 rtl:divide-x-reverse border-b border-gray-100 dark:border-gray-800">
                    {/* Market Score */}
                    <div className="p-4 text-center">
                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {prediction.marketScore}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
                            {t('market_score')}
                        </div>
                    </div>
                    {/* Demand */}
                    <div className="p-4 text-center">
                        <div className={`text-sm font-black uppercase ${demandColor}`}>
                            {t(`demand_${prediction.demandLevel}`)}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
                            {t('demand_level')}
                        </div>
                    </div>
                    {/* Rental Speed */}
                    <div className="p-4 text-center">
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                            {prediction.rentalSpeedDays}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
                            {t('est_days_to_rent')}
                        </div>
                    </div>
                </div>

                {/* Price Range Indicator */}
                <div className="p-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-bold text-gray-700 dark:text-gray-300">{t('fair_price_range')}</span>
                        <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
                            {formatEGP(prediction.priceRange.min, lang)} — {formatEGP(prediction.priceRange.max, lang)}
                        </span>
                    </div>
                    <div className="relative h-4 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-full" />
                        {/* Predicted marker */}
                        <div
                            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-md rounded-full"
                            style={{ left: '50%', transform: 'translateX(-50%)' }}
                        />
                        {/* Current price marker */}
                        {isPriceSet && (
                            <div
                                className="absolute top-0 bottom-0 w-1.5 bg-amber-500 shadow-md rounded-full"
                                style={{
                                    left: `${Math.min(100, Math.max(0, ((currentPrice - prediction.priceRange.min) / (prediction.priceRange.max - prediction.priceRange.min)) * 100))}%`,
                                    transform: 'translateX(-50%)'
                                }}
                            />
                        )}
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">
                        <span>{t('min')}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{t('ai_recommended')}</span>
                        <span>{t('max')}</span>
                    </div>
                </div>

                {/* Market Comparison */}
                <div className={`mx-6 mb-6 rounded-2xl p-4 bg-gradient-to-r border ${marketBg} flex items-center gap-3`}>
                    {prediction.marketComparison === 'below' ? (
                        <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0" />
                    ) : prediction.marketComparison === 'above' ? (
                        <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
                    ) : (
                        <Minus className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                    <div>
                        <div className="font-black text-gray-900 dark:text-white text-sm">
                            {prediction.marketComparison === 'below' ? t('market_below')
                            : prediction.marketComparison === 'above' ? t('market_above')
                            : t('market_fair')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t('market_avg')}: {formatEGP(Math.round(prediction.predictedPrice / (prediction.marketComparison === 'above' ? 1.1 : prediction.marketComparison === 'below' ? 0.9 : 1)), lang)}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PRICING STRATEGIES ── */}
            <div className="glass rounded-3xl p-6">
                <h3 className="mb-4 font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    {t('pricing_strategies')}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {strategies.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => {
                                setActiveStrategy(s.key);
                                onPriceSelect?.(s.price);
                            }}
                            className={`group rounded-2xl border-2 p-4 text-start transition-all ${s.border} ${activeStrategy === s.key ? s.selectedBg + ' ring-2 ring-offset-2 ring-indigo-500/30' : ''}`}
                        >
                            <div className={`mb-2 text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit ${s.badge}`}>
                                {s.icon} {s.label}
                            </div>
                            <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                                {formatEGP(s.price, lang)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── AI INSIGHTS ── */}
            <div className="glass rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-black text-gray-900 dark:text-white">{t('ai_insights')}</h3>
                </div>
                <div className="space-y-3">
                    {resolvedInsights.map((insight, index) => (
                        <div
                            key={index}
                            className="flex gap-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 animate-fadeInUp group hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className="text-2xl shrink-0">{insight.emoji}</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{insight.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CURRENT PRICE STATUS ── */}
            {isPriceSet && priceStatus && (
                <div className={`glass rounded-3xl p-6 border-2 ${
                    priceStatus === 'low' ? 'border-amber-400 dark:border-amber-600'
                    : priceStatus === 'high' ? 'border-red-400 dark:border-red-600'
                    : 'border-green-400 dark:border-green-600'
                }`}>
                    <div className="flex items-center gap-4">
                        {priceStatus === 'low' ? (
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <ArrowUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        ) : priceStatus === 'high' ? (
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        )}
                        <div>
                            <h4 className="font-black text-gray-900 dark:text-white">
                                {priceStatus === 'low' ? t('price_below_recommendation')
                                : priceStatus === 'high' ? t('price_above_recommendation')
                                : t('price_great')}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {priceStatus === 'low'
                                    ? t('price_increase_suggestion', { amount: formatEGP(prediction.predictedPrice - currentPrice, lang) })
                                : priceStatus === 'high'
                                    ? t('price_decrease_suggestion', { amount: formatEGP(currentPrice - prediction.predictedPrice, lang) })
                                    : t('price_optimal_range')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIPriceSuggestion;
