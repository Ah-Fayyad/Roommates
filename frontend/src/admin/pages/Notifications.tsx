import React from "react";
import {
    Bell,
    Check,
    Trash2,
    Info,
    AlertTriangle,
    CheckCircle,
    MessageCircle,
    Calendar,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";

const AdminNotifications = () => {
    const { t } = useTranslation();
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading,
    } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case "NEW_MESSAGE":
                return <MessageCircle className="h-5 w-5 text-indigo-500" />;
            case "VISIT_REQUEST":
                return <Calendar className="h-5 w-5 text-purple-500" />;
            case "WARNING":
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case "SUCCESS":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "ERROR":
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {t("notifications_title")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("notifications_subtitle")}
                    </p>
                </div>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-xl">
                        <Check className="w-4 h-4 me-2" />
                        {t("mark_all_read")}
                    </Button>
                )}
            </div>

            <div className="grid gap-3">
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t("no_notifications")}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("no_notifications_desc")}
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`group bg-white dark:bg-gray-900 flex items-start gap-4 rounded-2xl p-4 border transition-all ${!notification.read
                                    ? "border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/10"
                                    : "border-gray-100 dark:border-gray-800"
                                }`}
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className={`text-sm font-bold truncate ${!notification.read ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-[10px] font-medium text-gray-400">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {notification.message}
                                </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                        title={t("mark_as_read")}
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    title={t("delete")}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
