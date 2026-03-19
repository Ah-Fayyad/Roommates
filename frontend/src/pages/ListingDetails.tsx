import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  MapPin,
  DollarSign,
  Home,
  Users,
  Heart,
  Share2,
  MessageCircle,
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Wifi,
  Car,
  Phone,
  Utensils,
  Sparkles,
  Flag,
  Trash2,
  Edit2,
  Shield,
  ShieldCheck,
  Copy,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { socketService } from "../services/socket.service";
import ReportModal from "../components/ReportModal";
import ListingMap from "../components/map/ListingMap";
import { API_BASE_URL } from "../config/constants";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitMessage, setVisitMessage] = useState("");
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<"LISTING" | "USER">("LISTING");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [priceAdvice, setPriceAdvice] = useState<any>(null);
  const [imageDescription, setImageDescription] = useState<string>("");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchImageDescription = async (url: string) => {
    if (!url) return;
    setIsAnalyzingImage(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/analyze-image`, {
        imageUrl: url,
      });
      setImageDescription(response.data.description);
    } catch (error) {
      console.error("Failed to analyze image");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const fetchPriceAdvice = async (
    price: number,
    address: string,
    amenities: any,
  ) => {
    try {
      // Extract area from address (simple heuristic)
      const area = address.split(",").pop()?.trim() || "Cairo";
      const response = await axios.post(`${API_BASE_URL}/ai/price-advice`, {
        price,
        area,
        amenities: Array.isArray(amenities) ? amenities : [],
      });
      setPriceAdvice(response.data);
    } catch (error) {
      console.error("Failed to fetch price advice");
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
        const data = response.data;
        setListing(data);
        fetchPriceAdvice(data.price, data.address, data.amenities);
        // Check if favorite
        if (token) {
          const favResponse = await axios.get(
            `${API_BASE_URL}/favorites/${id}/check`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setIsFavorite(favResponse.data.isFavorite);
        }
      } catch (error) {
        console.error("Failed to fetch listing", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, token]);

  const handleShare = async () => {
    const shareData = {
      title: listing.title,
      text: t('check_this_listing') + `: ${listing.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('link_copied'));
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleVisitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    setRequestStatus("loading");
    try {
      await axios.post(
        `${API_BASE_URL}/visits/request`,
        {
          listingId: id,
          proposedTimes: [visitDate],
          message: visitMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Notify owner via socket
      socketService.emit("visit_request", {
        listingId: id,
        ownerId: listing.ownerId,
        proposedTimes: [visitDate],
      });

      setRequestStatus("success");
      setTimeout(() => {
        setShowVisitModal(false);
        setRequestStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Failed to request visit", error);
      setRequestStatus("error");
    }
  };

  const toggleFavorite = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/favorites/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  const handleDeleteListing = async () => {
    if (!token || listing?.ownerId !== user?.id) {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirm(false);
      navigate("/my-listings");
    } catch (error: any) {
      console.error("Failed to delete listing", error);
      setDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
      setImageDescription("");
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + listing.images.length) % listing.images.length,
      );
      setImageDescription("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('loading')}
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('listing_not_found')}
      </div>
    );
  }

  // Fallback images if none provided
  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((img: any) => img.url)
      : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-6xl px-4 mx-auto">
        {/* Image Gallery */}
        <div className="mb-6 overflow-hidden glass animate-fadeInUp rounded-3xl">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={images[currentImageIndex]}
              alt={listing.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";
              }}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute flex items-center justify-center w-12 h-12 text-gray-900 transition-all -translate-y-1/2 rounded-full shadow-lg left-4 top-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute flex items-center justify-center w-12 h-12 text-gray-900 transition-all -translate-y-1/2 rounded-full shadow-lg right-4 top-1/2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute px-4 py-2 text-sm font-semibold text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-black/70">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Action Buttons */}
            <div className="absolute flex gap-2 right-4 top-4">
              <button
                onClick={() => fetchImageDescription(images[currentImageIndex])}
                disabled={isAnalyzingImage}
                className="flex items-center justify-center w-12 h-12 text-gray-900 transition-all rounded-full shadow-lg bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800 group overflow-hidden relative"
                title={t('ai_image_analysis')}
              >
                <Sparkles
                  className={`w-6 h-6 text-indigo-600 ${isAnalyzingImage ? "animate-pulse scale-125" : "group-hover:scale-110"}`}
                />
                {isAnalyzingImage && (
                  <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
                )}
              </button>
              <button
                onClick={toggleFavorite}
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all ${isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-900 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
                  }`}
              >
                <Heart
                  className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* AI Description Overlay */}
            {(isAnalyzingImage || imageDescription) && (
              <div className="absolute bottom-16 left-4 right-4 animate-fadeInUp">
                <div className="p-5 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border-2 border-indigo-500/50 shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden">
                  {isAnalyzingImage ? (
                    <div className="flex flex-col items-center py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce delay-100" />
                        <div className="h-2 w-2 bg-pink-600 rounded-full animate-bounce delay-200" />
                      </div>
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">
                        {t('analyzing_space')}
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setImageDescription("")}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {t('ai_insight')}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              ✨ {t('highly_clean_space')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-semibold">
                            {imageDescription}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all ${index === currentImageIndex
                    ? "ring-4 ring-indigo-600"
                    : "opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={image}
                    alt={`${t('thumbnail')} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title and Price */}
            <div className="p-6 glass animate-fadeInUp stagger-1 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5" />
                    {listing.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="text-base font-normal text-gray-500">
                      {t('egp')}
                    </span>
                    {listing.price.toLocaleString(isArabic ? 'ar-EG' : 'en-US')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('per_month')}
                  </div>
                </div>
              </div>

              {/* AI Price Advisor UI */}
              {priceAdvice && (
                <div
                  className={`mt-4 flex items-center gap-3 rounded-xl border p-4 ${priceAdvice.status === "GOOD"
                    ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-950/20"
                    : priceAdvice.status === "HIGH"
                      ? "border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20"
                      : "border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/20"
                    }`}
                >
                  <div
                    className={`rounded-full p-2 ${priceAdvice.status === "GOOD" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {t('ai_price_advisor')}
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {priceAdvice.status === "GOOD" ? t('ai_price_good') : priceAdvice.status === "HIGH" ? t('ai_price_high') : t('ai_price_fair')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-6 glass animate-fadeInUp stagger-2 rounded-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('description')}
              </h2>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="p-6 glass animate-fadeInUp stagger-3 rounded-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('amenities')}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {(() => {
                  let amenitiesList: string[] = [];
                  try {
                    if (typeof listing.amenities === "string") {
                      amenitiesList = JSON.parse(listing.amenities);
                    } else if (Array.isArray(listing.amenities)) {
                      amenitiesList = listing.amenities;
                    }
                  } catch (e) {
                    amenitiesList =
                      typeof listing.amenities === "string"
                        ? [listing.amenities]
                        : [];
                  }

                  return amenitiesList.map((amenity: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center justify-center w-10 h-10 text-indigo-600 rounded-full bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {t(amenity) || amenity}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Map */}
            <div className="p-6 glass animate-fadeInUp stagger-4 rounded-2xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('location')}
              </h2>
              <div className="w-full overflow-hidden bg-gray-200 h-80 rounded-xl dark:bg-gray-700">
                <ListingMap
                  lat={listing.latitude}
                  lng={listing.longitude}
                  title={listing.title}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Owner & Actions Card */}
            <div className="p-6 glass animate-fadeInUp stagger-5 rounded-2xl border border-white/40 dark:border-gray-800/40">
              {user?.id !== listing.owner.id ? (
                <>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                      <img
                        src={
                          listing.owner?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.owner?.fullName || t('owner_label'))}&background=random`
                        }
                        alt={listing.owner?.fullName}
                        className="object-cover w-14 h-14 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            {listing.owner?.fullName}
                          </h4>
                          {listing.owner?.isVerified && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setReportTarget("USER");
                            setShowReportModal(true);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title={t('report_user')}
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        {t('active_recently')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Messaging & Visit Actions */}
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="gradient"
                        className="w-full shadow-lg shadow-indigo-500/20 py-7 rounded-2xl flex items-center justify-center gap-2 group"
                        onClick={async () => {
                          if (!token) {
                            navigate("/login");
                            return;
                          }
                          try {
                            const response = await axios.post(
                              `${API_BASE_URL}/chats`,
                              { participantId: listing.owner.id },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            navigate(`/chat/${response.data.id}`);
                          } catch (error) {
                            console.error("Failed to start chat", error);
                          }
                        }}
                      >
                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">{t('message_internally')}</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full py-7 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2 group"
                        onClick={() => setShowVisitModal(true)}
                      >
                        <Calendar className="w-5 h-5 text-indigo-500 group-hover:rotate-12 transition-transform" />
                        <span className="font-bold text-gray-700 dark:text-gray-200">{t('request_visit')}</span>
                      </Button>
                    </div>

                    {/* Contact Information Section - Professional Redesign */}
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {t('contact_information')}
                      </h4>

                      {!showPhone ? (
                        <button
                          onClick={() => {
                            if (!token) {
                              navigate("/login");
                              return;
                            }
                            setShowPhone(true);
                          }}
                          className="w-full group p-4 bg-gray-50 dark:bg-gray-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 transition-all duration-300 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{t('show_contact_info')}</p>
                              <p className="text-[10px] text-gray-500">{t('verified_landlords_benefit', 'Encrypted & Secure')}</p>
                            </div>
                          </div>
                          <div className="text-indigo-600 font-bold text-xs group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                            {t('show')} →
                          </div>
                        </button>
                      ) : (
                        <div className="space-y-4 animate-scaleIn">
                          {listing.owner?.phoneNumber ? (
                            <div className="p-5 glass-heavy rounded-2xl border border-indigo-100 dark:border-indigo-900/30 overflow-hidden relative">
                              {/* Background Accent */}
                              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full -mr-10 -mt-10"></div>

                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-tighter text-indigo-500 mb-1">
                                    {t('direct_contact')}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight" dir="ltr">
                                      {listing.owner.phoneNumber}
                                    </p>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(listing.owner.phoneNumber);
                                        alert(t('link_copied'));
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                      title={t('copy_number')}
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <a
                                  href={`tel:${listing.owner.phoneNumber}`}
                                  className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                                >
                                  <Phone className="w-4 h-4 fill-current" />
                                  {t('call')}
                                </a>
                                <a
                                  href={`https://wa.me/${listing.owner.phoneNumber.replace(/^0/, "20").replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                                >
                                  <MessageCircle className="w-4 h-4 fill-current" />
                                  {t('whatsapp')}
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                              <p className="text-xs text-amber-800 dark:text-amber-200">
                                {t('phone_not_provided_landlord')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/50">
                    {/* Report Card - Prominent & Visible */}
                    <div className="rounded-2xl border-2 border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-4 mb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                          <Flag className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{t('safety_center')}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('safety_note')}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 py-3 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all rounded-xl font-bold"
                        onClick={() => {
                          setReportTarget("LISTING");
                          setShowReportModal(true);
                        }}
                      >
                        <Flag className="w-4 h-4" />
                        <span>{t('report_listing_detailed')}</span>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {t('manage_listing')}
                    </h3>
                  </div>

                  <Link to={`/listings/edit/${id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full text-indigo-600 border-indigo-200"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t('edit_listing')}
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:bg-red-50"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('delete_listing')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visit Request Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 glass rounded-2xl animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('request_a_visit')}
              </h3>
              <button
                onClick={() => setShowVisitModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {requestStatus === "success" ? (
              <div className="py-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-green-600 bg-green-100 rounded-full">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('request_sent')}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('owner_notified_visit')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleVisitRequest} className="space-y-4">
                {requestStatus === "error" && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 dark:bg-red-900/20 dark:text-red-400">
                    {t('failed_send_request')}
                  </div>
                )}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('proposed_date_time')}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('message_optional')}
                  </label>
                  <textarea
                    value={visitMessage}
                    onChange={(e) => setVisitMessage(e.target.value)}
                    placeholder={t('visit_placeholder')}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={requestStatus === "loading"}
                >
                  {requestStatus === "loading" ? t('sending') : t('send_request')}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 glass rounded-2xl animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('contact')} {listing.owner?.fullName || t('owner_label')}
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('send_message_intro')}
              </p>

              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={t('contact_placeholder')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-indigo-500 focus:ring-0 min-h-[120px]"
              />

              <div className="flex gap-2 justify-end">
                <Button
                  className="w-full"
                  variant="gradient"
                  disabled={
                    messageStatus === "sending" || !contactMessage.trim()
                  }
                  onClick={async () => {
                    setMessageStatus("sending");
                    try {
                      // 1. Create/Get Chat
                      const chatRes = await axios.post(
                        `${API_BASE_URL}/chats`,
                        {
                          participantId: listing.ownerId,
                        },
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        },
                      );

                      const chatId = chatRes.data.id;

                      // 2. Send Message
                      await axios.post(
                        `${API_BASE_URL}/chats/${chatId}/messages`,
                        {
                          content: contactMessage,
                        },
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        },
                      );

                      setMessageStatus("success");
                      // Navigate to chat after short delay
                      setTimeout(() => {
                        navigate(`/chat/${chatId}`);
                      }, 1000);
                    } catch (error) {
                      console.error("Failed to send message", error);
                      setMessageStatus("error");
                    }
                  }}
                >
                  {messageStatus === "sending"
                    ? t('sending')
                    : messageStatus === "success"
                      ? t('sent')
                      : t('send_message')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeInUp">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('delete_listing_confirm')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('delete_listing_warning')}{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  "{listing?.title}"
                </span>
                ? {t('cannot_be_undone')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="gradient"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDeleteListing}
                disabled={deleting}
              >
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    {t('deleting')}
                  </div>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('delete')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={reportTarget === "LISTING" ? (id || "") : (listing?.ownerId || "")}
        targetType={reportTarget}
      />
    </div>
  );
};

export default ListingDetails;
