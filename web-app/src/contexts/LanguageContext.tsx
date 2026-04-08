import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'bn';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'SkinDetect.AI', tagline: 'AI-Powered Skin Diagnostics',
    login: 'Login', logout: 'Logout', register: 'Register',
    dashboard: 'Dashboard', scan: 'Scan Now', results: 'Results',
    history: 'Scan History', settings: 'Settings', uploadImage: 'Upload Image',
    riskLevel: 'Risk Level', confidence: 'Confidence', disease: 'Detected Condition',
    recommendations: 'Recommendations', downloadReport: 'Download PDF Report',
    welcomeBack: 'Welcome Back', noHistory: 'No scans yet',
    low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk', critical: 'Critical',
    chatbot: 'AI Assistant', close: 'Close', darkMode: 'Dark Mode', lightMode: 'Light Mode',
    changeLanguage: 'Change Language',
    healthGuide: 'Health Guide',
  },
  hi: {
    appName: 'SkinDetect.AI', tagline: 'AI-संचालित त्वचा निदान',
    login: 'लॉग इन', logout: 'लॉग आउट', register: 'पंजीकरण',
    dashboard: 'डैशबोर्ड', scan: 'स्कैन करें', results: 'परिणाम',
    history: 'स्कैन इतिहास', settings: 'सेटिंग्स', uploadImage: 'छवि अपलोड करें',
    riskLevel: 'जोखिम स्तर', confidence: 'विश्वास', disease: 'पहचानी गई स्थिति',
    recommendations: 'सिफारिशें', downloadReport: 'PDF रिपोर्ट डाउनलोड करें',
    welcomeBack: 'वापस स्वागत है', noHistory: 'अभी तक कोई स्कैन नहीं',
    low: 'कम जोखिम', moderate: 'मध्यम जोखिम', high: 'उच्च जोखिम', critical: 'गंभीर',
    chatbot: 'AI सहायक', close: 'बंद करें', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड',
    changeLanguage: 'भाषा बदलें',
    healthGuide: 'स्वास्थ्य मार्गदर्शिका',
  },
  te: {
    appName: 'SkinDetect.AI', tagline: 'AI-ఆధారిత చర్మ నిర్ధారణ',
    login: 'లాగిన్', logout: 'లాగ్ అవుట్', register: 'నమోదు',
    dashboard: 'డాష్‌బోర్డ్', scan: 'స్కాన్ చేయండి', results: 'ఫలితాలు',
    history: 'స్కాన్ చరిత్ర', settings: 'సెట్టింగులు', uploadImage: 'చిత్రం అప్‌లోడ్ చేయండి',
    riskLevel: 'ప్రమాద స్థాయి', confidence: 'విశ్వాసం', disease: 'గుర్తించిన పరిస్థితి',
    recommendations: 'సిఫార్సులు', downloadReport: 'PDF నివేదిక డౌన్‌లోడ్ చేయండి',
    welcomeBack: 'తిరిగి స్వాగతం', noHistory: 'ఇంకా స్కాన్ లేదు',
    low: 'తక్కువ ప్రమాదం', moderate: 'మధ్యస్థ ప్రమాదం', high: 'అధిక ప్రమాదం', critical: 'క్లిష్టమైన',
    chatbot: 'AI సహాయకుడు', close: 'మూసివేయి', darkMode: 'డార్క్ మోడ్', lightMode: 'లైట్ మోడ్',
    changeLanguage: 'భాష మార్చండి',
    healthGuide: 'ఆరోగ్య గైడ్',
  },
  ta: {
    appName: 'SkinDetect.AI', tagline: 'AI-இயக்கும் தோல் கண்டறிதல்',
    login: 'உள்நுழை', logout: 'வெளியேறு', register: 'பதிவு',
    dashboard: 'டாஷ்போர்டு', scan: 'ஸ்கேன் செய்யுங்கள்', results: 'முடிவுகள்',
    history: 'ஸ்கேன் வரலாறு', settings: 'அமைப்புகள்', uploadImage: 'படம் பதிவேற்று',
    riskLevel: 'அபாய நிலை', confidence: 'நம்பிக்கை', disease: 'கண்டறியப்பட்ட நிலை',
    recommendations: 'பரிந்துரைகள்', downloadReport: 'PDF அறிக்கை பதிவிறக்கம்',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்', noHistory: 'இன்னும் ஸ்கேன் இல்லை',
    low: 'குறைந்த அபாயம்', moderate: 'மிதமான அபாயம்', high: 'அதிக அபாயம்', critical: 'அவசரம்',
    chatbot: 'AI உதவியாளர்', close: 'மூடு', darkMode: 'இருண்ட பயன்முறை', lightMode: 'வெளிச்ச பயன்முறை',
    changeLanguage: 'மொழி மாற்று',
    healthGuide: 'சுகாதார வழிகாட்டி',
  },
  kn: {
    appName: 'SkinDetect.AI', tagline: 'AI-ಆಧಾರಿತ ಚರ್ಮ ರೋಗ ನಿರ್ಣಯ',
    login: 'ಲಾಗಿನ್', logout: 'ಲಾಗ್ ಔಟ್', register: 'ನೋಂದಣಿ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', scan: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', results: 'ಫಲಿತಾಂಶಗಳು',
    history: 'ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸ', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', uploadImage: 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    riskLevel: 'ಅಪಾಯ ಮಟ್ಟ', confidence: 'ವಿಶ್ವಾಸ', disease: 'ಪತ್ತೆ ಆದ ಸ್ಥಿತಿ',
    recommendations: 'ಶಿಫಾರಸುಗಳು', downloadReport: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್',
    welcomeBack: 'ಮರಳಿ ಸ್ವಾಗತ', noHistory: 'ಇನ್ನೂ ಸ್ಕ್ಯಾನ್ ಇಲ್ಲ',
    low: 'ಕಡಿಮೆ ಅಪಾಯ', moderate: 'ಮಧ್ಯಮ ಅಪಾಯ', high: 'ಹೆಚ್ಚಿನ ಅಪಾಯ', critical: 'ಗಂಭೀರ',
    chatbot: 'AI ಸಹಾಯಕ', close: 'ಮುಚ್ಚಿ', darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್', lightMode: 'ಲೈಟ್ ಮೋಡ್',
    changeLanguage: 'ಭಾಷೆ ಬದಲಿಸಿ',
    healthGuide: 'ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ',
  },
  ml: {
    appName: 'SkinDetect.AI', tagline: 'AI-പ്രേരിത ചർമ്മ രോഗനിർണ്ണയം',
    login: 'ലോഗിൻ', logout: 'ലോഗ് ഔട്ട്', register: 'രജിസ്ട്രേഷൻ',
    dashboard: 'ഡാഷ്‌ബോർഡ്', scan: 'സ്കാൻ ചെയ്യൂ', results: 'ഫലങ്ങൾ',
    history: 'സ്കാൻ ചരിത്രം', settings: 'ക്രമീകരണങ്ങൾ', uploadImage: 'ചിത്രം അപ്‌ലോഡ് ചെയ്യൂ',
    riskLevel: 'അപകട നില', confidence: 'ആത്മവിശ്വാസം', disease: 'കണ്ടെത്തിയ അവസ്ഥ',
    recommendations: 'ശുപാർശകൾ', downloadReport: 'PDF റിപ്പോർട്ട് ഡൗൺലോഡ്',
    welcomeBack: 'തിരിച്ചു സ്വാഗതം', noHistory: 'ഇതുവരെ സ്കാൻ ഇല്ല',
    low: 'കുറഞ്ഞ അപകടം', moderate: 'മിതമായ അപകടം', high: 'ഉയർന്ന അപകടം', critical: 'ഗുരുതരം',
    chatbot: 'AI സഹായി', close: 'അടക്കുക', darkMode: 'ഡാർക്ക് മോഡ്', lightMode: 'ലൈറ്റ് മോഡ്',
    changeLanguage: 'ഭാഷ മാറ്റുക',
    healthGuide: 'ആരോഗ്യ ഗൈഡ്',
  },
  bn: {
    appName: 'SkinDetect.AI', tagline: 'AI-চালিত ত্বক রোগ নির্ণয়',
    login: 'লগইন', logout: 'লগ আউট', register: 'নিবন্ধন',
    dashboard: 'ড্যাশবোর্ড', scan: 'স্ক্যান করুন', results: 'ফলাফল',
    history: 'স্ক্যান ইতিহাস', settings: 'সেটিংস', uploadImage: 'ছবি আপলোড করুন',
    riskLevel: 'ঝুঁকির মাত্রা', confidence: 'আস্থা', disease: 'সনাক্তকৃত অবস্থা',
    recommendations: 'সুপারিশ', downloadReport: 'PDF রিপোর্ট ডাউনলোড',
    welcomeBack: 'ফিরে আসুন', noHistory: 'এখনো স্ক্যান নেই',
    low: 'কম ঝুঁকি', moderate: 'মাঝারি ঝুঁকি', high: 'উচ্চ ঝুঁকি', critical: 'গুরুতর',
    chatbot: 'AI সহকারী', close: 'বন্ধ', darkMode: 'ডার্ক মোড', lightMode: 'লাইট মোড',
    changeLanguage: 'ভাষা পরিবর্তন',
    healthGuide: 'স্বাস্থ্য নির্দেশিকা',
  },
};

const LANG_LABELS: Record<Language, string> = {
  en: 'English', hi: 'हिंदी', te: 'తెలుగు', ta: 'தமிழ்', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', bn: 'বাংলা',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
  langLabel: string;
  allLanguages: { code: Language; label: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() =>
    (localStorage.getItem('skindetect_language') as Language) || 'en'
  );

  const setLanguage = (l: Language) => {
    localStorage.setItem('skindetect_language', l);
    setLangState(l);
    // Apply RTL/LTR direction
    document.documentElement.setAttribute('lang', l);
  };

  const t = (key: string): string =>
    TRANSLATIONS[language]?.[key] ?? TRANSLATIONS['en']?.[key] ?? key;

  const allLanguages = Object.entries(LANG_LABELS).map(([code, label]) => ({
    code: code as Language,
    label,
  }));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, langLabel: LANG_LABELS[language], allLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
};
