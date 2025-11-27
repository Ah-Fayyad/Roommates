import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Search, MapPin, DollarSign, Users, Home, SlidersHorizontal, Heart, Star } from 'lucide-react';
import AllListingsMap from '../components/map/AllListingsMap';

const Listings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState('all');
    const [roomType, setRoomType] = useState('all');
    const [showMap, setShowMap] = useState(false);

    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/listings');
                setListings(response.data);
            } catch (err) {
                console.error('Failed to fetch listings', err);
                setError('Failed to load listings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = priceRange === 'all' ||
            (priceRange === 'low' && listing.price < 400) ||
            (priceRange === 'mid' && listing.price >= 400 && listing.price < 600) ||
            (priceRange === 'high' && listing.price >= 600);
        const matchesType = roomType === 'all' || listing.roomType === roomType;

        return matchesSearch && matchesPrice && matchesType;
    });

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {loading && (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                )}

                {error && (
                    <div className="mb-8 rounded-xl bg-red-50 p-4 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Header */}
                        <div className="mb-8 animate-fadeInUp">
                            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                                Find Your Perfect Room
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Browse {filteredListings.length} available listings
                            </p>
                        </div>

                        {/* Search and Filters */}
                        <div className="glass animate-fadeInUp stagger-1 mb-8 rounded-2xl p-6">
                            <div className="grid gap-4 md:grid-cols-4">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by location or title..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="all">All Prices</option>
                                        <option value="low">Under $400</option>
                                        <option value="mid">$400 - $600</option>
                                        <option value="high">$600+</option>
                                    </select>
                                </div>

                                {/* Room Type */}
                                <div>
                                    <select
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Private">Private</option>
                                        <option value="Shared">Shared</option>
                                        <option value="Studio">Studio</option>
                                    </select>
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50">
                                    <SlidersHorizontal className="mr-2 inline h-4 w-4" />
                                    More Filters
                                </button>
                                <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Verified Only
                                </button>
                                <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Pet Friendly
                                </button>
                            </div>
                        </div>

                        {/* Create Listing Button and View Toggle */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fadeInUp stagger-2">
                            <Link to="/create-listing">
                                <Button variant="gradient" size="lg">
                                    <Home className="mr-2 h-5 w-5" />
                                    Post Your Listing
                                </Button>
                            </Link>

                            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                                <button
                                    onClick={() => setShowMap(false)}
                                    className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all ${!showMap
                                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    List View
                                </button>
                                <button
                                    onClick={() => setShowMap(true)}
                                    className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all ${showMap
                                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Map View
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {showMap ? (
                            <div className="animate-fadeIn">
                                <AllListingsMap listings={filteredListings} />
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredListings.map((listing, index) => (
                                    <Link
                                        key={listing.id}
                                        to={`/listings/${listing.id}`}
                                        className="card-hover glass group animate-fadeInUp overflow-hidden rounded-2xl"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                                                alt={listing.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {listing.owner?.isVerified && (
                                                <div className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                                    ✓ Verified
                                                </div>
                                            )}
                                            <button className="absolute left-3 top-3 rounded-full bg-white/90 p-2 text-gray-700 transition-all hover:bg-white hover:text-red-500 dark:bg-gray-800/90 dark:text-gray-300">
                                                <Heart className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <div className="mb-2 flex items-start justify-between">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {listing.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    {listing.rating || 'New'}
                                                </div>
                                            </div>

                                            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <MapPin className="h-4 w-4" />
                                                {listing.address}
                                            </div>

                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {listing.amenities?.slice(0, 3).map((feature: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        ${listing.price}
                                                    </span>
                                                    <span className="text-sm text-gray-500">/month</span>
                                                </div>
                                                <div className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                                    {listing.roomType}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {filteredListings.length === 0 && (
                            <div className="glass animate-fadeIn rounded-2xl p-12 text-center">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                    <Search className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                    No listings found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Try adjusting your filters or search terms
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Listings;
