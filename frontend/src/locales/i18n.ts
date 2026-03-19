import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";

// Get saved language from localStorage or default to 'ar'
const savedLanguage = localStorage.getItem("language") || "ar";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: savedLanguage,
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

// Save language preference whenever it changes
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  document.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
