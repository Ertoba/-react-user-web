import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { english } from "./en";
import { georgian } from "./ka";
import { russian } from "./ru";

const getInitialLanguage = () => {
  const allowedLanguages = ["ka", "ru", "en"];

  if (typeof window === "undefined") {
    return "ka";
  }

  try {
    const savedLanguage = JSON.parse(localStorage.getItem("language-setting"));
    return allowedLanguages.includes(savedLanguage) ? savedLanguage : "ka";
  } catch {
    return "ka";
  }
};

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: english,
  },
  ka: {
    translation: georgian,
  },
  ru: {
    translation: russian,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getInitialLanguage(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
