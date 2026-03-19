import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/constants';
import { Button } from '../../components/ui/Button';
import { Flag, CheckCircle, XCircle, AlertTriangle, Mail, Ban, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReportData {
    id: string;
    reporter: { fullName: string; email: string; id: string };
    reported?: any;
    targetType: string;
    reason: string;
    description: string;
    status: string;
    adminNotes?: string;
    createdAt: string;
}

const Reports = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchReports();
    }, [token]);

    const fetchReports = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(response.data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (reportId: string, action: 'RESOLVED' | 'DISMISSED' | 'BAN_USER' | 'REMOVE_LISTING', targetType: string) => {
        setActionLoading(true);
        try {
            const status = action === 'BAN_USER' || action === 'REMOVE_LISTING' ? 'REVIEWING' :
                action === 'RESOLVED' ? 'RESOLVED' : 'DISMISSED';

            await axios.patch(
                `${API_BASE_URL}/reports/${reportId}`,
                {
                    status,
                    adminNotes,
                    action
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            await fetchReports();
            setShowDetailModal(false);
            setAdminNotes('');
            alert(t('action_success', { action }));
        } catch (error) {
            console.error('Action failed', error);
            alert(t('action_failed'));
        } finally {
            setActionLoading(false);
        }
    };

    const filteredReports = filterStatus === 'all'
        ? reports
        : reports.filter(r => r.status === filterStatus);

    if (loading) return <div className="p-8 text-center">{t('loading')}</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('reports_moderation')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('total_reports')}: {reports.length} | {t('pending')}: {reports.filter(r => r.status === 'PENDING').length}
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
                {['all', 'PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilterStatus(tab)}
                        className={`px-4 py-2 font-medium transition-colors ${filterStatus === tab
                            ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                            }`}
                    >
                        {t(tab.toLowerCase())}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 dark:border-gray-700">
                        <CheckCircle size={48} className="mb-4 text-green-500" />
                        <p className="text-gray-600 dark:text-gray-400">
                            {filterStatus === 'all' ? t('no_reports_all') : t('no_reports_status', { status: t(filterStatus.toLowerCase()) })}
                        </p>
                    </div>
                ) : (
                    filteredReports.map((report) => (
                        <div
                            key={report.id}
                            className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`rounded-full p-2 ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' :
                                        report.status === 'RESOLVED' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                                            'bg-red-100 text-red-600 dark:bg-red-900/20'
                                        }`}>
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                {report.reason}
                                            </h3>
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                report.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                    report.status === 'REVIEWING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                                }`}>
                                                {t(report.status.toLowerCase())}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <span className="font-medium">{t('reported_by')}:</span> {report.reporter.fullName} ({report.reporter.email})
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Target Info */}
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    📌 {report.targetType === 'USER' ? t('reported_user') : t('reported_listing')}:
                                </p>
                                {report.targetType === 'USER' ? (
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {report.reported?.fullName || t('unknown_user')}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">{report.reported?.email}</p>
                                        {report.reported?.isBanned && (
                                            <p className="text-red-600 dark:text-red-400 mt-1">🚫 {t('user_is_banned')}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {report.reported?.title || t('unknown_listing')}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                             {t('owner_label')}: {report.reported?.owner?.fullName}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {t('status')}: {report.reported?.status}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {report.description && (
                                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">{t('description')}:</p>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">{report.description}</p>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {report.adminNotes && (
                                <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <p className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-1">📝 {t('admin_notes')}:</p>
                                    <p className="text-sm text-purple-800 dark:text-purple-200">{report.adminNotes}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedReport(report);
                                        setAdminNotes(report.adminNotes || '');
                                        setShowDetailModal(true);
                                    }}
                                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                                >
                                    <Mail size={16} className="me-2" />
                                    {t('view_details')}
                                </Button>
                                {report.targetType === 'USER' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (report.reported?.isBanned) {
                                                handleAction(report.id, 'RESOLVED', 'USER');
                                            } else {
                                                if (window.confirm(t('confirm_ban_user'))) {
                                                    handleAction(report.id, 'BAN_USER', 'USER');
                                                }
                                            }
                                        }}
                                        disabled={actionLoading}
                                        className={`${report.reported?.isBanned ? 'text-green-600 border-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20' : 'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20'}`}
                                    >
                                        <Ban size={16} className="me-2" />
                                        {report.reported?.isBanned ? t('unban') : t('ban')}
                                    </Button>
                                )}
                                {report.targetType === 'LISTING' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (window.confirm(t('confirm_remove_listing'))) {
                                                handleAction(report.id, 'REMOVE_LISTING', 'LISTING');
                                            }
                                        }}
                                        disabled={actionLoading}
                                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 size={16} className="me-2" />
                                        {t('delete_listing')}
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAction(report.id, 'DISMISSED', report.targetType)}
                                    disabled={actionLoading}
                                    className="text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                >
                                    <XCircle size={16} className="me-2" />
                                    {t('dismiss')}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fadeInUp">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('report_details')}
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('reason')}</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedReport.reason}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('status')}</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{t(selectedReport.status.toLowerCase())}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('description')}</p>
                                <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                                    {selectedReport.description}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin_notes')}
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder={t('admin_notes_placeholder')}
                                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setShowDetailModal(false)}
                                disabled={actionLoading}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={() => handleAction(selectedReport.id, 'RESOLVED', selectedReport.targetType)}
                                disabled={actionLoading}
                            >
                                {actionLoading ? t('saving') : t('mark_resolved')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
