import React, { useState, useEffect } from 'react';
import { aiPricePredictor, type RoomFeatures, type PricePrediction } from '../lib/aiPricePredictor';
import { TrendingUp, TrendingDown, DollarSign, Sparkles, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface AIPriceSuggestionProps {
    features: RoomFeatures;
    currentPrice?: number;
    onPriceSelect?: (price: number) => void;
}

const AIPriceSuggestion: React.FC<AIPriceSuggestionProps> = ({ features, currentPrice, onPriceSelect }) => {
    const [prediction, setPrediction] = useState<PricePrediction | null>(null);
    const [isCalculating, setIsCalculating] = useState(true);

    useEffect(() => {
        // Simulate AI calculation
        setIsCalculating(true);
        setTimeout(() => {
            const result = aiPricePredictor.predictPrice(features);
            setPrediction(result);
            setIsCalculating(false);
        }, 1500);
    }, [features]);

    if (isCalculating) {
        return (
            <div className="glass animate-fadeIn rounded-2xl p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">AI is Analyzing...</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Calculating optimal price</p>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-purple-600" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-pink-600" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        );
    }

    if (!prediction) return null;

    const suggestions = aiPricePredictor.getSuggestedPrice(features);
    const isPriceSet = currentPrice !== undefined;
    const priceStatus = isPriceSet
        ? currentPrice < prediction.priceRange.min
            ? 'low'
            : currentPrice > prediction.priceRange.max
                ? 'high'
                : 'good'
        : null;

    return (
        <div className="space-y-4 animate-fadeInUp">
            {/* Main Prediction Card */}
            <div className="glass overflow-hidden rounded-2xl">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-semibold">AI Price Recommendation</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <DollarSign className="h-8 w-8" />
                        <span className="text-5xl font-bold">{prediction.predictedPrice}</span>
                        <span className="mb-2 text-xl opacity-80">/month</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm opacity-90">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>{prediction.confidence}% Confidence</span>
                        </div>
                        <span>•</span>
                        <span>Based on {prediction.similarListings} similar listings</span>
                    </div>
                </div>

                {/* Price Range */}
                <div className="p-6">
                    <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Fair Price Range</span>
                            <span className="text-gray-600 dark:text-gray-400">
                                ${prediction.priceRange.min} - ${prediction.priceRange.max}
                            </span>
                        </div>
                        <div className="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                                className="absolute h-full bg-gradient-to-r from-green-400 to-green-500"
                                style={{
                                    left: '0%',
                                    width: '100%'
                                }}
                            ></div>
                            <div
                                className="absolute h-full w-1 bg-white shadow-lg"
                                style={{
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                            ></div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Min</span>
                            <span className="font-semibold">Recommended</span>
                            <span>Max</span>
                        </div>
                    </div>

                    {/* Market Comparison */}
                    <div className={`rounded-xl p-4 ${prediction.marketComparison === 'below'
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : prediction.marketComparison === 'above'
                                ? 'bg-red-50 dark:bg-red-900/20'
                                : 'bg-blue-50 dark:bg-blue-900/20'
                        }`}>
                        <div className="flex items-center gap-2">
                            {prediction.marketComparison === 'below' ? (
                                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : prediction.marketComparison === 'above' ? (
                                <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : (
                                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            )}
                            <span className={`font-semibold ${prediction.marketComparison === 'below'
                                    ? 'text-green-700 dark:text-green-300'
                                    : prediction.marketComparison === 'above'
                                        ? 'text-red-700 dark:text-red-300'
                                        : 'text-blue-700 dark:text-blue-300'
                                }`}>
                                {prediction.marketComparison === 'below'
                                    ? 'Below Market Average'
                                    : prediction.marketComparison === 'above'
                                        ? 'Above Market Average'
                                        : 'Fair Market Price'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Options */}
            <div className="glass rounded-2xl p-6">
                <h3 className="mb-4 font-bold text-gray-900 dark:text-white">Pricing Strategies</h3>
                <div className="grid gap-3 md:grid-cols-2">
                    <button
                        onClick={() => onPriceSelect?.(suggestions.competitive)}
                        className="group rounded-xl border-2 border-indigo-200 p-4 text-left transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/20"
                    >
                        <div className="mb-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            🎯 Competitive
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${suggestions.competitive}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Attract more tenants quickly
                        </div>
                    </button>

                    <button
                        onClick={() => onPriceSelect?.(suggestions.recommended)}
                        className="group rounded-xl border-2 border-purple-200 p-4 text-left transition-all hover:border-purple-500 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                    >
                        <div className="mb-1 text-sm font-semibold text-purple-600 dark:text-purple-400">
                            ⭐ Recommended
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${suggestions.recommended}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Optimal balance of value
                        </div>
                    </button>

                    <button
                        onClick={() => onPriceSelect?.(suggestions.premium)}
                        className="group rounded-xl border-2 border-pink-200 p-4 text-left transition-all hover:border-pink-500 hover:bg-pink-50 dark:border-pink-800 dark:hover:bg-pink-900/20"
                    >
                        <div className="mb-1 text-sm font-semibold text-pink-600 dark:text-pink-400">
                            💎 Premium
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${suggestions.premium}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Maximum value for quality
                        </div>
                    </button>

                    <button
                        onClick={() => onPriceSelect?.(suggestions.budget)}
                        className="group rounded-xl border-2 border-green-200 p-4 text-left transition-all hover:border-green-500 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                    >
                        <div className="mb-1 text-sm font-semibold text-green-600 dark:text-green-400">
                            💰 Budget-Friendly
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${suggestions.budget}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Quick rental guaranteed
                        </div>
                    </button>
                </div>
            </div>

            {/* AI Insights */}
            <div className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white">AI Insights</h3>
                </div>
                <div className="space-y-3">
                    {prediction.insights.map((insight, index) => (
                        <div
                            key={index}
                            className="flex gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50 animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="text-lg">{insight.split(' ')[0]}</div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {insight.split(' ').slice(1).join(' ')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Price Status (if price is set) */}
            {isPriceSet && priceStatus && (
                <div className={`glass rounded-2xl p-6 ${priceStatus === 'low'
                        ? 'border-2 border-yellow-500'
                        : priceStatus === 'high'
                            ? 'border-2 border-red-500'
                            : 'border-2 border-green-500'
                    }`}>
                    <div className="flex items-center gap-3">
                        {priceStatus === 'low' ? (
                            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        ) : priceStatus === 'high' ? (
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        ) : (
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        )}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                                {priceStatus === 'low'
                                    ? 'Price is Below Recommendation'
                                    : priceStatus === 'high'
                                        ? 'Price is Above Recommendation'
                                        : 'Great Price!'}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {priceStatus === 'low'
                                    ? `You could increase by $${prediction.predictedPrice - currentPrice} to match market value`
                                    : priceStatus === 'high'
                                        ? `Consider reducing by $${currentPrice - prediction.predictedPrice} for faster rental`
                                        : 'Your price is within the optimal range'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIPriceSuggestion;
