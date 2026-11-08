// AI Price Prediction Service - Upgraded v2.0
// محرك الذكاء الاصطناعي لتوقع أسعار الإيجار في مصر
// Upgraded with realistic Egyptian market prices in EGP

export interface RoomFeatures {
    location: string;
    size: number;             // in square meters
    roomType: 'private' | 'shared' | 'studio';
    furnished: boolean;
    hasWifi: boolean;
    hasParking: boolean;
    hasKitchen: boolean;
    hasLaundry: boolean;
    distanceToUniversity: number; // in km
    floor: number;
    hasBalcony: boolean;
    petsAllowed: boolean;
}

export interface PricePrediction {
    predictedPrice: number;         // in EGP
    confidence: number;             // 0-100%
    priceRange: {
        min: number;
        max: number;
    };
    marketComparison: 'below' | 'fair' | 'above';
    insights: string[];             // localized based on language
    similarListings: number;
    marketScore: number;            // 0-100 attractiveness score
    demandLevel: 'low' | 'medium' | 'high';
    rentalSpeedDays: number;        // estimated days to rent
}

// ====================================================
// TRAINING DATA - Realistic Egyptian EGP Prices
// بيانات حقيقية للسوق المصري بالجنيه المصري
// ====================================================
const TRAINING_DATA = [
    // === DOWNTOWN / وسط البلد ===
    { location: 'downtown', size: 20, type: 'private', furnished: true,  wifi: true,  parking: true,  distance: 1.0, floor: 3, price: 5500 },
    { location: 'downtown', size: 15, type: 'shared',  furnished: true,  wifi: true,  parking: false, distance: 1.0, floor: 2, price: 3000 },
    { location: 'downtown', size: 30, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 1.0, floor: 5, price: 7500 },
    { location: 'downtown', size: 18, type: 'private', furnished: false, wifi: true,  parking: false, distance: 1.5, floor: 1, price: 4000 },
    { location: 'downtown', size: 22, type: 'private', furnished: true,  wifi: true,  parking: false, distance: 0.8, floor: 4, price: 5000 },
    { location: 'downtown', size: 35, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 2.0, floor: 6, price: 9000 },
    { location: 'downtown', size: 12, type: 'shared',  furnished: false, wifi: false, parking: false, distance: 0.5, floor: 1, price: 2000 },
    { location: 'downtown', size: 25, type: 'studio',  furnished: true,  wifi: true,  parking: false, distance: 1.2, floor: 2, price: 7000 },

    // === UNIVERSITY AREA / منطقة الجامعة ===
    { location: 'university', size: 18, type: 'private', furnished: true,  wifi: true,  parking: false, distance: 0.5, floor: 2, price: 4500 },
    { location: 'university', size: 15, type: 'shared',  furnished: false, wifi: true,  parking: false, distance: 0.5, floor: 1, price: 2500 },
    { location: 'university', size: 25, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 0.5, floor: 3, price: 6000 },
    { location: 'university', size: 20, type: 'private', furnished: true,  wifi: true,  parking: true,  distance: 1.0, floor: 4, price: 5000 },
    { location: 'university', size: 14, type: 'shared',  furnished: true,  wifi: true,  parking: false, distance: 0.3, floor: 1, price: 3000 },
    { location: 'university', size: 30, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 0.8, floor: 5, price: 7000 },
    { location: 'university', size: 16, type: 'private', furnished: false, wifi: false, parking: false, distance: 1.5, floor: 1, price: 3000 },
    { location: 'university', size: 22, type: 'private', furnished: true,  wifi: true,  parking: false, distance: 0.7, floor: 3, price: 4800 },

    // === CAMPUS / داخل الحرم الجامعي ===
    { location: 'campus', size: 16, type: 'shared',  furnished: true,  wifi: true,  parking: false, distance: 0.1, floor: 1, price: 2800 },
    { location: 'campus', size: 18, type: 'private', furnished: true,  wifi: true,  parking: false, distance: 0.2, floor: 2, price: 4200 },
    { location: 'campus', size: 20, type: 'private', furnished: true,  wifi: true,  parking: true,  distance: 0.3, floor: 3, price: 5200 },
    { location: 'campus', size: 14, type: 'shared',  furnished: false, wifi: true,  parking: false, distance: 0.1, floor: 1, price: 2200 },

    // === UPTOWN / المناطق الراقية (زي التجمع الخامس، الشيخ زايد) ===
    { location: 'uptown', size: 25, type: 'private', furnished: true,  wifi: true,  parking: true,  distance: 3.0, floor: 4, price: 8000 },
    { location: 'uptown', size: 20, type: 'shared',  furnished: true,  wifi: true,  parking: true,  distance: 2.5, floor: 3, price: 5000 },
    { location: 'uptown', size: 40, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 3.0, floor: 6, price: 12000 },
    { location: 'uptown', size: 22, type: 'private', furnished: true,  wifi: true,  parking: false, distance: 2.0, floor: 2, price: 7000 },
    { location: 'uptown', size: 35, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 4.0, floor: 7, price: 10000 },

    // === SUBURB / الأطراف ===
    { location: 'suburb', size: 22, type: 'private', furnished: true,  wifi: true,  parking: true,  distance: 5.0, floor: 1, price: 3000 },
    { location: 'suburb', size: 18, type: 'shared',  furnished: false, wifi: true,  parking: false, distance: 5.0, floor: 1, price: 1800 },
    { location: 'suburb', size: 35, type: 'studio',  furnished: true,  wifi: true,  parking: true,  distance: 5.0, floor: 2, price: 4500 },
    { location: 'suburb', size: 20, type: 'private', furnished: false, wifi: false, parking: false, distance: 7.0, floor: 1, price: 2000 },
    { location: 'suburb', size: 15, type: 'shared',  furnished: false, wifi: false, parking: false, distance: 6.0, floor: 1, price: 1400 },
    { location: 'suburb', size: 28, type: 'studio',  furnished: true,  wifi: true,  parking: false, distance: 4.0, floor: 1, price: 3800 },
];

