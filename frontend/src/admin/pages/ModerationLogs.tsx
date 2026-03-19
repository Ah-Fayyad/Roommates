import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/constants';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle, Home, UserCheck, AlertCircle, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Listing {
    id: string;
    title: string;
    owner: { fullName: string };
    price: number;
}

interface Verification {
    id: string;
    user: { fullName: string; email: string };
    documentUrl: string;
    createdAt: string;
}

const Moderation = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [listings, setListings] = useState<Listing[]>([]);
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
    }, [token]);

    const fetchQueue = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/moderation`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(response.data.listings);
            setVerifications(response.data.verifications);
        } catch (error) {
            console.error('Failed to fetch queue', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveListing = async (listingId: string) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/approve-listing`, { listingId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQueue();
            alert(t('approved_success'));
        } catch (error) {
            alert(t('action_failed'));
        }
    };

    const handleRejectListing = async (listingId: string) => {
        const reason = prompt(t('reject_reason'));
        if (!reason) return;
        try {
            await axios.post(`${API_BASE_URL}/admin/reject-listing`, { listingId, reason }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQueue();
        } catch (error) {
            alert(t('failed'));
        }
    };

    if (loading) return <div className="p-8 text-center">{t('loading')}</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('moderation_queue')}</h1>

            {/* Verification Requests */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <UserCheck className="text-indigo-600" />
                    <h2 className="text-xl font-semibold">{t('verification_requests')} ({verifications.length})</h2>
                </div>
                {verifications.length === 0 ? (
                    <p className="text-gray-500">{t('no_verifications')}</p>
                ) : (
                    <div className="grid gap-4">
                        {verifications.map((v) => (
                            <div key={v.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold">{v.user.fullName}</div>
                                        <div className="text-sm text-gray-500">{v.user.email}</div>
                                        <div className="mt-2 text-xs text-gray-400">Requested: {new Date(v.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={v.documentUrl} target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="sm">
                                                <Eye className="me-2 h-4 w-4" /> {t('view_doc')}
                                            </Button>
                                        </a>
                                        <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                                            {t('approve')}
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                                            {t('reject')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Listing Approval */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Home className="text-indigo-600" />
                    <h2 className="text-xl font-semibold">{t('new_listings')} ({listings.length})</h2>
                </div>
                {listings.length === 0 ? (
                    <p className="text-gray-500">{t('no_listings')}</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <table className="w-full text-start text-sm">
                            <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3">{t('listing')}</th>
                                    <th className="px-6 py-3">{t('owner')}</th>
                                    <th className="px-6 py-3">{t('price')}</th>
                                    <th className="px-6 py-3 text-end">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((l) => (
                                    <tr key={l.id} className="border-b dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium">{l.title}</td>
                                        <td className="px-6 py-4">{l.owner.fullName}</td>
                                        <td className="px-6 py-4">${l.price}</td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleApproveListing(l.id)} className="text-green-600">
                                                    <CheckCircle size={14} className="me-1" /> {t('approve')}
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleRejectListing(l.id)} className="text-red-600">
                                                    <XCircle size={14} className="me-1" /> {t('reject')}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Moderation;
