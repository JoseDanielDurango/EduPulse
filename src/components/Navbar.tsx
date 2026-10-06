import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  BookOpen,
  LogIn,
  LogOut,
  PlusCircle,
  Radio,
  Globe,
  Info,
  MessageCircle,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logout } from '../lib/firebase';
import { Language, translations } from '../lib/i18n';

interface NavbarProps {
  currentTab: 'interview' | 'dashboard' | 'guides';
  onSelectTab: (tab: 'interview' | 'dashboard' | 'guides') => void;
  currentUser: User | null;
  onNewSession: () => void;
  onOpenThesisModal: () => void;
  activeSessionParticipant?: string;
  hasActiveSession: boolean;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onNewSession,
  onOpenThesisModal,
  activeSessionParticipant,
  hasActiveSession,
  language,
  onToggleLanguage,
}) => {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const t = translations[language];

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (err) {
      console.error('Error login:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error logout:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name: EduPulse */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-100">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Edu<span className="text-emerald-600">Pulse</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.liveSync}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('interview')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'interview'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${hasActiveSession ? 'text-emerald-500 animate-pulse' : ''}`} />
              <span>{t.navChat}</span>
              {hasActiveSession && (
                <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                  {activeSessionParticipant || '•'}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>{t.navDashboard}</span>
            </button>

            <button
              onClick={() => onSelectTab('guides')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'guides'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t.navTopics}</span>
            </button>
          </nav>

          {/* Controls: Language Switcher, Info, Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher Button: English / Spanish Toggle */}
            <button
              onClick={onToggleLanguage}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-300/90 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition shadow-2xs hover:border-emerald-300 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span className={language === 'es' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-normal'}>ES</span>
              <span className="text-slate-300 text-[10px]">|</span>
              <span className={language === 'en' ? 'text-emerald-700 font-extrabold' : 'text-slate-400 font-normal'}>EN</span>
            </button>

            {/* Subtle About / Research Info button */}
            <button
              onClick={onOpenThesisModal}
              title={t.navInfo}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <Info className="h-4 w-4" />
            </button>

            {/* New Chat Button */}
            <button
              onClick={onNewSession}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm hover:shadow active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{t.newChat}</span>
            </button>

            {/* Google Authentication */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="h-8 w-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  title={t.signOut}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition shadow-2xs"
              >
                <LogIn className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden md:inline">{t.signInGoogle}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
