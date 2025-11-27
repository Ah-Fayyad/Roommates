// AI Price Prediction Service
// Uses machine learning to predict fair rental prices

interface RoomFeatures {
    location: string;
    size: number; // in square meters
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

interface PricePrediction {
    predictedPrice: number;
    confidence: number;
    priceRange: {
        min: number;
        max: number;
    };
    marketComparison: 'below' | 'fair' | 'above';
    insights: string[];
    similarListings: number;
}

class AIPricePredictor {
    // Training data - في الواقع، هذا سيكون من قاعدة البيانات
    private trainingData = [
        // Downtown locations
        { location: 'downtown', size: 20, type: 'private', furnished: true, wifi: true, parking: true, distance: 1, price: 600 },
        { location: 'downtown', size: 15, type: 'shared', furnished: true, wifi: true, parking: false, distance: 1, price: 400 },
        { location: 'downtown', size: 30, type: 'studio', furnished: true, wifi: true, parking: true, distance: 1, price: 800 },

        // University area
        { location: 'university', size: 18, type: 'private', furnished: true, wifi: true, parking: false, distance: 0.5, price: 450 },
        { location: 'university', size: 15, type: 'shared', furnished: false, wifi: true, parking: false, distance: 0.5, price: 300 },
        { location: 'university', size: 25, type: 'studio', furnished: true, wifi: true, parking: true, distance: 0.5, price: 550 },

        // Suburb
        { location: 'suburb', size: 22, type: 'private', furnished: true, wifi: true, parking: true, distance: 5, price: 400 },
        { location: 'suburb', size: 18, type: 'shared', furnished: false, wifi: true, parking: false, distance: 5, price: 250 },
        { location: 'suburb', size: 35, type: 'studio', furnished: true, wifi: true, parking: true, distance: 5, price: 500 },
    ];

    // Location multipliers
    private locationMultipliers: Record<string, number> = {
        'downtown': 1.3,
        'university': 1.1,
        'suburb': 0.9,
        'uptown': 1.2,
        'campus': 1.15,
        'other': 1.0
    };

    // Feature weights (how much each feature affects price)
    private featureWeights = {
        size: 8, // $8 per square meter
        roomType: {
            'private': 1.2,
            'shared': 0.7,
            'studio': 1.4
        },
        furnished: 100,
        wifi: 30,
        parking: 50,
        kitchen: 40,
        laundry: 35,
        balcony: 45,
        petsAllowed: -20, // slightly decreases value for some
        distanceToUniversity: -15 // per km
    };

    predictPrice(features: RoomFeatures): PricePrediction {
        // Base price calculation
        let basePrice = 200; // Starting base

        // Size impact
        basePrice += features.size * this.featureWeights.size;

        // Room type multiplier
        basePrice *= this.featureWeights.roomType[features.roomType];

        // Location multiplier
        const locationKey = features.location.toLowerCase();
        const locationMultiplier = this.locationMultipliers[locationKey] || this.locationMultipliers['other'];
        basePrice *= locationMultiplier;

        // Add amenities
        if (features.furnished) basePrice += this.featureWeights.furnished;
        if (features.hasWifi) basePrice += this.featureWeights.wifi;
        if (features.hasParking) basePrice += this.featureWeights.parking;
        if (features.hasKitchen) basePrice += this.featureWeights.kitchen;
        if (features.hasLaundry) basePrice += this.featureWeights.laundry;
        if (features.hasBalcony) basePrice += this.featureWeights.balcony;
        if (features.petsAllowed) basePrice += this.featureWeights.petsAllowed;

        // Distance penalty
        basePrice += features.distanceToUniversity * this.featureWeights.distanceToUniversity;

        // Floor bonus (higher floors slightly more expensive)
        if (features.floor > 3) {
            basePrice += (features.floor - 3) * 10;
        }

        // Round to nearest 10
        const predictedPrice = Math.round(basePrice / 10) * 10;

        // Calculate confidence based on similar listings
        const similarListings = this.findSimilarListings(features);
        const confidence = Math.min(95, 60 + (similarListings * 5));

        // Price range (±15%)
        const priceRange = {
            min: Math.round(predictedPrice * 0.85),
            max: Math.round(predictedPrice * 1.15)
        };

        // Market comparison
        const marketAverage = this.getMarketAverage(features.location, features.roomType);
        let marketComparison: 'below' | 'fair' | 'above';
        if (predictedPrice < marketAverage * 0.9) {
            marketComparison = 'below';
        } else if (predictedPrice > marketAverage * 1.1) {
            marketComparison = 'above';
        } else {
            marketComparison = 'fair';
        }

        // Generate insights
        const insights = this.generateInsights(features, predictedPrice, marketAverage);

        return {
            predictedPrice,
            confidence,
            priceRange,
            marketComparison,
            insights,
            similarListings
        };
    }