// ====================================================
// LOCATION MULTIPLIERS (Egyptian EGP-tuned)
// ====================================================
const LOCATION_MULTIPLIERS: Record<string, number> = {
    'uptown':     1.5,
    'downtown':   1.3,
    'campus':     1.15,
    'university': 1.1,
    'suburb':     0.8,
    'other':      1.0
};

// ====================================================
// FEATURE WEIGHTS (in EGP)
// ====================================================
const FEATURE_WEIGHTS = {
    basePrice: 1500,          // Starting base in EGP
    sizePerSqm: 80,           // EGP per square meter
    roomType: {
        'private': 1.2,
        'shared':  0.65,
        'studio':  1.5
    },
    furnished:   800,         // EGP bonus
    wifi:        250,
    parking:     500,
    kitchen:     350,
    laundry:     300,
    balcony:     400,
    petsAllowed: -200,        // slight penalty
    distancePerKm: -120,      // EGP per km away
    floorBonusPerFloor: 80,   // EGP per floor above 3
};

class AIPricePredictor {
    private trainingData = TRAINING_DATA;

    predictPrice(features: RoomFeatures): PricePrediction {
        // --- K-NN inspired: Find most similar listings ---
        const weightedNeighbors = this.getWeightedNeighbors(features);

        // --- Regression-based base price ---
        let basePrice = FEATURE_WEIGHTS.basePrice;
        basePrice += features.size * FEATURE_WEIGHTS.sizePerSqm;
        basePrice *= FEATURE_WEIGHTS.roomType[features.roomType];

        const locationKey = features.location.toLowerCase();
        const locationMultiplier = LOCATION_MULTIPLIERS[locationKey] ?? LOCATION_MULTIPLIERS['other'];
        basePrice *= locationMultiplier;

        // Amenities
        if (features.furnished)   basePrice += FEATURE_WEIGHTS.furnished;
        if (features.hasWifi)      basePrice += FEATURE_WEIGHTS.wifi;
        if (features.hasParking)   basePrice += FEATURE_WEIGHTS.parking;
        if (features.hasKitchen)   basePrice += FEATURE_WEIGHTS.kitchen;
        if (features.hasLaundry)   basePrice += FEATURE_WEIGHTS.laundry;
        if (features.hasBalcony)   basePrice += FEATURE_WEIGHTS.balcony;
        if (features.petsAllowed)  basePrice += FEATURE_WEIGHTS.petsAllowed;

        // Distance penalty
        basePrice += features.distanceToUniversity * FEATURE_WEIGHTS.distancePerKm;

        // Floor bonus (above floor 3)
        if (features.floor > 3) {
            basePrice += (features.floor - 3) * FEATURE_WEIGHTS.floorBonusPerFloor;
        }

        // --- Blend regression & KNN ---
        let blendedPrice = basePrice;
        if (weightedNeighbors.price > 0 && weightedNeighbors.count > 0) {
            const knnWeight = Math.min(0.6, weightedNeighbors.count * 0.15); // KNN stronger when more data
            blendedPrice = basePrice * (1 - knnWeight) + weightedNeighbors.price * knnWeight;
        }

        // Round to nearest 50 EGP
        const predictedPrice = Math.max(1000, Math.round(blendedPrice / 50) * 50);

        // Confidence based on data density
        const confidence = Math.min(95, 55 + (weightedNeighbors.count * 7));

        // Price range (±12%)
        const priceRange = {
            min: Math.round(predictedPrice * 0.88 / 50) * 50,
            max: Math.round(predictedPrice * 1.12 / 50) * 50,
        };

        // Market comparison
        const marketAvg = this.getMarketAverage(features.location, features.roomType);
        let marketComparison: 'below' | 'fair' | 'above';
        if (predictedPrice < marketAvg * 0.92) {
            marketComparison = 'below';
        } else if (predictedPrice > marketAvg * 1.08) {
            marketComparison = 'above';
        } else {
            marketComparison = 'fair';
        }

        // Demand level and rental speed
        const { demandLevel, rentalSpeedDays } = this.estimateDemand(features, marketComparison);

        // Market attractiveness score
        const marketScore = this.calculateMarketScore(features, predictedPrice, marketAvg, demandLevel);

        // Insights (will be localized in the UI component)
        const insights = this.generateInsights(features, predictedPrice, marketAvg);

        return {
            predictedPrice,
            confidence,
            priceRange,
            marketComparison,
            insights,
            similarListings: weightedNeighbors.count,
            marketScore,
            demandLevel,
            rentalSpeedDays
        };
    }

