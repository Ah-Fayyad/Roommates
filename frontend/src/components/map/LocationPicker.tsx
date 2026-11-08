import React, { useState, useEffect } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { Navigation, MapPin, Target, Locate } from 'lucide-react';
import { createCustomMarker, pulseMarkerIcon } from './MapStyles';
import BaseMap from './BaseMap';

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

// Map events and helper
const InteractionHandler = ({ onLocationSelect, setPosition, setMapInstance }: any) => {
    const map = useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            // Auto-center and zoom on selection
            map.setView([e.latlng.lat, e.latlng.lng], Math.max(map.getZoom(), 17));
        },
    });

    useEffect(() => {
       setMapInstance(map);
    }, [map, setMapInstance]);

    return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLat, initialLng }) => {
    const { t } = useTranslation();
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [position, setPosition] = useState<[number, number] | null>((initialLat && initialLng) ? [initialLat, initialLng] : null);

    // Default to Cairo, Egypt if no initial position
    const defaultCenter: [number, number] = [30.0444, 31.2357];
    const center = position || defaultCenter;

    const findMe = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(newPos);
                setPosition(newPos);
                onLocationSelect(pos.coords.latitude, pos.coords.longitude);
                if (mapInstance) {
                    mapInstance.setView(newPos, 18);
                }
                setIsLocating(false);
            },
            () => {
                setIsLocating(false);
                alert(t('could_not_get_location', 'Could not get your location.'));
            }
        );
    };

    // Vibrant red marker for selection
    const customMarker = createCustomMarker('#ef4444', true);

    return (
        <BaseMap
            center={center}
            zoom={initialLat ? 17 : 14}
            height="450px"
            headerIcon={<Locate className="w-6 h-6 text-indigo-100" />}
            headerTitle={t('location_picker')}
            headerSubtitle={t('click_to_pin')}
            onMapReady={setMapInstance}
            overlayActions={
                <button
                    type="button"
                    onClick={findMe}
                    disabled={isLocating}
                    className="h-12 px-5 bg-white dark:bg-gray-800 text-indigo-600 rounded-2xl shadow-xl border border-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    title={t('use_current_location')}
                >
                    {isLocating ? (
                        <div className="h-5 w-5 animate-spin border-3 border-indigo-600 border-t-transparent rounded-full" />
                    ) : (
                        <Navigation className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    )}
                    <span className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">
                        {t('use_current_location', 'GPS')}
                    </span>
                </button>
            }
        >
            {userLocation && (
                <Marker position={userLocation} icon={pulseMarkerIcon} />
            )}

            {position && <Marker position={position} icon={customMarker} />}

            <InteractionHandler 
                onLocationSelect={onLocationSelect} 
                setPosition={setPosition} 
                setMapInstance={setMapInstance}
            />

            {/* Selection HUD */}
            <div className="absolute bottom-6 left-6 z-[400] right-6 pointer-events-none flex justify-center">
                 <div className="bg-white/95 dark:bg-gray-900/95 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/50 backdrop-blur-xl transition-all">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${position ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                         <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter block leading-none mb-1">
                            {position ? t('location_selected', 'Location Confirmed') : t('click_to_pin', 'Set Location Pin')}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {position ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}` : t('click_map_desc', 'Click on exact point')}
                        </span>
                    </div>
                </div>
            </div>
        </BaseMap>
    );
};

export default LocationPicker;
