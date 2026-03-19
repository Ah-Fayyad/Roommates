import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Button } from "../ui/Button";
import { API_BASE_URL } from "../../config/constants";
import {
  Moon,
  Sun,
  Menu,
  X,
  Home,
  Search,
  MessageCircle,
  User,
  LogOut,
  Settings,
  Heart,
  Users,
  LayoutDashboard,
  Building,
  PlusCircle,
  Flag,
  FileText,
  Sparkles,
  Calendar,
  Bell,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOnboarding =
    location.pathname === "/signup" || location.pathname === "/onboarding";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false);

  const toggleLanguage = async () => {
    setIsSwitchingLanguage(true);
    const newLang = i18n.language === "en" ? "ar" : "en";

    try {
      // Sync to backend if user is authenticated
      if (token && user) {
        await axios.put(
          `${API_BASE_URL}/users/settings`,
          { language: newLang },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      // Apply language change with a small delay for premium feel
      setTimeout(() => {
        i18n.changeLanguage(newLang);
        localStorage.setItem("language", newLang);
        document.dir = newLang === "ar" ? "rtl" : "ltr";
        setIsSwitchingLanguage(false);
      }, 800);
    } catch (error) {
      console.error("Failed to update language preference:", error);
      setIsSwitchingLanguage(false);
    }
  };

  const getNavLinks = () => {
    if (!user) {
      return [
        { to: "/", icon: Home, label: t("home") },
        { to: "/listings", icon: Search, label: t("browse_listings") },
      ];
    }

    if (user.role === "ADMIN") {
      return [
        { to: "/admin", icon: LayoutDashboard, label: t("dashboard") },
        { to: "/listings", icon: Search, label: t("browse_listings") },
        { to: "/admin/users", icon: Users, label: t("user_management") },
        { to: "/admin/reports", icon: Flag, label: t("reports") },
        { to: "/admin/content", icon: FileText, label: t("content_control") },
      ];
    }

    if (user.role === "LANDLORD" || user.role === "ADVERTISER") {
      return [
        { to: "/listings", icon: Search, label: t("browse_listings") },
        { to: "/my-listings", icon: Building, label: t("my_properties") },
        { to: "/my-visits", icon: Calendar, label: t("my_visits") },
        { to: "/listings/create", icon: PlusCircle, label: t("post_new_room") },
        { to: "/chat", icon: MessageCircle, label: t("messages") },
      ];
    }

    // Standard USER (Tenant)
    return [
      { to: "/listings", icon: Search, label: t("find_room") },
      { to: "/matches", icon: Sparkles, label: t("smart_matching") },
      { to: "/my-visits", icon: Calendar, label: t("my_visits") },
      { to: "/chat", icon: MessageCircle, label: t("messages") },
      { to: "/favorites", icon: Heart, label: t("saved_rooms") },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Language Switching Loading Overlay */}
      {isSwitchingLanguage && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md dark:bg-gray-950/90 animate-fadeIn">
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-indigo-600 rounded-full shadow-xl animate-spin border-t-transparent"></div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text animate-pulse">
                {i18n.language === "en"
                  ? t("switching_to_arabic", "جاري التحويل للعربية...")
                  : t("switching_to_english", "Switching to English...")}
              </h2>
              <p className="mt-2 font-medium text-gray-500">{t("loading")}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-50 border-b glass border-gray-200/50 dark:border-gray-700/50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 overflow-hidden transition-all duration-300 rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-xl">
                <img
                  src="/images/logo.png"
                  alt="Roommates Logo"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text hidden xs:block">
                Roommates
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isOnboarding && (
              <div className="items-center hidden gap-1 xl:gap-4 lg:flex">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group ${isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Notification Bell */}
              {user && (
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-700 transition-all duration-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 group"
                >
                  <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-gray-900 animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all duration-200 rounded-full dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full overflow-hidden shadow-sm">
                  <span className="text-[10px] uppercase font-bold">
                    {i18n.language === "en" ? "AR" : "EN"}
                  </span>
                </div>
                <span className="hidden sm:inline">
                  {i18n.language === "en" ? "العربية" : "English"}
                </span>
              </button>

              {/* Auth Buttons */}
              {!isOnboarding && (
                <>
                  {user ? (
                    <div className="items-center hidden gap-3 lg:flex">
                      <Link
                        to={
                          user.role === "ADMIN"
                            ? "/admin/settings"
                            : "/settings"
                        }
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                      >
                        <Settings className="w-5 h-5" />
                      </Link>
                      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                      >
                        <LogOut className="w-4 h-4 me-2" />
                        {t("logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="items-center hidden gap-3 lg:flex ml-2">
                      <Link to="/login">
                        <Button variant="ghost" size="sm" className="font-bold text-gray-700 dark:text-gray-300">
                          {t("login")}
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button variant="gradient" size="sm" className="font-bold px-6 shadow-indigo-200/50 dark:shadow-none hover:shadow-indigo-300/50 transition-all">
                          {t("signup")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 sm:p-2 text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="py-6 border-t animate-fadeInUp border-gray-100 dark:border-gray-800 lg:hidden overflow-y-auto max-h-[calc(100vh-5rem)]">
              <div className="flex flex-col gap-1">
                {!isOnboarding && (
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3 transition-all duration-200 rounded-2xl ${isActive
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 font-bold"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                            }`}
                        >
                          <div className={`p-2 rounded-xl ${isActive ? 'bg-white dark:bg-gray-900 shadow-sm' : ''}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {link.label}
                        </Link>
                      );
                    })}

                    <div className="my-4 border-t border-gray-100 dark:border-gray-800 mx-4"></div>

                    {user ? (
                      <>
                        <Link
                          to={user.role === "ADMIN" ? "/admin/settings" : "/settings"}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 text-gray-600 transition-all duration-200 rounded-2xl hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                        >
                          <div className="p-2">
                            <Settings className="w-5 h-5" />
                          </div>
                          {t("settings")}
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-4 px-4 py-3 text-red-600 transition-all duration-200 rounded-2xl hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <div className="p-2">
                            <LogOut className="w-5 h-5" />
                          </div>
                          {t("logout")}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3 px-4 mt-2">
                        <Link
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-700">
                            {t("login")}
                          </Button>
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full"
                        >
                          <Button variant="gradient" className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-indigo-200/50 dark:shadow-none">
                            {t("signup")}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
