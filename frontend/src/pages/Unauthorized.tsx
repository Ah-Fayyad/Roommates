import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft, Lock, Building } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
                <div className="glass animate-fadeInUp rounded-3xl p-8 md:p-12">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <Lock className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                        Access Denied
                    </h1>

                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                        Only landlords can post rooms. If you want to list your property, please upgrade your account to a landlord account.
                    </p>

                    <div className="space-y-3">
                        <Button
                            variant="gradient"
                            size="lg"
                            className="w-full"
                            onClick={() => window.location.href = '/settings'}
                        >
                            <Building className="mr-2 h-5 w-5" />
                            Upgrade to Landlord
                        </Button>

                        <Link to="/">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
