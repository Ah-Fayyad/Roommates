import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setError('');
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: data.email,
                password: data.password
            });

            const { token, user } = response.data;
            login(token, user);
            navigate('/listings');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/4 top-20 h-96 w-96 animate-float rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-600/10"></div>
                <div className="absolute right-1/4 bottom-20 h-96 w-96 animate-float rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md">
                <div className="glass animate-fadeInUp rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <Sparkles className="h-4 w-4" />
                            <span>Welcome Back</span>
                        </div>
                        <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Sign in to your account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Continue your roommate search journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="animate-fadeIn rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                                    {error}
                                </div>
                            </div>
                        )}

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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Forgot password?
                            </Link>
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
                                    Sign in
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    {/* Sign up link */}
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Additional info */}
                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Protected by industry-standard encryption
                </p>
            </div>
        </div>
    );
};

export default Login;
