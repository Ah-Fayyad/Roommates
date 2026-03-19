import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container max-w-4xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                <div className="glass rounded-2xl p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <Shield className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Terms of Service
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Last updated: January 19, 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                By accessing and using the Roommates Platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                2. Use License
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Permission is granted to temporarily access the materials (information or software) on Roommates Platform for personal, non-commercial transitory viewing only.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 mt-2">
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose</li>
                                <li>Attempt to decompile or reverse engineer any software</li>
                                <li>Remove any copyright or other proprietary notations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                3. User Accounts
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                4. Listings and Content
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                Users are solely responsible for the content they post. All listings must be accurate and comply with local laws and regulations. We reserve the right to remove any content that violates these terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                5. Prohibited Activities
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                You may not use our platform to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
                                <li>Engage in fraudulent activities</li>
                                <li>Post false or misleading information</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Violate any applicable laws or regulations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                6. Limitation of Liability
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                Roommates Platform shall not be held liable for any damages arising from the use or inability to use our service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                7. Changes to Terms
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                8. Contact Information
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                If you have any questions about these Terms, please contact us at:
                                <br />
                                <a href="mailto:support@roommates.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    support@roommates.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
