import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Search,
  MapPin,
  Banknote,
  Users,
  Home,
  SlidersHorizontal,
  Heart,
  Star,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import AllListingsMap from "../components/map/AllListingsMap";
import { API_BASE_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";

const Listings = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [showMap, setShowMap] = useState(false);

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);

  const availableAmenities = [
    "WiFi",
    "AC",
    "Heating",
    "Washer",
    "Dryer",
    "Parking",
    "Gym",
    "Pool",
    "Elevator",
    "Balcony",
  ];

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  // Favorites Logic
  const { token, user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      const fetchFavorites = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavorites(res.data.map((fav: any) => fav.listingId));
        } catch (error) {
          console.error("Failed to fetch favorites", error);
        }
      };
      fetchFavorites();
    }
  }, [token]);

  const toggleFavorite = async (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Please login to add favorites");
      return;
    }

    try {
      if (favorites.includes(listingId)) {
        await axios.delete(`${API_BASE_URL}/favorites/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((id) => id !== listingId));
      } else {
        await axios.post(
          `${API_BASE_URL}/favorites/${listingId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setFavorites((prev) => [...prev, listingId]);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      alert("Could not update favorite. Please try again.");
    }
  };

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAiSearching, setIsAiSearching] = useState(false);

  const fetchListings = async (searchParams = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/listings`, {
        params: searchParams,
      });
      setListings(response.data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
      setError("Failed to load listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/semantic-search`, {
        params: { query: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });

      const { area, maxPrice, amenities } = response.data.filters;

      // Update local filters and fetch
      if (area) setSearchTerm(area);
      if (maxPrice) setPriceRange(maxPrice.toString());
      if (amenities) setSelectedAmenities(amenities);

      fetchListings({
        area,
        maxPrice,
        amenities: JSON.stringify(amenities),
      });
    } catch (err) {
      console.error("Semantic search failed", err);
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      (listing.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (listing.address?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    // Price Logic (EGP)
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && listing.price < 4000) ||
      (priceRange === "mid" && listing.price >= 4000 && listing.price < 8000) ||
      (priceRange === "high" && listing.price >= 8000);

    const matchesType =
      roomType === "all" ||
      (listing.roomType?.toLowerCase() || "private") === roomType;

    // Verified Only Logic
    const matchesVerified = !verifiedOnly || listing.owner?.isVerified;

    // Amenities Logic
    let listingAmenities: string[] = [];
    try {
      if (typeof listing.amenities === "string") {
        listingAmenities = JSON.parse(listing.amenities);
      } else if (Array.isArray(listing.amenities)) {
        listingAmenities = listing.amenities;
      }
    } catch (e) {
      listingAmenities = [];
    }

    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((a) => listingAmenities.includes(a));

    // Pet Friendly Logic (Assuming 'Pets Allowed' is an amenity for now or simple check)
    const matchesPets =
      !petFriendly || listingAmenities.includes("Pets Allowed");

    return (
      matchesSearch &&
      matchesPrice &&
      matchesType &&
      matchesVerified &&
      matchesAmenities &&
      matchesPets
    );
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
                {t('find_perfect_room')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('browse_listings_count', { count: filteredListings.length })}
              </p>
            </div>

            {/* Search and Filters */}
            <div className="glass animate-fadeInUp stagger-1 mb-8 rounded-2xl p-6">
              <div className="grid gap-4 md:grid-cols-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative group">
                    <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder={t('search_listings_placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 ps-12 pe-28 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <button
                      onClick={handleAiSearch}
                      disabled={isAiSearching || !searchTerm.trim()}
                      className="absolute end-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
                    >
                      {isAiSearching ? (
                        <div className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span>{t('ai_search')}</span>
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">{t('all_prices')}</option>
                    <option value="low">{t('low_price')}</option>
                    <option value="mid">{t('mid_price')}</option>
                    <option value="high">{t('high_price')}</option>
                  </select>
                </div>

                {/* Room Type */}
                <div>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 px-4 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">{t('all_types')}</option>
                    <option value="private">{t('private')}</option>
                    <option value="shared">{t('shared')}</option>
                    <option value="studio">{t('studio')}</option>
                  </select>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowFiltersModal(true)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedAmenities.length > 0
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                    }`}
                >
                  <SlidersHorizontal className="me-2 inline h-4 w-4" />
                  {t('more_filters')}{" "}
                  {selectedAmenities.length > 0 &&
                    `(${selectedAmenities.length})`}
                </button>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${verifiedOnly
                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                  {t('verified_only')}
                </button>
                <button
                  onClick={() => setPetFriendly(!petFriendly)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${petFriendly
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                  {t('pet_friendly')}
                </button>
              </div>
            </div>

            {/* User Perks & Actions */}
            <div className="mb-10 space-y-8 animate-fadeInUp stagger-2">
              {user?.role === "USER" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: t('smart_matching'),
                      desc: t('smart_matching_desc_short'),
                      icon: "🧠",
                    },
                    {
                      title: t('verified_students'),
                      desc: t('verified_students_desc'),
                      icon: "🛡️",
                    },
                    {
                      title: t('student_support'),
                      desc: t('student_support_desc'),
                      icon: "🪖",
                    },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 backdrop-blur-sm"
                    >
                      <span className="text-3xl">{b.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                          {b.title}
                        </h3>
                        <p className="text-xs text-gray-500">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {user?.role === "LANDLORD" ? (
                  <Link to="/listings/create">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="shadow-lg shadow-indigo-500/20"
                    >
                      <PlusCircle className="me-2 h-5 w-5" />
                      {t('post_your_room')}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/matches">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="shadow-lg shadow-indigo-500/20"
                    >
                      <Sparkles className="me-2 h-5 w-5" />
                      {t('find_smart_match')}
                    </Button>
                  </Link>
                )}

                <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800 shadow-inner">
                  <button
                    onClick={() => setShowMap(false)}
                    className={`flex items-center rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${!showMap
                      ? "bg-white text-indigo-600 shadow-md dark:bg-gray-700 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      }`}
                  >
                    <SlidersHorizontal className="me-2 h-4 w-4" />
                    {t('list_view')}
                  </button>
                  <button
                    onClick={() => setShowMap(true)}
                    className={`flex items-center rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${showMap
                      ? "bg-white text-indigo-600 shadow-md dark:bg-gray-700 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      }`}
                  >
                    <MapPin className="me-2 h-4 w-4" />
                    {t('map_view')}
                  </button>
                </div>
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
                        src={
                          listing.images?.[0]?.url ||
                          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                        }
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";
                        }}
                      />
                      {listing.owner?.isVerified && (
                        <div className="absolute end-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                          ✓ {t('verified')}
                        </div>
                      )}
                      <button
                        onClick={(e) => toggleFavorite(e, listing.id)}
                        className={`absolute start-3 top-3 rounded-full p-2 transition-all shadow-sm ${favorites.includes(listing.id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white/90 text-gray-700 hover:bg-white hover:text-red-500 dark:bg-gray-800/90 dark:text-gray-300"
                          }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.includes(listing.id) ? "fill-current" : ""}`}
                        />
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
                          {listing.rating || t('new_listing')}
                        </div>
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {listing.address}
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {(() => {
                          let amenitiesList: string[] = [];
                          try {
                            if (typeof listing.amenities === "string") {
                              amenitiesList = JSON.parse(listing.amenities);
                            } else if (Array.isArray(listing.amenities)) {
                              amenitiesList = listing.amenities;
                            }
                          } catch (e) {
                            // Fallback if parsing fails or simple string
                            amenitiesList =
                              typeof listing.amenities === "string"
                                ? [listing.amenities]
                                : [];
                          }

                          return amenitiesList
                            .slice(0, 3)
                            .map((feature: string, idx: number) => (
                              <span
                                key={idx}
                                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                              >
                                {t(feature) || feature}
                              </span>
                            ));
                        })()}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          <span className="text-xs font-normal text-gray-500">
                            {t('egp')}
                          </span>
                          {listing.price.toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}
                          <span className="text-xs font-normal text-gray-500">
                            {t('per_month_short')}
                          </span>
                        </div>
                        <div className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                          {listing.roomType || "Private"}
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
                  {t('no_listings_found')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('no_listings_found_desc')}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 glass rounded-2xl animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('all_filters')}
              </h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                X
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                  {t('amenities')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {availableAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                  Type
                </h4>
                <div className="flex gap-2">
                  {["all", "private", "shared", "studio"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRoomType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${roomType === type
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedAmenities([]);
                  setVerifiedOnly(false);
                  setPriceRange("all");
                  setRoomType("all");
                  setShowFiltersModal(false);
                }}
              >
                {t('reset_all')}
              </Button>
              <Button
                variant="gradient"
                onClick={() => setShowFiltersModal(false)}
              >
                {t('show_listings')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
