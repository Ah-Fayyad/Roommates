export const API_BASE_URL = "/api";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "74034125184-b7jsjntrfcul581m9ko8m7km36jsqs92.apps.googleusercontent.com";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Roommates Finder";
export const IS_PRODUCTION = import.meta.env.VITE_ENVIRONMENT === "production";
export const IS_DEVELOPMENT =
  import.meta.env.VITE_ENVIRONMENT === "development";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  LISTINGS: {
    GET_ALL: "/listings",
    GET_BY_ID: (id: string) => `/listings/${id}`,
    CREATE: "/listings",
    UPDATE: (id: string) => `/listings/${id}`,
    DELETE: (id: string) => `/listings/${id}`,
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    UPDATE_SETTINGS: "/users/settings",
    DELETE_ACCOUNT: "/users/account",
  },
  FAVORITES: {
    GET_ALL: "/favorites",
    ADD: "/favorites",
    REMOVE: (id: string) => `/favorites/${id}`,
  },
  MESSAGES: {
    GET_CHATS: "/chats",
    GET_MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
    SEND_MESSAGE: (chatId: string) => `/chats/${chatId}/messages`,
  },
  UPLOAD: {
    IMAGES: "/upload/images",
    AVATAR: "/upload/avatar",
  },
  ANALYTICS: {
    TRACK_VIEW: (listingId: string) => `/analytics/listings/${listingId}/view`,
    GET_STATS: (listingId: string) => `/analytics/listings/${listingId}/stats`,
  },
  REPORTS: {
    CREATE: "/reports",
    GET_USER_REPORTS: "/reports/user",
    GET_ALL: "/admin/reports",
    UPDATE: (id: string) => `/reports/${id}`,
  },
  NOTIFICATIONS: {
    GET_ALL: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
  },
  VISITS: {
    CREATE: "/visits",
    GET_ALL: "/visits",
    ACCEPT: (id: string) => `/visits/${id}/accept`,
    DECLINE: (id: string) => `/visits/${id}/decline`,
    COMPLETE: (id: string) => `/visits/${id}/complete`,
  },
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  LISTINGS: "/listings",
  LISTING_DETAILS: (id: string) => `/listings/${id}`,
  CREATE_LISTING: "/listings/create",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  MESSAGES: "/messages",
  FAVORITES: "/favorites",
  MATCHES: "/matches",
  ADMIN: "/admin",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

export const LANGUAGES = {
  EN: "en",
  AR: "ar",
} as const;
