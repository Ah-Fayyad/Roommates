import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  CheckCircle,
  Home,
  Phone,
  Shield,
  Upload,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  Search,
  Heart,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import axios from "axios";
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

const Signup = () => {
  const { register: registerUser, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"USER" | "LANDLORD" | "ADVERTISER">("USER");
  const [error, setError] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const [preferences, setPreferences] = useState({
    cleanliness: 5, studyHabits: 5, quietHours: 5,
    socializing: 5, cooking: 5, pets: false, smoking: false,
    guests: true, sleepSchedule: "FLEXIBLE", workSchedule: "STUDENT", budget: 5000,
  });

  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const fileInputFront = useRef<HTMLInputElement>(null);
  const fileInputBack = useRef<HTMLInputElement>(null);

  const schema = z.object({
    fullName: z.string().min(2, t('name_min_2')),
    email: z.string().email(t('invalid_email')),
    phoneNumber: z.string().min(10, t('phone_min_10')).optional().or(z.literal("")),
    password: z.string().min(6, t('password_min_6')),
    confirmPassword: z.string(),
  }).refine(d => d.password === d.confirmPassword, {
    message: t('passwords_do_not_match'),
    path: ["confirmPassword"],
  });

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, watch, trigger, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Watch password for strength
  const watchPassword = watch("password", "");
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const strength = getStrength(watchPassword);
  const strengthLabels = ["", "weak", "fair", "good", "strong"];
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      await registerUser(
        data.email,
        data.password,
        data.fullName,
        role,
        data.phoneNumber,
        university,
        bio,
        preferences,
        companyName,
        licenseNumber
      );

      // Handle ID upload for Landlords/Advertisers
      if ((role === "LANDLORD" || role === "ADVERTISER") && (idFront || idBack)) {
        try {
          const formData = new FormData();
          if (idFront) formData.append("front", idFront);
          if (idBack) formData.append("back", idBack);
          const token = localStorage.getItem("token");
          await axios.post(`${API_BASE_URL}/users/verify-identity`, formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
        } catch (e) {
          console.error("ID verification upload failed:", e);
        }
      }

      addToast(t("welcome_aboard"), "success");
      navigate(role === "LANDLORD" || role === "ADVERTISER" ? "/listings/create" : "/listings");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || t("error_occurred");
      setError(msg);
      addToast(msg, "error");
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const res = await axios.post(`${API_BASE_URL}/auth/google`, {
          token: tokenResponse.access_token,
          isAccessToken: true,
          role: role,
        });
        const { token, user, isNewUser } = res.data;
        login(token, user);
        const welcomeMsg = isNewUser ? t("welcome_aboard") : t("welcome_back");
        addToast(`${welcomeMsg}, ${user.fullName}! 🎉`, "success");
        navigate("/listings");
      } catch (err: any) {
        const msg = err.response?.data?.message || t("google_registration_failed");
        setError(msg);
        addToast(msg, "error");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError(t("google_login_failed_email_reg")),
  });

  const totalSteps = 3;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  // ===================== STEP RENDERERS =====================
  const renderStep1 = () => (
    <div className="animate-fadeInUp">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>{t("get_started_free")}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("how_will_you_use_roommates")}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t("choose_account_type")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {[
          {
            id: "USER",
            icon: Search,
            title: t("looking_for_room"),
            desc: t("looking_desc"),
            gradient: "from-indigo-500 to-purple-600",
          },
          {
            id: "LANDLORD",
            icon: Building2,
            title: t("have_room_rent"),
            desc: t("host_desc"),
            gradient: "from-purple-500 to-pink-600",
          },
          {
            id: "ADVERTISER",
            icon: Briefcase,
            title: t("real_estate_agent"),
            desc: t("agent_desc"),
            gradient: "from-blue-500 to-cyan-600",
          },
        ].map(({ id, icon: Icon, title, desc, gradient }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setRole(id as any); setStep(2); }}
            className="group relative flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white text-base">{title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight className={`h-5 w-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-sm text-gray-400">{t("or_continue_with")}</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      <button
        type="button"
        onClick={() => handleGoogleSignup()}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-60"
      >
        {googleLoading ? <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" /> : <GoogleIcon />}
        <span>{t("signup_with_google")}</span>
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        {t("already_have_account")} <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{t("sign_in")}</Link>
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors group">
          <ChevronLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${i18n.language === 'ar' ? 'rotate-180' : ''}`} /> {t("back")}
        </button>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 uppercase`}>
          {role === "USER" ? t("tenant_account") : role === "LANDLORD" ? t("landlord_account") : t("agent_account")}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t("create_account")}</h2>
        <p className="text-sm text-gray-500">{t("your_security_matters")}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 flex items-center gap-2">
          <Shield className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <UserIcon className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input {...register("fullName")} placeholder={t("full_name")} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none transition-all" />
          {errors.fullName && <p className="mt-1 text-[10px] text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="relative">
          <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input {...register("email")} type="email" placeholder={t("email_address")} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none transition-all" />
          {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input {...register("phoneNumber")} placeholder={t("phone_number_opt")} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none transition-all" />
        </div>

        <div className="relative">
          <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
            autoComplete="new-password"
            className="w-full ps-10 pe-11 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none transition-all"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600 p-1">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {watchPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-gray-100 dark:bg-gray-800"}`} />
                ))}
              </div>
              <p className={`text-[10px] font-bold ${strengthColors[strength].replace('bg-', 'text-')}`}>
                {i18n.language === 'ar' ? `${t('password')} ${t(strengthLabels[strength] + '_password')}` : `${t(strengthLabels[strength] + '_password')} ${t('password')}`}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input {...register("confirmPassword")} type={showConfirm ? "text" : "password"} placeholder={t("confirm_password")} className="w-full ps-10 pe-11 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none transition-all" />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600 p-1">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.confirmPassword && <p className="mt-1 text-[10px] text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="button"
          onClick={async () => {
            const isValid = await trigger(["fullName", "email", "password", "confirmPassword"]);
            if (isValid) {
              setStep(3);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
        >
          {t("next_step")} <ArrowRight className={`w-5 h-5 mx-1 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t("or")}</span>
          <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
        </div>

        <button
          type="button"
          onClick={() => handleGoogleSignup()}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-sm font-semibold text-gray-600 dark:text-gray-400"
        >
          {googleLoading ? <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" /> : <GoogleIcon />}
          <span>{t("signup_with_google")}</span>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <ChevronLeft className={`w-4 h-4 ${i18n.language === 'ar' ? 'rotate-180' : ''}`} /> {t("back")}
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {role === "USER" ? t("living_preferences") : role === "ADVERTISER" ? t("company_details") : t("identity_verification")}
        </h2>
        <p className="text-sm text-gray-500">{role === "USER" ? t("helping_match_roommates") : t("identity_desc")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {role === "USER" ? (
          <>
            <div className="relative">
              <GraduationCap className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={university} onChange={e => setUniversity(e.target.value)} placeholder={t("university_workplace_opt")} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none transition-all" />
            </div>
            <div className="space-y-5 py-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                  <span>{t("cleanliness")}</span>
                  <span className="text-indigo-600">{preferences.cleanliness}/10</span>
                </div>
                <input type="range" min="1" max="10" value={preferences.cleanliness} onChange={e => setPreferences({ ...preferences, cleanliness: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                  <span>{t("socializing")}</span>
                  <span className="text-purple-600">{preferences.socializing}/10</span>
                </div>
                <input type="range" min="1" max="10" value={preferences.socializing} onChange={e => setPreferences({ ...preferences, socializing: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                  <span>{t("monthly_budget_egp")}</span>
                  <span className="text-indigo-600">{preferences.budget} {t('egp')}</span>
                </div>
                <input type="range" min="1000" max="20000" step="500" value={preferences.budget} onChange={e => setPreferences({ ...preferences, budget: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
            </div>
          </>
        ) : role === "ADVERTISER" ? (
          <>
            <div className="relative">
              <Building2 className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder={t("company_name")} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="relative">
              <Shield className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder={t("license_number")} className="w-full ps-10 pe-4 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-indigo-500 focus:outline-none" />
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
            <p className="text-sm text-indigo-700 dark:text-indigo-400">{t("verified_landlords_benefit")}</p>
          </div>
        )}

        {(role === "LANDLORD" || role === "ADVERTISER") && (
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => fileInputFront.current?.click()} className={`aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${idFront ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-indigo-400"}`}>
              <input type="file" hidden ref={fileInputFront} onChange={e => e.target.files?.[0] && setIdFront(e.target.files[0])} />
              {idFront ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Upload className="w-6 h-6 text-gray-300" />}
              <span className="text-[10px] font-bold text-gray-500 uppercase">{t("front_side")}</span>
            </button>
            <button type="button" onClick={() => fileInputBack.current?.click()} className={`aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${idBack ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-indigo-400"}`}>
              <input type="file" hidden ref={fileInputBack} onChange={e => e.target.files?.[0] && setIdBack(e.target.files[0])} />
              {idBack ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Upload className="w-6 h-6 text-gray-300" />}
              <span className="text-[10px] font-bold text-gray-500 uppercase">{t("back_side")}</span>
            </button>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50">
          {isSubmitting ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <><CheckCircle className="w-5 h-5" /> {t("complete_registration")}</>}
        </button>

        {(role === "LANDLORD" || role === "ADVERTISER") && (
          <button type="button" onClick={handleSubmit(onSubmit)} className="w-full py-1 text-[10px] text-gray-400 uppercase tracking-widest hover:text-indigo-500 transition-colors">{t("skip_for_now")}</button>
        )}
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex selection:bg-indigo-100 selection:text-indigo-900">
      {/* ─── DARK BRANDING PANEL ─── */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] relative flex-col items-center justify-center p-12 overflow-hidden bg-[#0A0D14]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,22px,0.15)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />

        <div className="relative z-10 w-full max-w-sm">
          <Link to="/" className="flex items-center gap-3 mb-16 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">Roommates</span>
          </Link>

          <div className="space-y-12">
            {[
              { icon: TrendingUp, title: t("smart_matching"), desc: t("smart_matching_desc") },
              { icon: Shield, title: t("safe_secure_accounts"), desc: t("trust_is_key") },
              { icon: Heart, title: t("community_first"), desc: t("find_compatible_fast") },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-300">
                  <Icon className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-white/80 text-sm italic mb-4 leading-relaxed font-medium">"{t("sarah_quote")}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border border-white/20" />
              <div>
                <p className="text-white font-bold text-xs uppercase tracking-wider">{t("sarah_m")}</p>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{t("sarah_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── WHITE FORM PANEL ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-[#0A0D14] overflow-y-auto">
        <div className="w-full max-w-sm">
          {step > 1 && (
            <div className="mb-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[2px] text-gray-400 mb-3">
                <span>{t("step")} {step} / {totalSteps}</span>
                <span className="text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default Signup;
