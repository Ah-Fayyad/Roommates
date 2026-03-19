import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from '../config/constants';
import { Button } from '../components/ui/Button';
import { Heart, MapPin, Eye, Trash2, Home } from 'lucide-react';

const Favorites = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data);
        } catch (error) {
            console.error('Failed to fetch favorites', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchFavorites();
    }, [token]);

    const handleRemoveFavorite = async (listingId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axios.delete(`${API_BASE_URL}/favorites/${listingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(prev => prev.filter(fav => fav.listing.id !== listingId));
        } catch (error) {
            console.error('Failed to remove favorite', error);
            alert(t('failed_remove_favorite'));
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">{t("loading")}</div>;

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8 animate-fadeInUp">
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                        <Heart className="h-8 w-8 text-red-500 fill-current" />
                        {t("saved_rooms_title")}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {favorites.length} {t("listings_saved_for_later")}
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="glass flex flex-col items-center justify-center p-12 text-center rounded-3xl animate-fadeInUp stagger-1">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                            <Heart className="h-10 w-10 text-red-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{t("no_saved_rooms_yet")}</h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-xs">{t("start_browsing_save_favs")}</p>
                        <Link to="/listings">
                            <Button variant="gradient">{t("browse_listings")}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {favorites.map((fav, index) => {
                            const listing = fav.listing;
                            return (
                                <Link
                                    key={fav.id}
                                    to={`/listings/${listing.id}`}
                                    className="glass card-hover group flex flex-col overflow-hidden rounded-3xl animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={listing.images[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                                            alt={listing.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold border ${listing.status === 'ACTIVE'
                                            ? 'bg-green-500/90 text-white border-green-400'
                                            : 'bg-gray-500/90 text-white border-gray-400'
                                            }`}>
                                            {listing.status === 'ACTIVE' ? t('status_active', 'Active') : t('status_inactive', 'Inactive')}
                                        </div>
                                        <button
                                            onClick={(e) => handleRemoveFavorite(listing.id, e)}
                                            className="absolute top-4 left-4 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-all shadow-sm"
                                            title={t("remove_from_favorites")}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-start justify-between">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{listing.title}</h3>
                                            <span className="text-indigo-600 font-bold">{listing.price} {t("currency", "EGP")}</span>
                                        </div>
                                        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            <span className="truncate">{listing.address}</span>
                                        </div>
                                        <div className="mt-auto pt-4 border-t dark:border-gray-700">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Eye className="mr-2 h-4 w-4" /> {t("view_details")}
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
