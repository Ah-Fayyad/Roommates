import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home, Search, Shield, Heart, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../../config/constants";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const schema = z.object({
    email: z.string().email(t("invalid_email")),
    password: z.string().min(1, t("password_required")),
  });
  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      const { token, user } = response.data;
      login(token, user);
      addToast(`${t("welcome_back")}, ${user.fullName}! 👋`, "success");
      navigate(user.role === "ADMIN" ? "/admin" : "/listings");
    } catch (err: any) {
      const msg = err.response?.data?.message || t("invalid_credentials_error");
      setError(msg);
      addToast(msg, "error");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const res = await axios.post(`${API_BASE_URL}/auth/google`, {
          token: tokenResponse.access_token,
          isAccessToken: true,
        });
        const { token, user } = res.data;
        login(token, user);
        addToast(`${t("welcome_back")}, ${user.fullName}! 🎉`, "success");
        navigate(user.role === "ADMIN" ? "/admin" : "/listings");
      } catch (err: any) {
        const msg = err.response?.data?.message || t("google_login_failed");
        setError(msg);
        addToast(msg, "error");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError(t("google_cancel_error")),
  });

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Branding Panel ─── */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="relative z-10 text-white text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">{t('app_name')}</span>
          </div>

          {/* Welcome text */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{t('good_to_see_you')}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {t('perfect_roommate_waiting')}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              {t('sign_in_continue')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { value: "10K+", label: t('active_listings_count') },
              { value: "95%", label: t('match_rate') },
              { value: "50K+", label: t('happy_tenants') },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-white/60 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4 text-left">
            {[
              { icon: Search, text: t('browse_verified_listings') },
              { icon: Shield, text: t('safe_secure_accounts') },
              { icon: Heart, text: t('find_compatible_fast') },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/80">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{t('app_name')}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('welcome_back_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('sign_in_account')}</p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-60 shadow-sm hover:shadow-md"
          >
            {googleLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
            ) : <GoogleIcon />}
            <span>{t('continue_with_google')}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-400">{t('or_sign_in_email')}</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                {...register("email")}
                type="email"
                placeholder={t('email_address')}
                autoComplete="email"
                className="w-full ps-10 pe-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t('password')}
                autoComplete="current-password"
                className="w-full ps-10 pe-11 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-600 dark:text-gray-400">{t('remember_me')}</span>
              </label>
              <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                {t('forgot_password')}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>{t('sign_in_btn')} <ArrowRight className={`w-5 h-5 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('dont_have_account')}{" "}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              {t('create_one_free')}
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-400">
            🔒 {t('protected_by_encryption')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
