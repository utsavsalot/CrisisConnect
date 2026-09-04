import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';

type TranslateWindow = Window & {
  translateInit?: () => void;
  google?: {
    translate?: {
      TranslateElement: new (options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean }, elementId: string) => unknown;
    };
    translateInit?: () => void;
  };
};

const getHindiEnabled = () => document.cookie.includes('googtrans=/en/hi');

const setTranslationCookie = (language: 'en' | 'hi') => {
  if (language === 'hi') {
    document.cookie = 'googtrans=/en/hi; path=/';
  } else {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
};

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [hindiEnabled, setHindiEnabled] = useState(false);

  useEffect(() => {
    setHindiEnabled(getHindiEnabled());

    const translateWindow = window as TranslateWindow;
    translateWindow.google = translateWindow.google || {};
    translateWindow.translateInit = () => {
      if (!translateWindow.google?.translate?.TranslateElement) return;
      new translateWindow.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false },
        'google_translate_element'
      );
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=translateInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLanguage = hindiEnabled ? 'en' : 'hi';
    setTranslationCookie(nextLanguage);
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
      <button
        type="button"
        onClick={toggleLanguage}
        title={hindiEnabled ? 'Switch to English' : 'हिंदी में बदलें'}
        aria-label={hindiEnabled ? 'Switch website to English' : 'Translate website to Hindi'}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-2.5 text-xs font-bold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
      >
        <Languages className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{hindiEnabled ? 'English' : 'हिन्दी'}</span>
      </button>
    </>
  );
};
