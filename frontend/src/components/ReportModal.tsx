import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Check,
  Shield,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import { api } from "@/services/api";
import { API_ENDPOINTS } from "@/config/constants";
import { useTranslation } from "react-i18next";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: "USER" | "LISTING";
}

// Report reasons - English
const REPORT_REASONS_EN = {
  SPAM: {
    label: "Spam or Scam",
    description: "Suspicious offers, false information, or spam messages",
    icon: "🚫",
  },
  INAPPROPRIATE: {
    label: "Inappropriate Content",
    description: "Contains offensive, adult, or hateful content",
    icon: "⚠️",
  },
  HARASSMENT: {
    label: "Harassment",
    description: "Abusive, threatening, or harassing behavior",
    icon: "😠",
  },
  MISLEADING: {
    label: "Misleading Information",
    description: "False or inaccurate listing details",
    icon: "❓",
  },
  FAKE_PROFILE: {
    label: "Fake Profile",
    description: "This appears to be a fake or impersonated account",
    icon: "🎭",
  },
  SCAM: {
    label: "Scam/Fraud",
    description: "Potential financial fraud or money scam",
    icon: "🔴",
  },
  OTHER: {
    label: "Other",
    description: "Something else not listed above",
    icon: "📋",
  },
};

// Report reasons - Arabic
const REPORT_REASONS_AR = {
  SPAM: {
    label: "رسائل غير مرغوبة أو احتيال",
    description: "عروض مريبة أو معلومات كاذبة أو رسائل غير مرغوبة",
    icon: "🚫",
  },
  INAPPROPRIATE: {
    label: "محتوى غير لائق",
    description: "يحتوي على محتوى مسيء أو بالغ أو كاره",
    icon: "⚠️",
  },
  HARASSMENT: {
    label: "مضايقة",
    description: "سلوك مسيء أو تهديدي أو مزعج",
    icon: "😠",
  },
  MISLEADING: {
    label: "معلومات مضللة",
    description: "تفاصيل الإعلان غير صحيحة أو غير دقيقة",
    icon: "❓",
  },
  FAKE_PROFILE: {
    label: "ملف شخصي وهمي",
    description: "يبدو أن هذا حساب وهمي أو محاكاة هوية",
    icon: "🎭",
  },
  SCAM: {
    label: "احتيال/غش",
    description: "احتيال مالي محتمل أو خدعة نقود",
    icon: "🔴",
  },
  OTHER: {
    label: "غير ذلك",
    description: "شيء آخر غير مذكور أعلاه",
    icon: "📋",
  },
};

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const REPORT_REASONS = isArabic ? REPORT_REASONS_AR : REPORT_REASONS_EN;

  const { token, isAuthenticated } = useAuth();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [descriptionLength, setDescriptionLength] = useState(0);

  const isDescriptionValid = description.trim().length >= 10 && description.trim().length <= 1000;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 1000) {
      setDescription(val);
      setDescriptionLength(val.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setErrorMessage(isArabic ? "يجب تسجيل الدخول أولاً" : "Please login to report");
      return;
    }

    if (!reason) {
      setErrorMessage(isArabic ? "يرجى اختيار سبب البلاغ" : "Please select a reason");
      return;
    }

    if (!isDescriptionValid) {
      setErrorMessage(
        isArabic
          ? "يجب أن يكون الوصف بين 10 و 1000 حرف"
          : "Description must be between 10 and 1000 characters"
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post(
        API_ENDPOINTS.REPORTS.CREATE,
        {
          targetId,
          targetType,
          reason,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus("success");
      // Auto close after 3 seconds on success
      setTimeout(() => {
        onClose();
        // Reset states
        setStatus("idle");
        setReason("");
        setDescription("");
      }, 3000);
    } catch (error: any) {
      console.error("Report submission failed:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
        (isArabic ? "فشل إرسال البلاغ. يرجى المحاولة لاحقاً." : "Failed to submit report. Please try again.")
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden border border-gray-200 shadow-2xl glass-heavy rounded-3xl dark:border-white/10 dark:bg-gray-900/90 animate-zoomIn">
        {/* Header - Improved Styling */}
        <div className="relative px-8 py-6 bg-gradient-to-br from-red-600/10 to-amber-600/10 dark:from-red-500/10 dark:to-orange-500/10 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-500 to-orange-600 shadow-lg shadow-red-500/20">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  {t("report_listing_title", isArabic ? "الإبلاغ عن الإعلان" : "Report Issue")}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest dark:text-gray-400">
                    {targetType === "USER" ? t("user") : t("listing")} • ID: {targetId.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 transition-all bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm active:scale-95 group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-6 pb-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Success State */}
          {status === "success" ? (
            <div className="py-12 space-y-6 text-center animate-fadeInUp">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-500/30">
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                  {isArabic ? "تم استلام الإبلاغ" : "Success Received!"}
                </h4>
                <p className="max-w-[300px] mx-auto text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                  {isArabic
                    ? "شكراً لك على مساعدتنا. سيقوم فريق الإشراف بمراجعة الإبلاغ واتخاذ إجراء فوري."
                    : "Thank you for helping us keep Roommates safe. Our team is looking into this now."}
                </p>
              </div>
            </div>
          ) : status === "error" ? (
            /* Error State */
            <div className="py-10 space-y-6 text-center animate-fadeInUp">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-600">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isArabic ? "فشل الإرسال" : "Oops! Submission Failed"}
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {errorMessage ||
                    (isArabic
                      ? "حدث خطأ غير متوقع. قد يكون هناك ضغط على الخادم."
                      : "The server timed out. This could be due to a slow connection.")}
                </p>
              </div>
              <Button
                onClick={() => {
                  setStatus("idle");
                  setErrorMessage("");
                }}
                variant="gradient"
                className="w-full h-12 rounded-2xl"
              >
                {isArabic ? "المحاولة مرة أخرى" : "Try Again Now"}
              </Button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-4 border border-red-200 bg-red-50/80 dark:bg-red-900/30 dark:border-red-900/50 rounded-2xl animate-shake">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Step 1: Reason Selector - Now as dynamic cards */}
              <div className="space-y-4">
                <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  {isArabic ? "لماذا تبلغ عن هذا؟" : "What's the issue?"}
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Object.entries(REPORT_REASONS).map(([key, val]: any) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setReason(key);
                        setErrorMessage("");
                      }}
                      className={`relative flex flex-col p-4 text-left transition-all rounded-2xl border-2 group hover:scale-[1.02] active:scale-[0.98] ${reason === key
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-400 shadow-lg shadow-blue-500/10"
                        : "border-gray-100 bg-white dark:bg-gray-800/50 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl filter drop-shadow-md group-hover:scale-125 transition-transform">{val.icon}</span>
                        <span className={`font-bold text-sm ${reason === key ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
                          {val.label}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                        {val.description}
                      </p>
                      {reason === key && (
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-md">
                            <Check className="w-3 h-3" strokeWidth={4} />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Description */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pl-1">
                  <label className="text-[13px] font-black text-gray-400 uppercase tracking-widest">
                    {isArabic ? "تفاصيل إضافية" : "Specific Details"}
                  </label>
                  <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${descriptionLength > 1000 ? 'bg-red-100 text-red-600' :
                    descriptionLength < 20 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                    {descriptionLength} / 1000
                  </div>
                </div>
                <div className="relative group">
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder={isArabic
                      ? "اشرح لنا ما حدث بالتفصيل ليستطيع فريقنا اتخاذ الإجراء الصحيح..."
                      : "Provide specific details to help our moderators understand the issue..."}
                    className={`w-full px-5 py-4 text-gray-900 placeholder-gray-400 transition-all bg-white border-2 rounded-2xl resize-none dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${descriptionLength > 1000
                      ? "border-red-500"
                      : reason
                        ? "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                        : "border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed"
                      }`}
                    rows={4}
                    disabled={!reason}
                  />
                  {!reason && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1 text-[10px] font-black uppercase bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full tracking-tighter">
                        {isArabic ? "اختار السبب أولاً" : "Select reason first"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400 italic">
                    {isArabic
                      ? "سيتم مراجعة هذا الإبلاغ بدقة. الإبلاغات الكاذبة قد تعرض حسابك للتجميد."
                      : "False reporting is against our guidelines and could lead to account restriction."}
                  </p>
                </div>
              </div>

              {/* Step 3: Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl font-bold border-2"
                  disabled={status === "loading"}
                >
                  {isArabic ? "تجاهل" : "Dismiss"}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className={`flex-[2] h-14 rounded-2xl font-black text-base shadow-xl transition-all active:scale-95 ${status === "loading" ? 'opacity-80' : 'shadow-red-500/20 hover:shadow-red-500/40'
                    }`}
                  disabled={status === "loading" || !isDescriptionValid || !reason.trim()}
                >
                  <div className="flex items-center justify-center gap-3">
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isArabic ? "جارٍ الإرسال..." : "Sending..."}</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>{isArabic ? "إرسال الإبلاغ فوراً" : "Submit Report Now"}</span>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
