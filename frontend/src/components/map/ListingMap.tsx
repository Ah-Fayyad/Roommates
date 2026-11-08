import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { MapPin, ExternalLink, Navigation, LocateFixed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createCustomMarker } from './MapStyles';
import BaseMap from './BaseMap';

interface ListingMapProps {
    lat: number;
    lng: number;
    title?: string;
}

const ListingMap: React.FC<ListingMapProps> = ({ lat, lng, title }) => {
    const { t } = useTranslation();
    
    // Valid coordinates check
    const isValid = lat && lng && !isNaN(lat) && !isNaN(lng);
    const position: [number, number] = isValid ? [lat, lng] : [30.0444, 31.2357];

    if (!isValid) {
        return (
            <div className="h-[300px] w-full overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-center backdrop-blur-sm">
               <div className="text-center">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">{t('location_not_available', 'Location not available')}</p>
               </div>
            </div>
        );
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const customMarker = createCustomMarker('#4f46e5', true);

    return (
        <BaseMap
            center={position}
            zoom={18}
            headerIcon={<LocateFixed className="w-6 h-6 text-indigo-100" />}
            headerTitle={title || t('listing_location')}
            headerSubtitle={t('high_precision')}
            overlayActions={
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-gray-100 dark:border-gray-700 backdrop-blur-md"
                >
                    <Navigation className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                    {t('open_google_maps', 'Navigate')}
                </a>
            }
        >
            <Marker position={position} icon={customMarker}>
                <Popup className="premium-popup">
                    <div className="p-1 min-w-[150px]">
                        <strong className="block mb-1 text-sm font-bold text-gray-900 leading-tight">
                            {title || 'Listing Location'}
                        </strong>
                        <p className="text-[10px] text-gray-500 mb-2 truncate">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
                        <div className="w-full h-[1px] bg-gray-100 my-2"></div>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-xs font-bold transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            {t('open_google_maps', 'View exact location')}
                        </a>
                    </div>
                </Popup>
            </Marker>
        </BaseMap>
    );
};

export default ListingMap;
