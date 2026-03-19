import React, { useState, useEffect } from "react";
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
import { Button } from "../components/ui/Button";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/constants";

import { useNotifications } from "../context/NotificationContext";
import { useTranslation } from "react-i18next";

const Notifications = () => {
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
        return <MessageCircle className="h-6 w-6 text-indigo-500" />;
      case "VISIT_REQUEST":
        return <Calendar className="h-6 w-6 text-purple-500" />;
      case "WARNING":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "SUCCESS":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "ERROR":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("notifications_title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("notifications_subtitle")}
            </p>
          </div>
          {notifications.length > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              {t("mark_all_read")}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="glass flex flex-col items-center justify-center rounded-2xl p-12 text-center">
              <Bell className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("no_notifications")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("no_notifications_desc")}
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`glass animate-fadeInUp flex items-start gap-4 rounded-2xl p-6 transition-all ${!notification.read
                  ? "border-s-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10"
                  : ""
                  }`}
              >
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <h3
                      className={`font-semibold ${!notification.read
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800"
                      title={t("mark_as_read")}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                    title={t("delete")}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