    private getWeightedNeighbors(features: RoomFeatures): { price: number; count: number } {
        const locationKey = features.location.toLowerCase();

        const scored = this.trainingData
            .filter(d => d.type === features.roomType)
            .map(d => {
                let similarity = 0;

                // Location match (high weight)
                if (d.location === locationKey) similarity += 40;

                // Size proximity (35% weight)
                const sizeDiff = Math.abs(d.size - features.size);
                similarity += Math.max(0, 35 - sizeDiff * 2);

                // Feature match
                if (d.furnished === features.furnished) similarity += 8;
                if (d.wifi === features.hasWifi) similarity += 4;
                if (d.parking === features.hasParking) similarity += 5;

                // Distance proximity
                if (Math.abs(d.distance - features.distanceToUniversity) < 2) similarity += 8;

                return { price: d.price, similarity };
            })
            .filter(s => s.similarity > 30)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        if (scored.length === 0) return { price: 0, count: 0 };

        const totalWeight = scored.reduce((s, n) => s + n.similarity, 0);
        const weightedPrice = scored.reduce((s, n) => s + (n.price * n.similarity), 0) / totalWeight;

        return { price: weightedPrice, count: scored.length };
    }

    private getMarketAverage(location: string, roomType: string): number {
        const relevant = this.trainingData.filter(
            d => d.location === location.toLowerCase() && d.type === roomType
        );
        if (relevant.length === 0) {
            // Fallback: all same room type
            const allType = this.trainingData.filter(d => d.type === roomType);
            if (allType.length === 0) return 4000;
            return allType.reduce((s, d) => s + d.price, 0) / allType.length;
        }
        return relevant.reduce((s, d) => s + d.price, 0) / relevant.length;
    }

