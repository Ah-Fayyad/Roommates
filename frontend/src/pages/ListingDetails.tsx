
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
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
    Utensils,
    Sparkles,
    Flag
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socket.service';
import ReportModal from '../components/ReportModal';
import ListingMap from '../components/map/ListingMap';

const ListingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [visitDate, setVisitDate] = useState('');
    const [visitMessage, setVisitMessage] = useState('');
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
                setListing(response.data);
                // Check if favorite
                if (token) {
                    const favResponse = await axios.get(`http://localhost:5000/api/favorites/${id}/check`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsFavorite(favResponse.data.isFavorite);
                }
            } catch (error) {
                console.error('Failed to fetch listing', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchListing();
    }, [id, token]);

    const handleVisitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            navigate('/login');
            return;
        }

        setRequestStatus('loading');
        try {
            await axios.post('http://localhost:5000/api/visits/request', {
                listingId: id,
                proposedTimes: [visitDate],
                message: visitMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Notify owner via socket
            socketService.emit('visit_request', {
                listingId: id,
                ownerId: listing.ownerId,
                proposedTimes: [visitDate]
            });

            setRequestStatus('success');
            setTimeout(() => {
                setShowVisitModal(false);
                setRequestStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Failed to request visit', error);
            setRequestStatus('error');
        }
    };

    const toggleFavorite = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:5000/api/favorites`, { listingId: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const nextImage = () => {
        if (listing?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
        }
    };

    const prevImage = () => {
        if (listing?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
        }
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    if (!listing) {
        return <div className="flex min-h-screen items-center justify-center">Listing not found</div>;
    }

    // Fallback images if none provided
    const images = listing.images && listing.images.length > 0
        ? listing.images.map((img: any) => img.url)
        : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'];

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Image Gallery */}
                <div className="glass animate-fadeInUp mb-6 overflow-hidden rounded-3xl">
                    <div className="relative h-96 md:h-[500px]">
                        <img
                            src={images[currentImageIndex]}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white">
                            {currentImageIndex + 1} / {images.length}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute right-4 top-4 flex gap-2">
                            <button
                                onClick={toggleFavorite}
                                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all ${isFavorite
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/90 text-gray-900 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-all hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800">
                                <Share2 className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto p-4">
                            {images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all ${index === currentImageIndex
                                        ? 'ring-4 ring-indigo-600'
                                        : 'opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Title and Price */}
                        <div className="glass animate-fadeInUp stagger-1 rounded-2xl p-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                                        {listing.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <MapPin className="h-5 w-5" />
                                        {listing.address}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                        <DollarSign className="h-8 w-8" />
                                        {listing.price}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="glass animate-fadeInUp stagger-2 rounded-2xl p-6">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                Description
                            </h2>
                            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                {listing.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="glass animate-fadeInUp stagger-3 rounded-2xl p-6">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                Amenities
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {listing.amenities?.map((amenity: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {amenity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="glass animate-fadeInUp stagger-4 rounded-2xl p-6">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                Location
                            </h2>
                            <div className="h-80 w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
                                <ListingMap
                                    lat={listing.latitude}
                                    lng={listing.longitude}
                                    title={listing.title}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Owner Card */}
                        <div className="glass animate-fadeInUp stagger-5 rounded-2xl p-6">
                            <h3 className="mb-4 font-bold text-gray-900 dark:text-white">
                                Listed by
                            </h3>
                            <div className="mb-4 flex items-center gap-3">
                                <img
                                    src={listing.owner?.avatar || 'https://via.placeholder.com/100'}
                                    alt={listing.owner?.fullName}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {listing.owner?.fullName}
                                        </h4>
                                        {listing.owner?.isVerified && (
                                            <div className="rounded-full bg-green-500 p-1">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Link to={`/chat/${listing.ownerId}`}>
                                    <Button variant="gradient" className="w-full">
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Contact Owner
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setShowVisitModal(true)}
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Request Visit
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                    onClick={() => setShowReportModal(true)}
                                >
                                    <Flag className="mr-2 h-5 w-5" />
                                    Report Listing
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visit Request Modal */}
            {showVisitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="glass w-full max-w-md rounded-2xl p-6 animate-fadeInUp">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request a Visit</h3>
                            <button onClick={() => setShowVisitModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {requestStatus === 'success' ? (
                            <div className="py-8 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <Check className="h-8 w-8" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Request Sent!</h4>
                                <p className="text-gray-600 dark:text-gray-400">The owner will be notified of your request.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleVisitRequest} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Proposed Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={visitDate}
                                        onChange={(e) => setVisitDate(e.target.value)}
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        value={visitMessage}
                                        onChange={(e) => setVisitMessage(e.target.value)}
                                        placeholder="Hi, I'm interested in viewing the room..."
                                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                        rows={3}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="gradient"
                                    className="w-full"
                                    disabled={requestStatus === 'loading'}
                                >
                                    {requestStatus === 'loading' ? 'Sending...' : 'Send Request'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetId={id || ''}
                targetType="LISTING"
            />
        </div>
    );
};

export default ListingDetails;
