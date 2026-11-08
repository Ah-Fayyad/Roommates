import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container max-w-4xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                    {t('back_to_home')}
                </Link>

                <div className="glass rounded-2xl p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                            <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {t('privacy_policy_title')}
                        </h1>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t('privacy_last_updated')}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('privacy_section_1')}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {t('privacy_section_1_desc')}
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
                                <li>{t('privacy_item_1_1')}</li>
                                <li>{t('privacy_item_1_2')}</li>
                                <li>{t('privacy_item_1_3')}</li>
                                <li>{t('privacy_item_1_4')}</li>
                                <li>{t('privacy_item_1_5')}</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('privacy_section_2')}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {t('privacy_section_2_desc')}
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
                                <li>{t('privacy_item_2_1')}</li>
                                <li>{t('privacy_item_2_2')}</li>
                                <li>{t('privacy_item_2_3')}</li>
                                <li>{t('privacy_item_2_4')}</li>
                                <li>{t('privacy_item_2_5')}</li>
                                <li>{t('privacy_item_2_6')}</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('privacy_section_3')}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {t('privacy_section_3_desc')}
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
                                <li>{t('privacy_item_3_1')}</li>
                                <li>{t('privacy_item_3_2')}</li>
                                <li>{t('privacy_item_3_3')}</li>
                                <li>{t('privacy_item_3_4')}</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('contact_us')}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                {t('privacy_contact_desc', 'If you have any questions about this Privacy Policy, please contact us at:')}
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
