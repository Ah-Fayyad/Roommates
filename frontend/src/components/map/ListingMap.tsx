import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ListingMapProps {
    lat: number;
    lng: number;
    title?: string;
}

const ListingMap: React.FC<ListingMapProps> = ({ lat, lng, title }) => {
    // Valid coordinates check
    const isValid = lat && lng && !isNaN(lat) && !isNaN(lng);
    const position: [number, number] = isValid ? [lat, lng] : [30.0444, 31.2357]; // Default to Cairo if invalid

    if (!isValid) {
        return (
            <div className="h-[300px] w-full overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Location not available</p>
            </div>
        );
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    return (
        <div className="h-[400px] w-full overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm relative group">
            <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-center">
                            <strong className="block mb-1">{title || 'Listing Location'}</strong>
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline text-xs"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Overlay button for external map */}
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-[400] bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 opacity-90 hover:opacity-100"
            >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
            </a>
        </div>
    );
};

export default ListingMap;