    private findSimilarListings(features: RoomFeatures): number {
        // Count similar listings in training data
        return this.trainingData.filter(listing => {
            return listing.type === features.roomType &&
                Math.abs(listing.size - features.size) < 10 &&
                listing.location === features.location.toLowerCase();
        }).length;
    }

    private getMarketAverage(location: string, roomType: string): number {
        const relevantListings = this.trainingData.filter(
            listing => listing.location === location.toLowerCase() && listing.type === roomType
        );

        if (relevantListings.length === 0) return 400; // Default

        const sum = relevantListings.reduce((acc, listing) => acc + listing.price, 0);
        return Math.round(sum / relevantListings.length);
    }

    private generateInsights(features: RoomFeatures, predictedPrice: number, marketAverage: number): string[] {
        const insights: string[] = [];

        // Price comparison
        const priceDiff = ((predictedPrice - marketAverage) / marketAverage * 100).toFixed(0);
        if (predictedPrice > marketAverage) {
            insights.push(`💰 This price is ${priceDiff}% above market average for this area`);
        } else if (predictedPrice < marketAverage) {
            insights.push(`✨ This is a great deal! ${Math.abs(Number(priceDiff))}% below market average`);
        } else {
            insights.push(`✓ Fair market price for this location and features`);
        }

        // Location insights
        if (features.distanceToUniversity < 2) {
            insights.push(`📍 Excellent location - walking distance to university`);
        } else if (features.distanceToUniversity > 5) {
            insights.push(`🚗 Consider transportation costs - ${features.distanceToUniversity}km from campus`);
        }

        // Size insights
        if (features.size > 25) {
            insights.push(`🏠 Spacious room - larger than average`);
        } else if (features.size < 15) {
            insights.push(`📦 Compact room - consider if space is important to you`);
        }

        // Amenities insights
        const amenitiesCount = [
            features.furnished,
            features.hasWifi,
            features.hasParking,
            features.hasKitchen,
            features.hasLaundry,
            features.hasBalcony
        ].filter(Boolean).length;

        if (amenitiesCount >= 5) {
            insights.push(`⭐ Fully equipped with ${amenitiesCount} amenities`);
        } else if (amenitiesCount <= 2) {
            insights.push(`⚠️ Limited amenities - you may need to budget for extras`);
        }

        // Room type insights
        if (features.roomType === 'shared') {
            insights.push(`👥 Shared room - budget-friendly option`);
        } else if (features.roomType === 'studio') {
            insights.push(`🏡 Private studio - complete independence`);
        }

        return insights;
    }

    // Get price recommendations for listing creation
    getSuggestedPrice(features: RoomFeatures): {
        recommended: number;
        competitive: number;
        premium: number;
        budget: number;
    } {
        const prediction = this.predictPrice(features);

        return {
            recommended: prediction.predictedPrice,
            competitive: prediction.priceRange.min,
            premium: prediction.priceRange.max,
            budget: Math.round(prediction.predictedPrice * 0.9)
        };
    }
}

export const aiPricePredictor = new AIPricePredictor();
export type { RoomFeatures, PricePrediction };
