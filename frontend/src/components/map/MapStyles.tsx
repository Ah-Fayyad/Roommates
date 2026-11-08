import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

/**
 * Premium Vibrant Marker Creator
 * Uses gradients and shadows for a "high-end" look
 */
export const createCustomMarker = (color: string = '#4f46e5', isActive: boolean = false) => {
    const size = isActive ? 44 : 32;
    const innerSize = isActive ? 12 : 8;
    
    return L.divIcon({
        className: 'custom-vibrant-marker',
        html: `
            <div style="
                position: relative;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                filter: drop-shadow(0 8px 15px rgba(0,0,0,0.3));
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            ">
                <!-- Pointy Pin Shape -->
                <div style="
                    background: linear-gradient(135deg, ${color}, #8b5cf6);
                    width: 100%;
                    height: 100%;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <!-- White Inner Circle -->
                    <div style="
                        width: ${innerSize}px;
                        height: ${innerSize}px;
                        background: white;
                        border-radius: 50%;
                        transform: rotate(45deg);
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <!-- Tiny colored dot in center -->
                        <div style="width: 4px; height: 4px; background: ${color}; border-radius: 50%;"></div>
                    </div>
                </div>
                <!-- Animated Rings for focus -->
                ${isActive ? `
                <div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid ${color};
                    border-radius: 50%;
                    animation: marker-ping 1.5s infinite;
                    z-index: -1;
                "></div>
                ` : ''}
            </div>
            <style>
                @keyframes marker-ping {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
            </style>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
    });
};

/**
 * Pulse Marker for "My Location"
 */
export const pulseMarkerIcon = L.divIcon({
    className: 'gps-pulse-icon',
    html: `
        <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; width: 24px; height: 24px; background: #3b82f6; border-radius: 50%; z-index: 10; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>
            <div style="position: absolute; width: 100%; height: 100%; background: #3b82f6; border-radius: 50%; animation: gps-pulse 2s infinite; opacity: 0.4;"></div>
        </div>
        <style>
            @keyframes gps-pulse {
                0% { transform: scale(1); opacity: 0.6; }
                100% { transform: scale(3.5); opacity: 0; }
            }
        </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

/**
 * Modern Colorful Map Configuration
 */
export const MAP_TILES = {
    LIGHT: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    DARK: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
};
