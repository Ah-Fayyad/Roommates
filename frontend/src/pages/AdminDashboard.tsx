import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import {
    Users,
    Home,
    MessageCircle,
    TrendingUp,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'indigo' },
        { label: 'Active Listings', value: '456', change: '+8%', icon: Home, color: 'purple' },
        { label: 'Messages Today', value: '2,891', change: '+24%', icon: MessageCircle, color: 'pink' },
        { label: 'Matches Made', value: '89', change: '+15%', icon: TrendingUp, color: 'green' }
    ];

    const pendingVerifications = [
        { id: 1, user: 'John Doe', type: 'Student ID', date: '2024-01-20', status: 'pending' },
        { id: 2, user: 'Jane Smith', type: 'Email', date: '2024-01-20', status: 'pending' },
        { id: 3, user: 'Mike Johnson', type: 'Phone', date: '2024-01-19', status: 'pending' }
    ];

    const pendingListings = [
        { id: 1, title: 'Cozy Room Downtown', user: 'Sarah Wilson', date: '2024-01-20', price: '$500' },
        { id: 2, title: 'Studio Near Campus', user: 'Tom Brown', date: '2024-01-20', price: '$400' },
        { id: 3, title: 'Shared Apartment', user: 'Lisa Davis', date: '2024-01-19', price: '$350' }
    ];

    const reports = [
        { id: 1, reporter: 'User123', reported: 'User456', reason: 'Spam', date: '2024-01-20', status: 'open' },
        { id: 2, reporter: 'User789', reported: 'User012', reason: 'Inappropriate content', date: '2024-01-19', status: 'open' }
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 animate-fadeInUp">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Manage users, listings, and platform activity
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="glass animate-fadeInUp rounded-2xl p-6"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-400`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div className="glass mb-6 rounded-2xl p-2">
                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'verifications', label: 'Verifications', icon: Shield },
                            { id: 'listings', label: 'Listings', icon: Home },
                            { id: 'reports', label: 'Reports', icon: AlertTriangle }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold transition-all ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'verifications' && (
                    <div className="glass animate-fadeIn rounded-2xl p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Pending Verifications
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="rounded-xl border-2 border-gray-200 bg-white py-2 pl-10 pr-4 transition-all focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="pb-3 text-left font-semibold text-gray-900 dark:text-white">User</th>
                                        <th className="pb-3 text-left font-semibold text-gray-900 dark:text-white">Type</th>
                                        <th className="pb-3 text-left font-semibold text-gray-900 dark:text-white">Date</th>
                                        <th className="pb-3 text-right font-semibold text-gray-900 dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingVerifications.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-4 text-gray-900 dark:text-white">{item.user}</td>
                                            <td className="py-4">
                                                <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-600 dark:text-gray-400">{item.date}</td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" className="text-green-600">
                                                        <CheckCircle className="mr-1 h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600">
                                                        <XCircle className="mr-1 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className="glass animate-fadeIn rounded-2xl p-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                            Pending Listings
                        </h2>
                        <div className="space-y-4">
                            {pendingListings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {listing.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            by {listing.user} • {listing.date} • {listing.price}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="gradient">
                                            <CheckCircle className="mr-1 h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <XCircle className="mr-1 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="glass animate-fadeIn rounded-2xl p-6">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                            User Reports
                        </h2>
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <div className="mb-1 flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                <span className="font-semibold text-red-900 dark:text-red-300">
                                                    {report.reason}
                                                </span>
                                            </div>
                                            <p className="text-sm text-red-700 dark:text-red-300">
                                                {report.reporter} reported {report.reported} • {report.date}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                                            {report.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                            Take Action
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="glass animate-fadeIn rounded-2xl p-6">
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { action: 'New user registered', time: '5 min ago', icon: Users },
                                    { action: 'Listing approved', time: '12 min ago', icon: CheckCircle },
                                    { action: 'Report submitted', time: '1 hour ago', icon: AlertTriangle },
                                    { action: 'Verification completed', time: '2 hours ago', icon: Shield }
                                ].map((activity, idx) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={idx} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                                            <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {activity.action}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {activity.time}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="glass animate-fadeIn rounded-2xl p-6">
                            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Quick Actions
                            </h3>
                            <div className="grid gap-3">
                                <Button variant="outline" className="justify-start">
                                    <Users className="mr-2 h-5 w-5" />
                                    Manage Users
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Home className="mr-2 h-5 w-5" />
                                    Review Listings
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Process Verifications
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <AlertTriangle className="mr-2 h-5 w-5" />
                                    Handle Reports
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
