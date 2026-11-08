import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapPin, Star, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createCustomMarker } from './MapStyles';
import BaseMap from './BaseMap';

interface Listing {
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    address?: string;
    images: { url: string }[];
    roomType?: string;
    rating?: number;
}

interface AllListingsMapProps {
    listings: Listing[];
}

const AllListingsMap: React.FC<AllListingsMapProps> = ({ listings }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [activeListingId, setActiveListingId] = useState<string | null>(null);

    // Filter valid listings
    const validListings = listings.filter(l => l.latitude && l.longitude);
    const center: [number, number] = validListings.length > 0 
        ? [validListings[0].latitude, validListings[0].longitude] 
        : [30.0444, 31.2357];

    return (
        <BaseMap
            center={center}
            zoom={13}
            height="550px"
            headerIcon={<Sparkles className="w-6 h-6 animate-pulse" />}
            headerTitle={t('map_view')}
            headerSubtitle={t('browse_listings_count', { count: validListings.length })}
        >
            {validListings.map(listing => {
                const isActive = activeListingId === listing.id;
                const markerColor = isActive ? '#ef4444' : '#4f46e5';
                const markerIcon = createCustomMarker(markerColor, isActive);

                return (
                    <Marker 
                        key={listing.id} 
                        position={[listing.latitude, listing.longitude]} 
                        icon={markerIcon}
                        eventHandlers={{
                            click: () => setActiveListingId(listing.id),
                        }}
                    >
                        <Popup minWidth={280} className="premium-listing-popup">
                            <Link to={`/listings/${listing.id}`} className="group block focus:outline-none">
                                <div className="relative h-36 w-full overflow-hidden rounded-t-2xl">
                                    <img
                                        src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                                        alt={listing.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-[10px] font-black tracking-widest text-white shadow-lg rounded-full uppercase">
                                        {listing.roomType || 'Private'}
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/95 px-3 py-1 text-sm font-black text-indigo-600 rounded-lg shadow-xl backdrop-blur-sm border border-white/50">
                                        {listing.price.toLocaleString(isArabic ? 'ar-EG' : 'en-US')} <span className="text-[10px] font-medium text-gray-500">/{t('per_month_short')}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-b-2xl">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h4 className="line-clamp-1 text-base font-bold text-gray-900 dark:text-white transition-colors group-hover:text-indigo-600">
                                            {listing.title}
                                        </h4>
                                        {listing.rating && (
                                            <div className="flex items-center gap-1 text-amber-500 text-xs font-black bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                                                <Star className="w-3 h-3 fill-current" />
                                                {listing.rating}
                                            </div>
                                        )}
                                    </div>
                                    <p className="mb-4 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                                        {listing.address || 'Unknown address'}
                                    </p>
                                    <div className="flex items-center justify-between pointer-events-none group-hover:pointer-events-auto">
                                        <div className="flex -space-x-2">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-xs font-black text-indigo-600 group-hover:translate-x-1 transition-all rtl:group-hover:-translate-x-1">
                                            {t('view_details', 'View Match')}
                                            <ChevronRight className={`w-4 h-4 ms-1 ${isArabic ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Popup>
                    </Marker>
                );
            })}
        </BaseMap>
    );
};

export default AllListingsMap;
