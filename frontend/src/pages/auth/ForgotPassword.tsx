import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="glass animate-fadeInUp rounded-3xl p-8 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                            Check Your Email
                        </h2>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <Link to="/login">
                            <Button variant="gradient" className="w-full">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link
                    to="/login"
                    className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Login
                </Link>

                {/* Form Card */}
                <div className="glass animate-fadeInUp rounded-3xl p-8">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                            Forgot Password?
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            No worries, we'll send you reset instructions
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@university.edu"
                            icon={<Mail className="h-5 w-5" />}
                            required
                        />

                        <Button
                            type="submit"
                            variant="gradient"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/signup"
                                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="glass mt-6 rounded-2xl p-4 animate-fadeInUp stagger-1">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        💡 <strong>Tip:</strong> The reset link will expire in 1 hour for security reasons
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
