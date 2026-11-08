import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import AIPriceSuggestion from "../components/AIPriceSuggestion";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import {
  Home,
  MapPin,
  Banknote,
  Image,
  FileText,
  Sparkles,
  Navigation,
  X,
} from "lucide-react";
import LocationPicker from "../components/map/LocationPicker";
import type { RoomFeatures } from "../lib/aiPricePredictor";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const CreateListing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const [step, setStep] = useState(1);
  const [showAIPricing, setShowAIPricing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditMode);

  // Derived values for verification
  const isLandlordOrAdvertiser = user?.role === "LANDLORD" || user?.role === "ADVERTISER";
  const needsVerification = isLandlordOrAdvertiser && !user?.isVerified;

  const [formData, setFormData] = useState({
    title: "",
    location: "downtown", // Default so validation never fails
    size: 20,
    roomType: "private" as "private" | "shared" | "studio",
    price: 0,
    description: "",
    furnished: true,
    hasWifi: true,
    hasParking: false,
    hasKitchen: true,
    hasLaundry: false,
    hasBalcony: false,
    petsAllowed: false,
    isMilitaryFriendly: false,
    distanceToUniversity: 2,
    floor: 1,
    latitude: 0,
    longitude: 0,
    googleMapsUrl: "",
  });

  // Auto-detect area from coordinates (rough bounding boxes for Egyptian regions)
  const detectAreaFromCoords = (lat: number, lng: number): string => {
    // Cairo center approx 30.044, 31.235
    // These are rough zones — adjust as needed
    if (lat >= 30.04 && lat <= 30.08 && lng >= 31.22 && lng <= 31.27) return 'downtown';
    if (lat >= 30.00 && lat <= 30.05 && lng >= 31.20 && lng <= 31.24) return 'university';
    if (lat >= 30.01 && lat <= 30.04 && lng >= 31.15 && lng <= 31.20) return 'campus';
    if (lat >= 30.00 && lat <= 30.02 && lng >= 31.38 && lng <= 31.50) return 'uptown'; // New Cairo
    if (lat >= 30.05 && lat <= 30.08 && lng >= 31.00 && lng <= 31.15) return 'uptown'; // 6 October
    // Default fallback
    return 'suburb';
  };

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!isEditMode) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
        const listing = response.data;

        // Parse amenities
        let amenities: string[] = [];
        try {
          if (typeof listing.amenities === "string") {
            amenities = JSON.parse(listing.amenities);
          } else if (Array.isArray(listing.amenities)) {
            amenities = listing.amenities;
          }
        } catch (e) {
          amenities = typeof listing.amenities === "string" ? [listing.amenities] : [];
        }

        setFormData({
          title: listing.title,
          location: listing.address,
          size: listing.size || 20,
          roomType: listing.roomType || "private",
          price: listing.price,
          description: listing.description,
          furnished: amenities.includes("furnished"),
          hasWifi: amenities.includes("wifi"),
          hasParking: amenities.includes("parking"),
          hasKitchen: amenities.includes("kitchen"),
          hasLaundry: amenities.includes("laundry"),
          hasBalcony: amenities.includes("balcony"),
          petsAllowed: amenities.includes("pets_allowed"),
          isMilitaryFriendly: amenities.includes("military_friendly"),
          latitude: listing.latitude,
          longitude: listing.longitude,
          googleMapsUrl: listing.googleMapsUrl || "",
          distanceToUniversity: 2, // Default or fetch if available
          floor: 1, // Default or fetch if available
        });

        if (listing.images && Array.isArray(listing.images)) {
          setImageUrls(listing.images.map((img: any) => img.url));
        }
      } catch (err) {
        console.error("Failed to fetch listing for edit", err);
        setError(t('failed_load_listing'));
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, isEditMode]);

  if (needsVerification) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full glass p-8 rounded-3xl text-center shadow-2xl border border-amber-200/50 dark:border-amber-900/30">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('verification_required')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {t('verification_required_desc')}
          </p>
          <div className="space-y-3">
            <Button
              variant="gradient"
              className="w-full py-6"
              onClick={() => navigate("/profile")}
            >
              {t('go_to_profile_to_verify')}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              {t('back_to_home')}
            </Button>
          </div>
        </div>
      </div>
    );
  }



  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: `Lat: ${position.coords.latitude.toFixed(
              4,
            )}, Long: ${position.coords.longitude.toFixed(4)}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(t('could_not_get_location'));
        },
      );
    } else {
      alert(t('geolocation_not_supported'));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handlePriceSelect = (price: number) => {
    setFormData((prev) => ({ ...prev, price }));
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.warn("No files selected");
      return;
    }

    const files = Array.from(e.target.files);
    console.log(`Selected ${files.length} files for upload`);

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is 5MB.`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError(`File "${file.name}" is not an image.`);
        return;
      }
    }

    setImages((prev) => [...prev, ...files]);
    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      console.log("Uploading images to:", `${API_BASE_URL}/upload/images`);
      const res = await axios.post(`${API_BASE_URL}/upload/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.urls && Array.isArray(res.data.urls)) {
        console.log("Upload successful, URLs:", res.data.urls);
        setImageUrls((prev) => [...prev, ...res.data.urls]);
        setError(""); // Clear any previous errors
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to upload images";
      setError(errorMsg);
    } finally {
      setUploading(false);
      // Reset the input so the same file can be uploaded again
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError(t('title_required'));
        setIsSubmitting(false);
        return;
      }
      // Location area always has a default — no blocking needed
      if (formData.price <= 0) {
        setError(t('price_greater_than_0'));
        setIsSubmitting(false);
        return;
      }
      if (!formData.description.trim()) {
        setError(t('description_required'));
        setIsSubmitting(false);
        return;
      }
      if (formData.latitude === 0 || formData.longitude === 0) {
        setError(t('select_location_on_map'));
        setIsSubmitting(false);
        return;
      }
      if (imageUrls.length === 0) {
        setError(t('upload_at_least_one_image'));
        setIsSubmitting(false);
        return;
      }

      const amenities = [];
      if (formData.furnished) amenities.push("furnished");
      if (formData.hasWifi) amenities.push("wifi");
      if (formData.hasParking) amenities.push("parking");
      if (formData.hasKitchen) amenities.push("kitchen");
      if (formData.hasLaundry) amenities.push("laundry");
      if (formData.hasBalcony) amenities.push("balcony");
      if (formData.petsAllowed) amenities.push("pets_allowed");
      if (formData.isMilitaryFriendly)
        amenities.push("military_friendly");

      const listingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price,
        address: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        googleMapsUrl: formData.googleMapsUrl,
        amenities,
        images: imageUrls,
        roomType: formData.roomType,
        size: formData.size,
      };

      if (isEditMode) {
        const response = await axios.put(
          `${API_BASE_URL}/listings/${id}`,
          listingData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.status === 200) {
          navigate("/my-listings");
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/listings`,
          listingData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.status === 201) {
          navigate("/my-listings");
        }
      }
    } catch (err: any) {
      console.error("Create listing error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        t("failed_create_listing"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoomFeatures = (): RoomFeatures => ({
    location: formData.location || "university",
    size: formData.size,
    roomType: formData.roomType,
    furnished: formData.furnished,
    hasWifi: formData.hasWifi,
    hasParking: formData.hasParking,
    hasKitchen: formData.hasKitchen,
    hasLaundry: formData.hasLaundry,
    distanceToUniversity: formData.distanceToUniversity,
    floor: formData.floor,
    hasBalcony: formData.hasBalcony,
    petsAllowed: formData.petsAllowed,
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <Home className="h-4 w-4" />
            <span>{isEditMode ? t('edit_listing') : t('create_new_listing')}</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? t('edit_your_listing') : t('post_your_room')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('find_perfect_roommate_ai')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-red-500"></div>
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="glass mb-8 rounded-2xl p-6 animate-fadeInUp stagger-1">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: t('basic_info') },
              { num: 2, label: t('features') },
              { num: 3, label: t('ai_pricing') },
              { num: 4, label: t('review') },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all ${step >= s.num
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`hidden text-sm font-medium md:block ${step >= s.num
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${step > s.num
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "bg-gray-200 dark:bg-gray-700"
                      }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="glass animate-fadeInUp rounded-2xl p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {t('basic_information')}
              </h2>
              <div className="space-y-5">
                <Input
                  label={t('listing_title')}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('cozy_room_placeholder')}
                  icon={<FileText className="h-5 w-5" />}
                  required
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('location')}
                    </label>

                    {/* Map pin confirmation badge */}
                    {formData.latitude && formData.longitude ? (
                      <div className="mb-3 flex items-center gap-3 rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-4 py-3 animate-fadeIn">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-700 dark:text-green-400">{t('pin_confirmed', 'Location Pin Set!')}</p>
                          <p className="text-xs text-green-600 dark:text-green-500 font-mono">
                            {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                          </p>
                        </div>
                        <div className="ms-auto text-xs text-green-600 dark:text-green-400 font-bold uppercase bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-lg">
                          {t(formData.location)} ✓
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 flex items-center gap-3 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 animate-pulse">
                        <MapPin className="h-5 w-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                          {t('click_map_exact_location', 'Click on the map below to pin your exact location')}
                        </p>
                      </div>
                    )}

                    {/* Area Dropdown + auto-detect note */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('general_area', 'General Area')}
                        </span>
                        {formData.latitude ? (
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                            ✨ {t('auto_detected', 'Auto-detected from map')}
                          </span>
                        ) : null}
                      </div>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-medium"
                      >
                        <option value="downtown">{t('downtown')}</option>
                        <option value="university">{t('university_area')}</option>
                        <option value="campus">{t('campus')}</option>
                        <option value="suburb">{t('suburb')}</option>
                        <option value="uptown">{t('uptown')}</option>
                      </select>
                    </div>

                    <LocationPicker
                      onLocationSelect={(lat, lng) => {
                        const detectedArea = detectAreaFromCoords(lat, lng);
                        setFormData((prev) => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                          location: detectedArea,
                        }));
                      }}
                      initialLat={formData.latitude || 30.0444}
                      initialLng={formData.longitude || 31.2357}
                    />

                    <div className="mt-4">
                      <Input
                        label={t('google_maps_link')}
                        name="googleMapsUrl"
                        value={formData.googleMapsUrl || ""}
                        onChange={handleChange}
                        placeholder="https://maps.app.goo.gl/..."
                        icon={<MapPin className="h-5 w-5" />}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('room_type_label')}
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="private">{t('private_room')}</option>
                      <option value="shared">{t('shared_room')}</option>
                      <option value="studio">{t('studio')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label={t('room_size_m2')}
                    name="size"
                    type="number"
                    value={formData.size}
                    onChange={handleChange}
                    min="10"
                    max="100"
                    required
                  />

                  <Input
                    label={t('distance_to_uni_km')}
                    name="distanceToUniversity"
                    type="number"
                    value={formData.distanceToUniversity}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder={t('describe_your_room')}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('property_images')}{" "}
                    {imageUrls.length > 0 && (
                      <span className="text-indigo-600">
                        ({imageUrls.length} {t('uploaded')})
                      </span>
                    )}
                  </label>
                  {imageUrls.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('click_x_to_remove')}
                    </span>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-xl border-2 border-green-200 shadow-md"
                    >
                      <img
                        src={url}
                        alt={`${t('listing')} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-all hover:bg-black/10"></div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-all hover:bg-red-600 hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                        ✓ {t('uploaded')}
                      </span>
                    </div>
                  ))}

                  <label className="relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-indigo-900/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <>
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mb-2"></div>
                          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {t('uploading')}
                          </p>
                        </>
                      ) : (
                        <>
                          <Image className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {t('click_to_upload')}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('image_upload_specs')}
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/png,image/jpeg,image/webp,image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      id="imageInput"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)} variant="gradient" size="lg">
                  {t('next_features')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Features */}
          {step === 2 && (
            <div className="glass animate-fadeInUp rounded-2xl p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {t('room_features_amenities')}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: "furnished", label: t('furnished'), icon: "🛋️" },
                  { name: "hasWifi", label: t('wifi_included'), icon: "📶" },
                  {
                    name: "hasParking",
                    label: t('parking_available'),
                    icon: "🚗",
                  },
                  { name: "hasKitchen", label: t('kitchen_access'), icon: "🍳" },
                  {
                    name: "hasLaundry",
                    label: t('laundry_facilities'),
                    icon: "🧺",
                  },
                  { name: "hasBalcony", label: t('balcony'), icon: "🌿" },
                  { name: "petsAllowed", label: t('pets_allowed_label'), icon: "🐕" },
                  {
                    name: "isMilitaryFriendly",
                    label: t('supports_military'),
                    icon: "🪖",
                  },
                ].map((feature) => (
                  <label
                    key={feature.name}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20"
                  >
                    <input
                      type="checkbox"
                      name={feature.name}
                      checked={
                        formData[
                        feature.name as keyof typeof formData
                        ] as boolean
                      }
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {feature.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <Input
                  label={t('floor_number')}
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleChange}
                  min="0"
                  max="50"
                />
              </div>

              <div className="mt-6 flex justify-between">
                <Button onClick={() => setStep(1)} variant="outline" size="lg">
                  {t('back')}
                </Button>
                <Button onClick={() => setStep(3)} variant="gradient" size="lg">
                  {t('next_ai_pricing')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Pricing */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="glass rounded-2xl p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                      {t('ai_price_recommendation')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('ai_analyzes_market')}
                    </p>
                  </div>
                  <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
                </div>

                <AIPriceSuggestion
                  features={getRoomFeatures()}
                  currentPrice={formData.price || undefined}
                  onPriceSelect={handlePriceSelect}
                />

                <div className="mt-6">
                  <Input
                    label={t('your_price_egp')}
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    icon={<Banknote className="h-5 w-5" />}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button onClick={() => setStep(2)} variant="outline" size="lg">
                  {t('back')}
                </Button>
                <Button onClick={() => setStep(4)} variant="gradient" size="lg">
                  {t('review_listing')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="glass animate-fadeInUp rounded-2xl p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {t('review_your_listing')}
              </h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                    {formData.title}
                  </h3>
                  <p className="mb-3 text-gray-700 dark:text-gray-300">
                    {formData.description}
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('location')}:
                      </span>
                      <span className="font-semibold capitalize text-gray-900 dark:text-white">
                        {t(formData.location)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('room_type_label')}:
                      </span>
                      <span className="font-semibold capitalize text-gray-900 dark:text-white">
                        {t(formData.roomType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('room_size_m2')}:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formData.size} m²
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('price')}:
                      </span>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {formData.price} {t('currency')}/{t('per_month')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                  <h4 className="mb-2 font-semibold text-indigo-900 dark:text-indigo-300">
                    {t('amenities')}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData)
                      .filter(
                        ([key, value]) => typeof value === "boolean" && value,
                      )
                      .map(([key]) => (
                        <span
                          key={key}
                          className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300"
                        >
                          {t(key.replace(/([A-Z])/g, "_$1").toLowerCase())}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button onClick={() => setStep(3)} variant="outline" size="lg">
                  {t('back')}
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  isLoading={isSubmitting}
                >
                  {!isSubmitting && (
                    <>
                      <Home className="mr-2 h-5 w-5" />
                      {t('publish_listing')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
