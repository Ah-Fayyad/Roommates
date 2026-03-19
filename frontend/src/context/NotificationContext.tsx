import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { socketService } from "../services/socket.service";
import { useAuth } from "./AuthContext";
import axiosInstance from "../lib/axios";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.get("/notifications");
            // Guard: ensure we always have an array
            const data = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            setNotifications([]); // safe fallback
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchNotifications();

            // Setup socket listener
            socketService.connect(token);

            const handleNewNotification = (notification: any) => {
                if (!notification || typeof notification !== 'object' || !notification.id) return;
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Browser notification
                if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === "granted") {
                    new window.Notification(notification.title, { body: notification.message });
                }
            };

            socketService.on("notification", handleNewNotification);

            return () => {
                socketService.off("notification", handleNewNotification);
            };
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [token, fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.put("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            const deleted = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (deleted && !deleted.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};
