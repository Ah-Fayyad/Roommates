import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, Mail, Phone, Calendar, Edit2, Save, X, Star, Home, Heart, MessageCircle, Shield } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState({
        fullName: user?.fullName || 'John Doe',
        email: user?.email || 'john@university.edu',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        university: 'Stanford University',
        major: 'Computer Science',
        year: 'Junior',
        bio: 'Clean, organized, and friendly student looking for a compatible roommate. I enjoy studying in quiet environments and cooking healthy meals.',
        avatar: user?.avatar || 'https://i.pravatar.cc/150?img=12',
        preferences: {
            cleanliness: 9,
            quietHours: 8,
            socializing: 6,
            cooking: 7
        },
        interests: ['Reading', 'Cooking', 'Hiking', 'Gaming']
    });

    const [uploading, setUploading] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await axios.post('http://localhost:5000/api/upload/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(prev => ({ ...prev, avatar: res.data.url }));
            } catch (err) {
                console.error('Upload failed', err);
                setError('Failed to upload avatar');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            await axios.put('http://localhost:5000/api/users/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const stats = [
        { label: 'Listings', value: '3', icon: Home },
        { label: 'Favorites', value: '12', icon: Heart },
        { label: 'Messages', value: '24', icon: MessageCircle },
        { label: 'Rating', value: '4.8', icon: Star }
    ];

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto max-w-5xl px-4">
                {/* Header Card */}
                <div className="glass animate-fadeInUp mb-6 overflow-hidden rounded-3xl">
                    {/* Cover Image */}
                    <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-4 inline-block">
                            <div className="relative">
                                <img
                                    src={profile.avatar}
                                    alt="Profile"
                                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl dark:border-gray-800"
                                />
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700">
                                    <Camera className="h-5 w-5" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                                <Shield className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Name and Actions */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                                    {profile.fullName}
                                </h1>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {profile.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {profile.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSave} variant="gradient" isLoading={isSaving}>
                                            {!isSaving && (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)} variant="outline">
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} variant="gradient">
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50"
                                    >
                                        <Icon className="mx-auto mb-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                            {stat.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* About */}
                        <div className="glass animate-fadeInUp stagger-1 rounded-2xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                About Me
                            </h2>
                            {isEditing ? (
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                />
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
                            )}
                        </div>

                        {/* Education */}
                        <div className="glass animate-fadeInUp stagger-2 rounded-2xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Education
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">University:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {profile.university}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Major:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {profile.major}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Year:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {profile.year}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="glass animate-fadeInUp stagger-3 rounded-2xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Living Preferences
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(profile.preferences).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="capitalize text-gray-700 dark:text-gray-300">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </span>
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                {value}/10
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                                style={{ width: `${value * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Interests */}
                        <div className="glass animate-fadeInUp stagger-4 rounded-2xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Interests
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.interests.map((interest, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div className="glass animate-fadeInUp stagger-5 rounded-2xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Verification
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Email</span>
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <Shield className="h-4 w-4" />
                                        Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Student ID</span>
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                        <Shield className="h-4 w-4" />
                                        Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 dark:text-gray-300">Phone</span>
                                    <Button variant="outline" size="sm">
                                        Verify
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass animate-fadeInUp stagger-6 rounded-2xl p-6">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                Quick Actions
                            </h2>
                            <div className="space-y-2">
                                <Link to="/create-listing">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Home className="mr-2 h-4 w-4" />
                                        Create Listing
                                    </Button>
                                </Link>
                                <Link to="/matches">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Heart className="mr-2 h-4 w-4" />
                                        View Matches
                                    </Button>
                                </Link>
                                <Link to="/settings">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Settings
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
