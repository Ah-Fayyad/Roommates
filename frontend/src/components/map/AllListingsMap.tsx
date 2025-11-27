import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

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

interface Listing {
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
    images: { url: string }[];
}

interface AllListingsMapProps {
    listings: Listing[];
}

const AllListingsMap: React.FC<AllListingsMapProps> = ({ listings }) => {
    // Default center (Cairo) if no listings, otherwise center on the first listing
    const center: [number, number] = listings.length > 0
        ? [listings[0].latitude, listings[0].longitude]
        : [30.0444, 31.2357];

    return (
        <div className="h-[500px] w-full overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {listings.map(listing => (
                    <Marker key={listing.id} position={[listing.latitude, listing.longitude]}>
                        <Popup>
                            <div className="min-w-[200px]">
                                <img
                                    src={listing.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                    alt={listing.title}
                                    className="mb-2 h-32 w-full rounded-lg object-cover"
                                />
                                <h3 className="font-bold text-gray-900">{listing.title}</h3>
                                <p className="font-semibold text-indigo-600">${listing.price}/month</p>
                                <Link
                                    to={`/listings/${listing.id}`}
                                    className="mt-2 block w-full rounded-md bg-indigo-600 py-1 text-center text-sm text-white hover:bg-indigo-700"
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AllListingsMap;
