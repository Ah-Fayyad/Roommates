import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Save, Bell, Shield, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminSettings = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        siteName: 'Roommates Platform',
        contactEmail: 'admin@roommates.com',
        maintenanceMode: false,
        allowNewRegistrations: true,
        requireVerification: true,
    });

    const handleSave = () => {
        alert(t('action_success', { action: t('save_all_settings') }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin_settings')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('configure_platform_desc')}</p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center gap-2 border-b pb-4 dark:border-gray-700">
                        <Globe className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('general_settings')}</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('site_name')}</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin_contact_email')}</label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Platform Control */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center gap-2 border-b pb-4 dark:border-gray-700">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('platform_control')}</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">{t('maintenance_mode')}</div>
                                <div className="text-sm text-gray-500">{t('maintenance_mode_desc')}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">{t('allow_registrations')}</div>
                                <div className="text-sm text-gray-500">{t('allow_registrations_desc')}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.allowNewRegistrations}
                                onChange={(e) => setSettings({ ...settings, allowNewRegistrations: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">{t('require_verification')}</div>
                                <div className="text-sm text-gray-500">{t('require_verification_desc')}</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.requireVerification}
                                onChange={(e) => setSettings({ ...settings, requireVerification: e.target.checked })}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} variant="gradient" size="lg">
                    <Save className="mr-2 h-5 w-5" />
                    {t('save_all_settings')}
                </Button>
            </div>
        </div>
    );
};

export default AdminSettings;
