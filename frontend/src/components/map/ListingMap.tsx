import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
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
    const position: [number, number] = [lat, lng];

    return (
        <div className="h-[300px] w-full overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    {title && <Popup>{title}</Popup>}
                </Marker>
            </MapContainer>
        </div>
    );
};

export default ListingMap;
