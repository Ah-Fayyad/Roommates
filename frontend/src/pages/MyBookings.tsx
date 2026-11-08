import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle, XCircle, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/constants';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const { t, i18n } = useTranslation();
    const { token, user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isLandlord = user?.role === 'LANDLORD';

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
            } catch (err) {
                console.error('Failed to fetch bookings', err);
                setError(t('failed_fetch_bookings', 'Failed to load your bookings.'));
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchBookings();
    }, [token, t]);

    const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
        try {
            await axios.put(
                `${API_BASE_URL}/bookings/${bookingId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (err) {
            console.error('Failed to update booking', err);
            alert(t('failed_update_booking', 'Failed to update booking status.'));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-indigo-600" />
                    {isLandlord ? t('booking_requests', 'Booking Requests') : t('my_bookings', 'My Bookings')}
                </h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center animate-fadeInUp">
                        <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('no_bookings_found', 'No bookings found')}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {isLandlord 
                                ? t('no_booking_requests_desc', 'You have no short-term booking requests yet.') 
                                : t('no_bookings_desc', 'You haven\'t booked any short-term rentals yet.')}
                        </p>
                        {!isLandlord && (
                            <Link 
                                to="/listings?category=VACATION_RENTAL"
                                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                                {t('explore_vacation_rentals', 'Explore Vacation Rentals')}
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => (
                            <div key={booking.id} className="glass p-6 rounded-2xl animate-fadeInUp hover:shadow-lg transition-shadow border border-white/20">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${
                                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {booking.status === 'CONFIRMED' ? <CheckCircle className="h-6 w-6" /> :
                                             booking.status === 'CANCELLED' ? <XCircle className="h-6 w-6" /> :
                                             <Clock className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                {t(booking.status.toLowerCase(), booking.status)}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                <Link to={`/listings/${booking.listing.id}`} className="hover:text-indigo-600 transition-colors">
                                                    {booking.listing.title}
                                                </Link>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-indigo-600">
                                            {booking.totalPrice.toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')} {t('egp')}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {t('total_price', 'Total Price')}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">{t('dates', 'Dates')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">{isLandlord ? t('tourist', 'Tourist') : t('location')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            {isLandlord ? (
                                                <>
                                                    <img src={booking.tourist?.avatar || `https://ui-avatars.com/api/?name=${booking.tourist?.fullName}`} className="h-6 w-6 rounded-full" alt="" />
                                                    {booking.tourist?.fullName}
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.listing.address}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {booking.status === 'PENDING' && (
                                    <div className="mt-6 flex gap-3">
                                        {isLandlord ? (
                                            <>
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                                                >
                                                    {t('confirm', 'Confirm')}
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                >
                                                    {t('decline', 'Decline')}
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2.5 rounded-xl transition-colors dark:bg-red-900/30 dark:text-red-400"
                                            >
                                                {t('cancel_request', 'Cancel Request')}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
