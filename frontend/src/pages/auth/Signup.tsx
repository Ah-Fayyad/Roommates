import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, Home } from 'lucide-react';

const signupSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
    const { login, register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [role, setRole] = useState<'USER' | 'LANDLORD'>('USER');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupForm) => {
        try {
            setError('');
            await registerUser(data.email, data.password, data.fullName, role);
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        }
    };

    const benefits = [
        'Find compatible roommates instantly',
        'Verified student profiles',
        'AI-powered matching algorithm',
        'Secure messaging platform',
        'Free to join and browse'
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/4 top-20 h-96 w-96 animate-float rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10"></div>
                <div className="absolute right-1/4 bottom-20 h-96 w-96 animate-float rounded-full bg-pink-300/20 blur-3xl dark:bg-pink-600/10" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-5xl">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left side - Benefits */}
                    <div className="hidden lg:flex lg:flex-col lg:justify-center">
                        <div className="animate-fadeInUp">
                            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
                                Join thousands of students finding their perfect roommate
                            </h2>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 animate-fadeInUp"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <p className="text-lg text-gray-700 dark:text-gray-300">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="glass animate-fadeInUp rounded-3xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <Sparkles className="h-4 w-4" />
                                <span>Start Your Journey</span>
                            </div>
                            <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Create your account
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Find your perfect roommate match today
                            </p>
                        </div>

                        {/* Role Selection */}
                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('USER')}
                                className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${role === 'USER'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'
                                    }`}
                            >
                                <User className={`mb-2 h-6 w-6 ${role === 'USER' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <span className={`font-semibold ${role === 'USER' ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                    I need a room
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('LANDLORD')}
                                className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${role === 'LANDLORD'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'
                                    }`}
                            >
                                <Home className={`mb-2 h-6 w-6 ${role === 'LANDLORD' ? 'text-indigo-600' : 'text-gray-400'}`} />
                                <span className={`font-semibold ${role === 'LANDLORD' ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                    I have a room
                                </span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {error && (
                                <div className="animate-fadeIn rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                                        {error}
                                    </div>
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="John Doe"
                                icon={<User className="h-5 w-5" />}
                                {...register('fullName')}
                                error={errors.fullName?.message}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@university.edu"
                                icon={<Mail className="h-5 w-5" />}
                                {...register('email')}
                                error={errors.email?.message}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="h-5 w-5" />}
                                {...register('password')}
                                error={errors.password?.message}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="h-5 w-5" />}
                                {...register('confirmPassword')}
                                error={errors.confirmPassword?.message}
                            />

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                    I agree to the{' '}
                                    <Link to="/terms" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full"
                                size="lg"
                                isLoading={isSubmitting}
                            >
                                {!isSubmitting && (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Sign in link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
