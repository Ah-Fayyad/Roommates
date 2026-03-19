import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="glass border-t border-gray-200/50 dark:border-gray-700/50 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full shadow-lg">
                                <img
                                    src="/images/logo.png"
                                    alt="Roommates Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                                Roommates
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('footer_description')}
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-600">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-600">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-600">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-600">
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                            {t('quick_questions')}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/listings" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('browse_listings')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/matches" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('find_roommate')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('dashboard')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('messages')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                            {t('legal')}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('terms_of_service')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('privacy_policy')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('community_guidelines')}
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                                    {t('safety_center')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                            {t('contact_us')}
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                                <a href="mailto:support@roommates.com" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                    support@roommates.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                                <a href="tel:+201234567890" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                    +20 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                                <span>Cairo, Egypt</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} Roommates. {t('rights_reserved')}.
                        </p>
                        <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> for students
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
