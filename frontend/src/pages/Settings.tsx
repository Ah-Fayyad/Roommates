import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/config/constants";

const Settings = () => {
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialSettings = {
    email: user?.email || "",
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    matchNotifications: true,
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    language: i18n.language,
    theme: theme,
  };

  const [settings, setSettings] = useState(initialSettings);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!settings.fullName.trim()) {
        setError("❌ " + t("name_required_error"));
        setIsSaving(false);
        return;
      }

      if (settings.newPassword || settings.currentPassword || settings.confirmPassword) {
        if (!settings.currentPassword.trim()) {
          setError("❌ " + t("current_password_required"));
          setIsSaving(false);
          return;
        }
        if (!settings.newPassword.trim()) {
          setError("❌ " + t("new_password_required"));
          setIsSaving(false);
          return;
        }
        if (settings.newPassword !== settings.confirmPassword) {
          setError("❌ " + t("passwords_do_not_match"));
          setIsSaving(false);
          return;
        }
        if (settings.newPassword.length < 8) {
          setError("❌ " + t("password_min_8"));
          setIsSaving(false);
          return;
        }
        if (settings.newPassword === settings.currentPassword) {
          setError("❌ " + t("password_same_as_current"));
          setIsSaving(false);
          return;
        }
      }

      await axios.put(`${API_BASE_URL}/users/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("✅ " + t("settings_saved_success"));
      setSettings({ ...settings, currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("settings_save_failed");
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm(t("confirm_delete_account_full"))) {
      try {
        await axios.delete(`${API_BASE_URL}/users/account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        logout();
      } catch (err: any) {
        setError(err.response?.data?.message || t("delete_account_failed"));
      }
    }
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setError("");
    setSuccess("");
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    try {
      await axios.put(
        `${API_BASE_URL}/users/settings`,
        { language: newLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      i18n.changeLanguage(newLang);
      document.dir = newLang === "ar" ? "rtl" : "ltr";
      setSettings({ ...settings, language: newLang });
    } catch (err) {
      console.error("Failed to update language setting:", err);
    }
  };

  const notificationItems = [
    {
      key: "emailNotifications",
      label: t("email_notifications"),
      description: t("email_notifications_desc"),
    },
    {
      key: "pushNotifications",
      label: t("push_notifications"),
      description: t("push_notifications_desc"),
    },
    {
      key: "messageNotifications",
      label: t("message_notifications"),
      description: t("message_notifications_desc"),
    },
    {
      key: "matchNotifications",
      label: t("match_notifications"),
      description: t("match_notifications_desc"),
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            {t("settings_title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("settings_desc")}
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="glass animate-fadeInUp stagger-1 rounded-2xl p-6">
            <div className="mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("account_settings")}
              </h2>
            </div>

            <div className="space-y-4">
              <Input
                label={t("full_name")}
                type="text"
                value={settings.fullName}
                onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                icon={<User className="h-5 w-5" />}
              />
              <Input
                label={t("phone_number_opt")}
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                icon={<Phone className="h-5 w-5" />}
                placeholder="+20 1xx xxxx xxx"
              />
              <Input
                label={t("email_address")}
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                icon={<Mail className="h-5 w-5" />}
              />

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  {t("change_password")}
                </h3>
                <div className="space-y-4">
                  <Input
                    label={t("current_password")}
                    type={showPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                    icon={<Lock className="h-5 w-5" />}
                  />
                  <Input
                    label={t("new_password")}
                    type={showPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                    icon={<Lock className="h-5 w-5" />}
                  />
                  <Input
                    label={t("confirm_new_password")}
                    type={showPassword ? "text" : "password"}
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                    icon={<Lock className="h-5 w-5" />}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPassword ? t("hide_passwords") : t("show_passwords")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass animate-fadeInUp stagger-2 rounded-2xl p-6">
            <div className="mb-6 flex items-center gap-2">
              <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("notification_settings")}
              </h2>
            </div>

            <div className="space-y-4">
              {notificationItems.map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="glass animate-fadeInUp stagger-3 rounded-2xl p-6">
            <div className="mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("privacy_settings")}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-semibold text-gray-900 dark:text-white">
                  {t("profile_visibility")}
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="public">{t("visibility_public")}</option>
                  <option value="verified">{t("visibility_verified")}</option>
                  <option value="private">{t("visibility_private")}</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("show_email_on_profile")}
                </span>
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("show_phone_on_profile")}
                </span>
                <input
                  type="checkbox"
                  checked={settings.showPhone}
                  onChange={(e) => setSettings({ ...settings, showPhone: e.target.checked })}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Appearance & Language */}
          <div className="glass animate-fadeInUp stagger-4 rounded-2xl p-6">
            <div className="mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("appearance_language")}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t("appearance")}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {theme === "dark" ? t("dark_mode") : t("light_mode")}
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t("language")}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {i18n.language === "en" ? "English" : "العربية"}
                  </div>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="rounded-xl bg-indigo-50 px-4 py-2 font-semibold text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  {i18n.language === "en" ? "العربية" : "English"}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass animate-fadeInUp stagger-5 overflow-hidden rounded-2xl border-2 border-red-200 dark:border-red-800">
            <div className="bg-red-50 p-6 dark:bg-red-900/20">
              <div className="mb-4 flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h2 className="text-2xl font-bold text-red-900 dark:text-red-300">
                  {t("danger_zone")}
                </h2>
              </div>
              <p className="mb-4 text-red-700 dark:text-red-300">
                {t("delete_account_warning")}
              </p>
              <Button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete_account")}
              </Button>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="animate-fadeInUp stagger-6">
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                {success}
              </div>
            )}
            <div className="flex justify-end gap-4">
              <Button variant="outline" size="lg" onClick={handleCancel}>
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} variant="gradient" size="lg" isLoading={isSaving}>
                {!isSaving && (
                  <>
                    <Save className={`h-5 w-5 ${isArabic ? "ml-2" : "mr-2"}`} />
                    {t("save_changes")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
