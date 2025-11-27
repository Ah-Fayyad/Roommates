import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { Button } from './ui/Button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    targetType: 'USER' | 'LISTING';
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetId, targetType }) => {
    const { token } = useAuth();
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await axios.post('http://localhost:5000/api/reports', {
                targetId,
                targetType,
                reason,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setReason('');
                setDescription('');
            }, 2000);
        } catch (error) {
            console.error('Failed to submit report', error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="glass w-full max-w-md rounded-2xl p-6 animate-fadeInUp">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-6 w-6" />
                        <h3 className="text-xl font-bold">Report {targetType === 'USER' ? 'User' : 'Listing'}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Check className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Report Submitted</h4>
                        <p className="text-gray-600 dark:text-gray-400">Thank you for helping keep our community safe.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Reason
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Select a reason</option>
                                <option value="SPAM">Spam or Scam</option>
                                <option value="INAPPROPRIATE">Inappropriate Content</option>
                                <option value="HARASSMENT">Harassment</option>
                                <option value="MISLEADING">Misleading Information</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Please provide more details..."
                                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                rows={4}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="destructive"
                            className="w-full"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
