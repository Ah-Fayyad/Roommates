import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
                        <Lock className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Last updated: January 19, 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                1. Information We Collect
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
                                <li>Name, email address, and contact information</li>
                                <li>Profile information and preferences</li>
                                <li>Listing details and photos</li>
                                <li>Messages and communications with other users</li>
                                <li>Payment and transaction information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                2. How We Use Your Information
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Monitor and analyze trends and usage</li>
                                <li>Detect, prevent, and address fraud and security issues</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                3. Information Sharing
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                We do not share your personal information with third parties except in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 mt-2">
                                <li>With your consent</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights and prevent fraud</li>
                                <li>With service providers who assist in our operations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                4. Data Security
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                5. Cookies and Tracking
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                6. Your Rights
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4">
                                <li>Access and receive a copy of your personal data</li>
                                <li>Rectify inaccurate or incomplete data</li>
                                <li>Request deletion of your personal data</li>
                                <li>Object to or restrict processing of your data</li>
                                <li>Data portability</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                7. Children's Privacy
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                8. Changes to This Policy
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                9. Contact Us
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                If you have any questions about this Privacy Policy, please contact us at:
                                <br />
                                <a href="mailto:privacy@roommates.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                    privacy@roommates.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
