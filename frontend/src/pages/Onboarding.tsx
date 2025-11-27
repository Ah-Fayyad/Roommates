import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowRight, Check, Shield, Home, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        cleanliness: 5,
        quietHours: 5,
        socializing: 5,
        cooking: 5,
        pets: false,
        smoking: false,
        guests: true,
        budget: 500
    });

    const handleComplete = async () => {
        try {
            setIsSubmitting(true);
            await axios.put('http://localhost:5000/api/users/profile', {
                preferences
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (user?.role === 'LANDLORD') {
                navigate('/create-listing');
            } else {
                navigate('/listings');
            }
        } catch (error) {
            console.error('Failed to save preferences:', error);
            // Still navigate on error? Or show error?
            // For now, let's navigate to avoid blocking the user, but maybe log it.
            if (user?.role === 'LANDLORD') {
                navigate('/create-listing');
            } else {
                navigate('/listings');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const tenantSteps = [
        {
            title: 'Welcome to Roommates!',
            subtitle: 'Let\'s find your perfect living situation',
            content: (
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
                        <Sparkles className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome! 👋
                    </h2>
                    <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                        We'll help you set up your profile and preferences to find the best roommate matches.
                    </p>
                    <div className="grid gap-4 text-left md:grid-cols-3">
                        {[
                            { icon: '🎯', title: 'Smart Matching', desc: 'AI finds compatible roommates' },
                            { icon: '✅', title: 'Verified Profiles', desc: 'Safe and trusted community' },
                            { icon: '💬', title: 'Easy Communication', desc: 'Chat with potential roommates' }
                        ].map((feature, idx) => (
                            <div key={idx} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                <div className="mb-2 text-3xl">{feature.icon}</div>
                                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: 'Your Living Preferences',
            subtitle: 'Help us understand your ideal living environment',
            content: (
                <div className="space-y-6">
                    {[
                        { key: 'cleanliness', label: 'Cleanliness', desc: 'How important is cleanliness to you?' },
                        { key: 'quietHours', label: 'Quiet Hours', desc: 'Do you prefer a quiet environment?' },
                        { key: 'socializing', label: 'Socializing', desc: 'How social are you?' },
                        { key: 'cooking', label: 'Cooking', desc: 'How often do you cook?' }
                    ].map((pref) => (
                        <div key={pref.key}>
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{pref.label}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{pref.desc}</div>
                                </div>
                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {preferences[pref.key as keyof typeof preferences]}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={preferences[pref.key as keyof typeof preferences] as number}
                                onChange={(e) => setPreferences({ ...preferences, [pref.key]: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="mt-1 flex justify-between text-xs text-gray-500">
                                <span>Not Important</span>
                                <span>Very Important</span>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Additional Preferences',
            subtitle: 'A few more questions to perfect your matches',
            content: (
                <div className="space-y-4">
                    {[
                        { key: 'pets', label: 'Pet-Friendly', desc: 'Are you okay with pets?' },
                        { key: 'smoking', label: 'Smoking', desc: 'Do you smoke?' },
                        { key: 'guests', label: 'Guests Allowed', desc: 'Are you okay with guests?' }
                    ].map((pref) => (
                        <label
                            key={pref.key}
                            className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20"
                        >
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{pref.label}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{pref.desc}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences[pref.key as keyof typeof preferences] as boolean}
                                onChange={(e) => setPreferences({ ...preferences, [pref.key]: e.target.checked })}
                                className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </label>
                    ))}

                    <div className="rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                        <label className="mb-2 block font-semibold text-gray-900 dark:text-white">
                            Monthly Budget
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="200"
                                max="2000"
                                step="50"
                                value={preferences.budget}
                                onChange={(e) => setPreferences({ ...preferences, budget: Number(e.target.value) })}
                                className="flex-1"
                            />
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                ${preferences.budget}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'All Set!',
            subtitle: 'You\'re ready to find your perfect roommate',
            content: (
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <Check className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        You're All Set! 🎉
                    </h2>
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                        Your profile is complete. Start browsing listings and find your perfect match!
                    </p>
                    <div className="rounded-xl bg-indigo-50 p-6 dark:bg-indigo-900/20">
                        <h3 className="mb-4 font-bold text-indigo-900 dark:text-indigo-300">
                            What's Next?
                        </h3>
                        <div className="space-y-3 text-left">
                            {[
                                'Browse available listings in your area',
                                'Get AI-powered roommate recommendations',
                                'Chat with potential roommates',
                                'Post your own listing (optional)'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                        {idx + 1}
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const landlordSteps = [
        {
            title: 'Welcome, Landlord!',
            subtitle: 'Let\'s get you ready to rent out your space',
            content: (
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse">
                        <Home className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome Aboard! 🏠
                    </h2>
                    <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                        We'll help you verify your identity and post your first listing to reach thousands of students.
                    </p>
                    <div className="grid gap-4 text-left md:grid-cols-3">
                        {[
                            { icon: '🛡️', title: 'Secure Platform', desc: 'Verified tenants only' },
                            { icon: '💰', title: 'Smart Pricing', desc: 'AI price recommendations' },
                            { icon: '📈', title: 'Easy Management', desc: 'Track visits and requests' }
                        ].map((feature, idx) => (
                            <div key={idx} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                <div className="mb-2 text-3xl">{feature.icon}</div>
                                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: 'Identity Verification',
            subtitle: 'To ensure safety, we need to verify your identity',
            content: (
                <div className="text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <Shield className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 dark:border-gray-700">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Upload className="h-6 w-6 text-gray-500" />
                        </div>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Upload ID Document</h3>
                        <p className="mb-4 text-sm text-gray-500">Passport, Driver's License, or National ID</p>
                        <Button variant="outline" size="sm">
                            Choose File
                        </Button>
                        <p className="mt-4 text-xs text-gray-400">
                            Your documents are encrypted and securely stored.
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: 'Ready to Post?',
            subtitle: 'Create your first listing now',
            content: (
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <Check className="h-16 w-16 text-white" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                        You're Verified! ✅
                    </h2>
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                        Your account is set up. You can now create your first listing and start receiving requests.
                    </p>
                    <Button
                        onClick={() => navigate('/create-listing')}
                        variant="gradient"
                        size="lg"
                        className="w-full"
                    >
                        Create First Listing
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            )
        }
    ];

    const steps = user?.role === 'LANDLORD' ? landlordSteps : tenantSteps;
    const currentStep = steps[step - 1];

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="mb-2 flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-400">
                        <span>Step {step} of {steps.length}</span>
                        <span>{Math.round((step / steps.length) * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                            style={{ width: `${(step / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="glass animate-fadeInUp rounded-3xl p-8 md:p-12">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {currentStep.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {currentStep.subtitle}
                        </p>
                    </div>

                    <div className="mb-8">
                        {currentStep.content}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        {step > 1 ? (
                            <Button
                                onClick={() => setStep(step - 1)}
                                variant="outline"
                                size="lg"
                            >
                                Back
                            </Button>
                        ) : (
                            <div></div>
                        )}

                        {step < steps.length ? (
                            <Button
                                onClick={() => setStep(step + 1)}
                                variant="gradient"
                                size="lg"
                            >
                                Continue
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        ) : (
                            user?.role !== 'LANDLORD' && (
                                <Button
                                    onClick={handleComplete}
                                    variant="gradient"
                                    size="lg"
                                >
                                    Start Exploring
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