    private estimateDemand(
        features: RoomFeatures,
        marketComparison: 'below' | 'fair' | 'above'
    ): { demandLevel: 'low' | 'medium' | 'high'; rentalSpeedDays: number } {
        let demandScore = 50;

        if (features.distanceToUniversity < 1) demandScore += 20;
        else if (features.distanceToUniversity < 3) demandScore += 10;

        if (features.furnished)  demandScore += 10;
        if (features.hasWifi)     demandScore += 5;
        if (features.hasParking)  demandScore += 5;

        if (features.roomType === 'private') demandScore += 10;
        else if (features.roomType === 'studio') demandScore += 15;

        if (marketComparison === 'below') demandScore += 15;
        else if (marketComparison === 'above') demandScore -= 15;

        let demandLevel: 'low' | 'medium' | 'high';
        let rentalSpeedDays: number;

        if (demandScore >= 75) {
            demandLevel = 'high';
            rentalSpeedDays = Math.floor(Math.random() * 5) + 3; // 3-7 days
        } else if (demandScore >= 50) {
            demandLevel = 'medium';
            rentalSpeedDays = Math.floor(Math.random() * 10) + 10; // 10-19 days
        } else {
            demandLevel = 'low';
            rentalSpeedDays = Math.floor(Math.random() * 20) + 20; // 20-39 days
        }

        return { demandLevel, rentalSpeedDays };
    }

    private calculateMarketScore(
        features: RoomFeatures,
        predictedPrice: number,
        marketAvg: number,
        demandLevel: 'low' | 'medium' | 'high'
    ): number {
        let score = 50;

        // Value for price
        if (predictedPrice <= marketAvg) score += 20;
        else score -= 10;

        // Demand
        if (demandLevel === 'high') score += 20;
        else if (demandLevel === 'medium') score += 10;

        // Amenities
        const amenities = [features.furnished, features.hasWifi, features.hasParking, features.hasKitchen, features.hasLaundry, features.hasBalcony];
        score += amenities.filter(Boolean).length * 3;

        // Location proximity
        if (features.distanceToUniversity < 1) score += 10;
        else if (features.distanceToUniversity > 5) score -= 10;

        return Math.max(0, Math.min(100, score));
    }

    private generateInsights(
        features: RoomFeatures,
        predictedPrice: number,
        marketAverage: number
    ): string[] {
        const insights: string[] = [];
        const priceDiffPct = Math.round(((predictedPrice - marketAverage) / marketAverage) * 100);

        // Price vs market
        if (predictedPrice > marketAverage * 1.08) {
            insights.push(`ABOVE_MARKET:${Math.abs(priceDiffPct)}`);
        } else if (predictedPrice < marketAverage * 0.92) {
            insights.push(`BELOW_MARKET:${Math.abs(priceDiffPct)}`);
        } else {
            insights.push(`FAIR_MARKET`);
        }

        // Location
        if (features.distanceToUniversity < 1) {
            insights.push(`NEAR_CAMPUS`);
        } else if (features.distanceToUniversity > 5) {
            insights.push(`FAR_CAMPUS:${features.distanceToUniversity}`);
        }

        // Size
        if (features.size > 28) {
            insights.push(`LARGE_ROOM`);
        } else if (features.size < 14) {
            insights.push(`COMPACT_ROOM`);
        }

        // Amenities
        const amenityCount = [features.furnished, features.hasWifi, features.hasParking, features.hasKitchen, features.hasLaundry, features.hasBalcony].filter(Boolean).length;
        if (amenityCount >= 5) {
            insights.push(`FULLY_EQUIPPED:${amenityCount}`);
        } else if (amenityCount <= 2) {
            insights.push(`LIMITED_AMENITIES`);
        }

        // Room type
        if (features.roomType === 'studio') {
            insights.push(`STUDIO_INDEPENDENCE`);
        } else if (features.roomType === 'shared') {
            insights.push(`SHARED_BUDGET`);
        }

        return insights;
    }

    getSuggestedPrice(features: RoomFeatures): {
        recommended: number;
        competitive: number;
        premium: number;
        budget: number;
    } {
        const prediction = this.predictPrice(features);
        return {
            recommended:  prediction.predictedPrice,
            competitive:  Math.round(prediction.priceRange.min / 50) * 50,
            premium:      Math.round(prediction.priceRange.max / 50) * 50,
            budget:       Math.round(prediction.predictedPrice * 0.88 / 50) * 50,
        };
    }
}

export const aiPricePredictor = new AIPricePredictor();
