import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/constants';
import { Button } from '../../components/ui/Button';
import { Search, MoreVertical, Shield, Ban, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    isBanned: boolean;
    createdAt: string;
}

const UserManagement = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId: string) => {
        try {
            await axios.post(
                `${API_BASE_URL}/admin/users/${userId}/verify`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error('Failed to verify user', error);
        }
    };

    const handleUnverifyUser = async (userId: string) => {
        try {
            await axios.post(
                `${API_BASE_URL}/admin/users/${userId}/unverify`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error('Failed to unverify user', error);
        }
    };

    const handleBanUser = async (userId: string) => {
        if (!confirm(t('confirm_ban_user'))) return;
        try {
            await axios.post(
                `${API_BASE_URL}/admin/users/${userId}/ban`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error('Failed to ban user', error);
            alert(t('failed_to_ban'));
        }
    };

    const handleUnbanUser = async (userId: string) => {
        if (!confirm(t('confirm_unban_user'))) return;
        try {
            await axios.post(
                `${API_BASE_URL}/admin/users/${userId}/unban`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers();
        } catch (error) {
            console.error('Failed to unban user', error);
            alert(t('failed_to_unban'));
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex items-center justify-center p-12 text-gray-500">{t('loading_users')}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('user_management')}</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('search_users')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 ps-10 pe-4 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <table className="w-full text-start text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">{t('user')}</th>
                            <th className="px-6 py-3">{t('role')}</th>
                            <th className="px-6 py-3">{t('verification')}</th>
                            <th className="px-6 py-3">{t('status')}</th>
                            <th className="px-6 py-3">{t('joined')}</th>
                            <th className="px-6 py-3">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {user.fullName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                                            <div className="text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'LANDLORD' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {t(user.role.toLowerCase())}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.isVerified ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                                            <CheckCircle size={12} /> {t('verified')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                            <Shield size={12} /> {t('unverified')}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isBanned
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                        {user.isBanned ? t('banned') : t('active')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.isVerified ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUnverifyUser(user.id)}
                                                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                                            >
                                                {t('unverify')}
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleVerifyUser(user.id)}
                                                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                                            >
                                                {t('verify')}
                                            </Button>
                                        )}
                                        {user.isBanned ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUnbanUser(user.id)}
                                                className="text-green-600 border-green-600 hover:bg-green-50"
                                            >
                                                {t('unban')}
                                            </Button>
                                        ) : (
                                            <button
                                                onClick={() => handleBanUser(user.id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                                title={t('ban')}
                                            >
                                                <Ban size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;

