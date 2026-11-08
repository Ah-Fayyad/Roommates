import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  Check,
  Shield,
  Home,
  Upload,
} from "lucide-react";
import { API_BASE_URL } from '@/config/constants';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [preferences, setPreferences] = useState({
    cleanliness: 5,
    studyHabits: 5,
    quietHours: 5,
    socializing: 5,
    cooking: 5,
    pets: false,
    smoking: false,
    guests: true,
    sleepSchedule: "FLEXIBLE",
    workSchedule: "STUDENT",
    budget: 500,
  });

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(
        `${API_BASE_URL}/users/profile`,
        {
          preferences,
          phone: phoneNumber,
          university,
          bio
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (user?.role === "LANDLORD") {
        navigate("/listings/create");
      } else {
        navigate("/listings");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      if (user?.role === "LANDLORD") {
        navigate("/listings/create");
      } else {
        navigate("/listings");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tenantSteps = [
    {
      title: t('welcome_to_roommates'),
      subtitle: t('find_perfect_living'),
      content: (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('welcome_onboarding')}
          </h2>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            {t('onboarding_help_setup')}
          </p>
          <div className="space-y-4 text-left">
            <div>
              <label className="block mb-2 font-semibold text-gray-900 dark:text-white">{t('university_institution')}</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[t('uni_cairo', "Cairo University"), t('uni_ain_shams', "Ain Shams"), t('uni_auc', "AUC"), t('uni_guc', "GUC"), t('uni_bue', "BUE"), t('uni_aou', "AOU"), t('uni_must', "MUST"), t('uni_msa', "MSA")].map(uni => (
                  <button
                    key={uni}
                    onClick={() => setUniversity(uni)}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${university === uni
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40"
                      : "border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {uni}
                  </button>
                ))}
                  <button
                    onClick={() => setUniversity("Other")}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${university === "Other" || (![t('uni_cairo'), t('uni_ain_shams'), t('uni_auc'), t('uni_guc'), t('uni_bue'), t('uni_aou'), t('uni_must'), t('uni_msa')].includes(university) && university !== "")
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40"
                      : "border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {t('other')}
                  </button>
              </div>
              {(university === "Other" || (![t('uni_cairo'), t('uni_ain_shams'), t('uni_auc'), t('uni_guc'), t('uni_bue'), t('uni_aou'), t('uni_must'), t('uni_msa')].includes(university) && university !== "")) && (
                <input
                  type="text"
                  placeholder={t('type_university_name')}
                  value={university === "Other" ? "" : university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-4 py-2 mt-2 bg-white border-2 border-indigo-500 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                  autoFocus
                />
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-900 dark:text-white">{t('short_bio')}</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { key: 'final_year', emoji: "🎓" },
                  { key: 'pro_worker', emoji: "💼" },
                  { key: 'quiet_clean', emoji: "✨" },
                  { key: 'from_gov', emoji: "🚆" },
                  { key: 'military_need', emoji: "🪖" },
                  { key: 'long_commute', emoji: "📍" },
                  { key: 'quiet_study', emoji: "📚" },
                  { key: 'non_smoker_pets', emoji: "🐾" }
                ].map(tag => (
                  <button
                    key={tag.key}
                    onClick={() => setBio(prev => prev ? `${prev} ${t(tag.key)}` : t(tag.key))}
                    className="px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all text-indigo-700 dark:text-indigo-300 font-medium active:scale-95"
                  >
                    + {t(tag.key)}
                  </button>
                ))}
              </div>
              <textarea
                placeholder={t('describe_yourself')}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-indigo-500 focus:ring-0 min-h-[100px]"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('living_habits'),
      subtitle: t('help_understand_daily'),
      content: (
        <div className="space-y-6">
          {[
            {
              key: "cleanliness",
              label: t('daily_tidiness'),
              options: [
                { val: 2, label: t('relaxed_chill'), icon: "🧺" },
                { val: 5, label: t('responsible'), icon: "✨" },
                { val: 9, label: t('obsessive'), icon: "🛡️" }
              ]
            },
            {
              key: "quietHours",
              label: t('house_atmosphere_label'),
              options: [
                { val: 2, label: t('social_active'), icon: "🎵" },
                { val: 5, label: t('moderate'), icon: "🌆" },
                { val: 9, label: t('zen_silence'), icon: "🔇" }
              ]
            },
            {
              key: "socializing",
              label: t('interaction'),
              options: [
                { val: 2, label: t('independent'), icon: "📖" },
                { val: 5, label: t('friendly'), icon: "👋" },
                { val: 9, label: t('shared_life'), icon: "🎉" }
              ]
            },
            {
              key: "studyHabits",
              label: t('academic_focus'),
              options: [
                { val: 2, label: t('mobile_study'), icon: "☕" },
                { val: 5, label: t('home_office'), icon: "📝" },
                { val: 9, label: t('dean_list'), icon: "📜" }
              ]
            },
          ].map((pref) => (
            <div key={pref.key}>
              <div className="mb-3">
                <div className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm">
                  {pref.label}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {pref.options.map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setPreferences({ ...preferences, [pref.key]: opt.val })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group ${preferences[pref.key as keyof typeof preferences] === opt.val
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40"
                      : "border-gray-100 dark:border-gray-800 hover:border-indigo-200"
                      }`}
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className={`text-xs font-bold ${preferences[pref.key as keyof typeof preferences] === opt.val ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('daily_routine_title'),
      subtitle: t('matching_schedules_key'),
      content: (
        <div className="space-y-6">
          <div>
            <label className="block mb-4 font-semibold text-gray-900 dark:text-white">{t('sleep_schedule')}</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "EARLY_BIRD", label: t('early_bird'), icon: "🌅" },
                { val: "NIGHT_OWL", label: t('night_owl'), icon: "🦉" },
                { val: "FLEXIBLE", label: t('flexible'), icon: "⚖️" }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setPreferences({ ...preferences, sleepSchedule: opt.val })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${preferences.sleepSchedule === opt.val
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40"
                    : "border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300"
                    }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="text-xs font-bold">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-4 font-semibold text-gray-900 dark:text-white">{t('work_study_schedule')}</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "9_TO_5", label: t('job_9_5'), icon: "💼" },
                { val: "REMOTE", label: t('remote'), icon: "🏠" },
                { val: "NIGHT_SHIFT", label: t('night_shift'), icon: "🌙" },
                { val: "STUDENT", label: t('student'), icon: "🎓" }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setPreferences({ ...preferences, workSchedule: opt.val })}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${preferences.workSchedule === opt.val
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40"
                    : "border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300"
                    }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="text-xs font-bold">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('household_rules'),
      subtitle: t('boundaries_perfect_match'),
      content: (
        <div className="space-y-4">
          {[
            { key: "pets", label: t('pet_friendly'), icon: "🐾", desc: t('pets_okay_desc') },
            { key: "smoking", label: t('smoking'), icon: "🚬", desc: t('smoking_okay_desc') },
            { key: "guests", label: t('frequent_guests'), icon: "👥", desc: t('guests_okay_desc') },
          ].map((pref) => (
            <button
              key={pref.key}
              onClick={() => setPreferences({ ...preferences, [pref.key]: !preferences[pref.key as keyof typeof preferences] })}
              className={`flex items-center justify-between w-full rounded-xl border-2 p-4 transition-all ${preferences[pref.key as keyof typeof preferences]
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40"
                : "border-gray-200 dark:border-gray-700"
                }`}
            >
              <div className="flex items-center gap-4 text-left">
                <span className="text-2xl">{pref.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{pref.label}</div>
                  <div className="text-xs text-gray-500">{pref.desc}</div>
                </div>
              </div>
              <div className={`h-6 w-11 rounded-full transition-colors relative ${preferences[pref.key as keyof typeof preferences] ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${preferences[pref.key as keyof typeof preferences] ? 'translate-x-5' : ''}`} />
              </div>
            </button>
          ))}

          <div className="rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700 space-y-4">
            <label className="block font-semibold text-gray-900 dark:text-white">{t('purpose_duration')} ⏳</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "academic", label: t('long_term_duration'), icon: "📅" },
                { id: "short", label: t('short_term_duration'), icon: "⏱️" },
                { id: "military", label: t('military_duration'), icon: "🪖" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setBio(prev => prev.includes(item.label) ? prev : `${prev} [${t('looking_for')}: ${item.label}]`)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-all dark:border-gray-800 dark:hover:border-indigo-900 text-left group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
            <label className="mb-4 block font-semibold text-gray-900 dark:text-white">{t('monthly_budget_egp')}</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: t('economy_student_friendly'), val: 3000 },
                { label: t('standard_most_popular'), val: 6000 },
                { label: t('premium_high_quality'), val: 11000 },
                { label: t('luxury_exclusive'), val: 20000 }
              ].map(tier => (
                <button
                  key={tier.val}
                  onClick={() => setPreferences({ ...preferences, budget: tier.val })}
                  className={`px-3 py-2 text-xs rounded-lg border-2 transition-all ${preferences.budget === tier.val
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40"
                    : "border-gray-100 hover:border-indigo-200 dark:border-gray-800 dark:text-gray-400"
                    }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={preferences.budget}
              onChange={(e) => setPreferences({ ...preferences, budget: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="mt-2 text-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {preferences.budget} {t('currency')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('all_set'),
      subtitle: t('ai_analyzing_profile'),
      content: (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
            <Check className="h-16 w-16 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('profile_optimized')} 🎉
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            {t('ai_data_ready')}
          </p>
          <div className="rounded-xl bg-indigo-50 p-6 dark:bg-indigo-900/20 text-left">
            <h3 className="mb-4 font-bold text-indigo-900 dark:text-indigo-300">
              {t('ai_matching_enabled')}:
            </h3>
            <div className="space-y-3">
              {[
                t('lifestyle_sync_analysis'),
                t('schedule_overlap_detection'),
                t('budget_alignment_verification'),
                t('behavioral_compatibility_scoring'),
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const landlordSteps = [
    {
      title: t('welcome_landlord'),
      subtitle: t('landlord_get_ready'),
      content: (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse">
            <Home className="h-16 w-16 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('welcome_aboard')} 🏠
          </h2>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            {t('landlord_onboarding_desc')}
          </p>
          <div className="grid gap-4 text-left md:grid-cols-3">
            {[
              {
                icon: "🛡️",
                title: t('secure_platform'),
                desc: t('verified_tenants_only'),
              },
              {
                icon: "💰",
                title: t('smart_pricing'),
                desc: t('ai_price_recs'),
              },
              {
                icon: "📈",
                title: t('easy_management'),
                desc: t('track_visits_requests'),
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
              >
                <div className="mb-2 text-3xl">{feature.icon}</div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t('identity_contact'),
      subtitle: t('verify_identity_contact'),
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Shield className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>

          <div className="text-left">
            <label className="block mb-2 font-semibold text-gray-900 dark:text-white">{t('phone_required')}</label>
            <input
              type="tel"
              placeholder="+20 1xx xxxx xxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-indigo-500 focus:ring-0"
            />
            <p className="mt-2 text-xs text-gray-500">{t('phone_shown_to_verified')}</p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 dark:border-gray-700">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              {t('upload_id_document')}
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              {t('id_document_types')}
            </p>
            <Button variant="outline" size="sm">
              {t('choose_file')}
            </Button>
            <p className="mt-4 text-xs text-gray-400">
              {t('id_security_note')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t('ready_to_post'),
      subtitle: t('create_first_listing_now'),
      content: (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
            <Check className="h-16 w-16 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {t('you_are_verified')} ✅
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            {t('account_setup_done')}
          </p>
          <Button
            onClick={handleComplete}
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('saving') : t('create_first_listing')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      ),
    },
  ];

  const steps = user?.role === "LANDLORD" ? landlordSteps : tenantSteps;
  const currentStep = steps[step - 1];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-400">
            <span>
              {t('step_x_of_y', { x: step, y: steps.length })}
            </span>
            <span>{Math.round((step / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="glass animate-fadeInUp rounded-3xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {currentStep.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentStep.subtitle}
            </p>
          </div>

          <div className="mb-8">{currentStep.content}</div>

          {/* Navigation */}
          <div className="flex justify-between">
            {step > 1 ? (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                size="lg"
              >
                {t('back')}
              </Button>
            ) : (
              <div></div>
            )}

            {step < steps.length ? (
              <Button
                onClick={() => setStep(step + 1)}
                variant="gradient"
                size="lg"
              >
                {t('continue')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              user?.role !== "LANDLORD" && (
                <Button onClick={handleComplete} variant="gradient" size="lg">
                  {t('start_exploring')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
