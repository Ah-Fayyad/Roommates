import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
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
} from "lucide-react";

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
                  ? t("switching_to_arabic")
                  : t("switching_to_english")}
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
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-12 h-12 overflow-hidden transition-all duration-300 rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-xl">
                <img
                  src="/images/logo.png"
                  alt={t("app_name")}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                {t("app_name")}
              </span>
            </Link>

            {/* Desktop Navigation */}
            {!isOnboarding && (
              <div className="items-center hidden gap-6 md:flex">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 rounded-lg group hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                    >
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-3">
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
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {i18n.language === "en" ? "العربية" : "English"}
              </button>

              {/* Auth Buttons */}
              {!isOnboarding && (
                <>
                  {user ? (
                    <div className="items-center hidden gap-2 md:flex">
                      <Link
                        to={
                          user.role === "ADMIN"
                            ? "/admin/settings"
                            : "/settings"
                        }
                      >
                        <Button variant="ghost" size="icon">
                          <Settings className="w-5 h-5" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="items-center hidden gap-2 md:flex">
                      <Link to="/login">
                        <Button variant="ghost" size="sm">
                          {t("login")}
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button variant="gradient" size="sm">
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
                className="p-2 text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
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
            <div className="py-4 border-t animate-fadeIn border-gray-200/50 dark:border-gray-700/50 md:hidden">
              <div className="flex flex-col gap-2">
                {!isOnboarding && (
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      );
                    })}

                    {user ? (
                      <>
                        <Link
                          to={
                            user.role === "ADMIN"
                              ? "/admin/settings"
                              : "/settings"
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 transition-all duration-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                        >
                          <Settings className="w-5 h-5" />
                          {t("settings")}
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          <LogOut className="w-5 h-5" />
                          {t("logout")}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 px-4 mt-4">
                        <Link
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            {t("login")}
                          </Button>
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button variant="gradient" className="w-full">
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
