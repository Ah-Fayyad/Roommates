import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import AIPriceSuggestion from '../components/AIPriceSuggestion';
import { Home, MapPin, DollarSign, Image, FileText, Sparkles, Navigation, X } from 'lucide-react';
import LocationPicker from '../components/map/LocationPicker';
import type { RoomFeatures } from '../lib/aiPricePredictor';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateListing = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const [showAIPricing, setShowAIPricing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        size: 20,
        roomType: 'private' as 'private' | 'shared' | 'studio',
        price: 0,
        description: '',
        furnished: true,
        hasWifi: true,
        hasParking: false,
        hasKitchen: true,
        hasLaundry: false,
        hasBalcony: false,
        petsAllowed: false,
        distanceToUniversity: 2,
        floor: 1,
        latitude: 0,
        longitude: 0
    });

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        location: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`
                    }));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Please enter address manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? Number(value) : value
        }));
    };

    const handlePriceSelect = (price: number) => {
        setFormData(prev => ({ ...prev, price }));
    };

    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);

            setUploading(true);
            const formData = new FormData();
            files.forEach(file => {
                formData.append('images', file);
            });

            try {
                const res = await axios.post('http://localhost:5000/api/upload/images', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setImageUrls(prev => [...prev, ...res.data.urls]);
            } catch (err) {
                console.error('Upload failed', err);
                setError('Failed to upload images');
            } finally {
                setUploading(false);
            }
        }
    };

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const amenities = [];
            if (formData.furnished) amenities.push('Furnished');
            if (formData.hasWifi) amenities.push('WiFi');
            if (formData.hasParking) amenities.push('Parking');
            if (formData.hasKitchen) amenities.push('Kitchen');
            if (formData.hasLaundry) amenities.push('Laundry');
            if (formData.hasBalcony) amenities.push('Balcony');
            if (formData.petsAllowed) amenities.push('Pets Allowed');

            const listingData = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                address: formData.location,
                latitude: formData.latitude || 0,
                longitude: formData.longitude || 0,
                amenities,
                images: imageUrls // Send array of strings directly
            };

            await axios.post('http://localhost:5000/api/listings', listingData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/listings');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create listing');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoomFeatures = (): RoomFeatures => ({
        location: formData.location || 'university',
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
                        <span>Create New Listing</span>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                        Post Your Room
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Find the perfect roommate with our AI-powered platform
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="glass mb-8 rounded-2xl p-6 animate-fadeInUp stagger-1">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: 'Basic Info' },
                            { num: 2, label: 'Features' },
                            { num: 3, label: 'AI Pricing' },
                            { num: 4, label: 'Review' }
                        ].map((s, idx) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-2">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all ${step >= s.num
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {s.num}
                                    </div>
                                    <span className={`hidden text-sm font-medium md:block ${step >= s.num
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < 3 && (
                                    <div className={`h-1 flex-1 rounded-full transition-all ${step > s.num
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                                        : 'bg-gray-200 dark:bg-gray-700'
                                        }`}></div>
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
                                Basic Information
                            </h2>
                            <div className="space-y-5">
                                <Input
                                    label="Listing Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Cozy Room Near Campus"
                                    icon={<FileText className="h-5 w-5" />}
                                    required
                                />

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Location
                                        </label>
                                        <div className="mb-4 grid gap-5 md:grid-cols-2">
                                            <select
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                                required
                                            >
                                                <option value="">Select general area</option>
                                                <option value="downtown">Downtown</option>
                                                <option value="university">University Area</option>
                                                <option value="campus">Campus</option>
                                                <option value="suburb">Suburb</option>
                                                <option value="uptown">Uptown</option>
                                            </select>
                                            <div className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                                                <MapPin className="h-5 w-5 text-gray-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formData.latitude && formData.longitude
                                                        ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                                                        : 'Select on map'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            Click on the map to pin the exact location
                                        </div>
                                        <LocationPicker
                                            onLocationSelect={(lat, lng) => {
                                                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                            }}
                                            initialLat={formData.latitude || 30.0444}
                                            initialLng={formData.longitude || 31.2357}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Room Type
                                        </label>
                                        <select
                                            name="roomType"
                                            value={formData.roomType}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="private">Private Room</option>
                                            <option value="shared">Shared Room</option>
                                            <option value="studio">Studio</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <Input
                                        label="Room Size (m²)"
                                        name="size"
                                        type="number"
                                        value={formData.size}
                                        onChange={handleChange}
                                        min="10"
                                        max="100"
                                        required
                                    />

                                    <Input
                                        label="Distance to University (km)"
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
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        placeholder="Describe your room, neighborhood, and what makes it special..."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-8">
                                <label className="mb-4 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Property Images
                                </label>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="relative aspect-video overflow-hidden rounded-xl">
                                            <img src={url} alt={`Listing ${index + 1}`} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-indigo-900/20">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {uploading ? (
                                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                                            ) : (
                                                <>
                                                    <Image className="mb-2 h-8 w-8 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PNG, JPG or WebP
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button onClick={() => setStep(2)} variant="gradient" size="lg">
                                    Next: Features
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Features */}
                    {step === 2 && (
                        <div className="glass animate-fadeInUp rounded-2xl p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                                Room Features & Amenities
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    { name: 'furnished', label: 'Furnished', icon: '🛋️' },
                                    { name: 'hasWifi', label: 'WiFi Included', icon: '📶' },
                                    { name: 'hasParking', label: 'Parking Available', icon: '🚗' },
                                    { name: 'hasKitchen', label: 'Kitchen Access', icon: '🍳' },
                                    { name: 'hasLaundry', label: 'Laundry Facilities', icon: '🧺' },
                                    { name: 'hasBalcony', label: 'Balcony', icon: '🌿' },
                                    { name: 'petsAllowed', label: 'Pets Allowed', icon: '🐕' },
                                ].map((feature) => (
                                    <label
                                        key={feature.name}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20"
                                    >
                                        <input
                                            type="checkbox"
                                            name={feature.name}
                                            checked={formData[feature.name as keyof typeof formData] as boolean}
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
                                    label="Floor Number"
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
                                    Back
                                </Button>
                                <Button onClick={() => setStep(3)} variant="gradient" size="lg">
                                    Next: AI Pricing
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
                                            AI-Powered Price Recommendation
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Our AI analyzes market data to suggest the optimal price
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
                                        label="Your Price ($/month)"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        icon={<DollarSign className="h-5 w-5" />}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button onClick={() => setStep(2)} variant="outline" size="lg">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(4)} variant="gradient" size="lg">
                                    Review Listing
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="glass animate-fadeInUp rounded-2xl p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                                Review Your Listing
                            </h2>

                            <div className="space-y-4">
                                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{formData.title}</h3>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">{formData.description}</p>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Location:</span>
                                            <span className="font-semibold capitalize text-gray-900 dark:text-white">{formData.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                            <span className="font-semibold capitalize text-gray-900 dark:text-white">{formData.roomType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Size:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{formData.size} m²</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                ${formData.price}/month
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                                    <h4 className="mb-2 font-semibold text-indigo-900 dark:text-indigo-300">Amenities:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(formData)
                                            .filter(([key, value]) => typeof value === 'boolean' && value)
                                            .map(([key]) => (
                                                <span
                                                    key={key}
                                                    className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300"
                                                >
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <Button onClick={() => setStep(3)} variant="outline" size="lg">
                                    Back
                                </Button>
                                <Button type="submit" variant="gradient" size="lg" isLoading={isSubmitting}>
                                    {!isSubmitting && (
                                        <>
                                            <Home className="mr-2 h-5 w-5" />
                                            Publish Listing
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
