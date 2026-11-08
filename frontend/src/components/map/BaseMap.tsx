import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Sparkles, Maximize2, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MAP_TILES } from './MapStyles';

interface BaseMapProps {
    center: [number, number];
    zoom: number;
    children?: React.ReactNode;
    height?: string;
    headerIcon?: React.ReactNode;
    headerTitle?: string;
    headerSubtitle?: string;
    overlayActions?: React.ReactNode;
    className?: string;
    onMapReady?: (map: L.Map) => void;
}

// Internal helper for map updates
const MapReflow = ({ center, zoom, onReady }: { center: [number, number], zoom: number, onReady?: (map: L.Map) => void }) => {
    const map = useMap();
    useEffect(() => {
        if (center[0] && center[1]) {
            map.setView(center, Math.max(map.getZoom(), zoom));
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        }
        if (onReady) onReady(map);
    }, [center, zoom, map, onReady]);
    return null;
};

const BaseMap: React.FC<BaseMapProps> = ({
    center,
    zoom,
    children,
    height = "450px",
    headerIcon = <Sparkles className="w-5 h-5 text-indigo-600" />,
    headerTitle,
    headerSubtitle,
    overlayActions,
    className = "",
    onMapReady
}) => {
    const { t } = useTranslation();
    const isDarkMode = document.documentElement.classList.contains('dark');

    return (
        <div 
            className={`w-full overflow-hidden rounded-[2.5rem] border-4 border-white dark:border-gray-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] relative group animate-fadeIn ${className}`}
            style={{ height }}
        >
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <MapReflow center={center} zoom={zoom} onReady={onMapReady} />
                <TileLayer
                    attribution={MAP_TILES.ATTRIBUTION}
                    url={MAP_TILES.LIGHT} // Always colorful as requested
                />
                {children}
            </MapContainer>

            {/* Premium Glass Header */}
            {(headerTitle || headerIcon) && (
                <div className="absolute top-6 left-6 z-[400] pointer-events-none">
                    <div className="glass-heavy bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/50 backdrop-blur-xl animate-scaleIn">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg ring-4 ring-white dark:ring-gray-800 transition-transform group-hover:scale-110">
                            {headerIcon}
                        </div>
                        {headerTitle && (
                            <div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    {headerTitle}
                                </h3>
                                {headerSubtitle && (
                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        {headerSubtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Actions Hub */}
            <div className="absolute bottom-8 right-8 z-[400] flex flex-col gap-3 pointer-events-auto">
                <div className="glass-heavy bg-white/90 dark:bg-gray-900/90 p-3 rounded-2xl shadow-2xl border border-white/50 flex flex-col gap-4">
                    <button className="p-2 text-gray-500 hover:text-indigo-600 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl active:scale-90" title="Map Layers">
                         <Layers className="w-5 h-5" />
                    </button>
                    <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-800"></div>
                    <button className="p-2 text-gray-500 hover:text-indigo-600 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl active:scale-90" title="Toggle Fullscreen">
                         <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
                {overlayActions}
            </div>

            <style>{`
                .leaflet-container {
                    background: #f1f5f9;
                    cursor: pointer;
                }
                .leaflet-bar {
                    border: none !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                    margin-top: 20px !important;
                    margin-left: 20px !important;
                }
                .leaflet-bar a {
                    background-color: white !important;
                    color: #4b5563 !important;
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 20px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2) !important;
                }
                .leaflet-popup-content {
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default BaseMap;
