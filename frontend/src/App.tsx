import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./context/ToastContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./config/constants";
import { Suspense, useEffect, lazy } from "react";

// Lazy loading للمكونات الثانوية
const PageLoader = lazy(() => import("./components/PageLoader"));
const AIChat = lazy(() => import("./components/AIChat"));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const UserManagement = lazy(() => import("./admin/pages/UserManagement"));
const ContentEditor = lazy(() => import("./admin/pages/ContentEditor"));
const ModerationLogs = lazy(() => import("./admin/pages/ModerationLogs"));

// Custom App Provider لجمع الـ contexts
const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <LoadingProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LoadingProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
);

function App() {
  useEffect(() => {
    // Initialize document direction based on saved language
    const savedLanguage = localStorage.getItem("language") || "ar";
    document.dir = savedLanguage === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppProvider>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">جاري التحميل...</div>}>
              <AppRoutes />

              {/* Lazy loading للمكونات الثانوية */}
              <Suspense fallback={<div />}>
                <PageLoader />
              </Suspense>

              <Suspense fallback={<div className="fixed bottom-4 right-4 z-50">
                <div className="bg-gray-800 text-white p-4 rounded-lg">
                  ...جاري التحميل
                </div>
              </div>}>
                <AIChat />
              </Suspense>
            </Suspense>
          </AppProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  );
}

export default App;
