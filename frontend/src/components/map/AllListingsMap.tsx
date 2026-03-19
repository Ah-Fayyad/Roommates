import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Listing {
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    address?: string;
    images: { url: string }[];
}

interface AllListingsMapProps {
    listings: Listing[];
}

const AllListingsMap: React.FC<AllListingsMapProps> = ({ listings }) => {
    const { t } = useTranslation();
    // Mock map view - showing listings in a grid instead
    return (
        <div className="w-full overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6">
            <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('map_view')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('browse_listings_count', { count: listings.length })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                {listings.map(listing => (
                    <Link
                        key={listing.id}
                        to={`/listings/${listing.id}`}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                        <img
                            src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                            alt={listing.title}
                            className="mb-3 h-32 w-full rounded-lg object-cover"
                        />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                            {listing.title}
                        </h4>
                        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                            {listing.price.toLocaleString('ar-EG')} {t('per_month_short')}
                        </div>
                        <div className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                                {listing.address || `${listing.latitude.toFixed(4)}, ${listing.longitude.toFixed(4)}`}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {listings.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">{t('no_listings_found')}</p>
                </div>
            )}
        </div>
    );
};

export default AllListingsMap;
