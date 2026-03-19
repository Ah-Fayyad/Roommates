import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContentEditor = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'about' | 'privacy'>('about');
    const [content, setContent] = useState({
        about: 'Welcome to Roommates...',
        privacy: 'Your privacy is important to us...'
    });

    const handleSave = () => {
        // In a real app, save to backend
        alert(t('action_success', { action: t('save_changes') }));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('content_control')}</h1>

            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('about')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'about'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {t('about_us')}
                </button>
                <button
                    onClick={() => setActiveTab('privacy')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'privacy'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {t('privacy_policy')}
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('page_content_markdown')}
                </label>
                <textarea
                    value={content[activeTab]}
                    onChange={(e) => setContent({ ...content, [activeTab]: e.target.value })}
                    rows={15}
                    className="w-full rounded-lg border-gray-300 p-4 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white"
                />
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleSave} variant="gradient">
                        <Save className="mr-2 h-4 w-4" />
                        {t('save_changes')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ContentEditor;
