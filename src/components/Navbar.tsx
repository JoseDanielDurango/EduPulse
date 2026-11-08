import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  PlusCircle,
  Radio,
  Globe,
  Info,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  Check,
  ClipboardList,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logout } from '../lib/firebase';
import { Language, translations } from '../lib/i18n';
import { ThemeMode } from '../types';

interface NavbarProps {
  currentTab: 'interview' | 'dashboard' | 'instruments';
  onSelectTab: (tab: 'interview' | 'dashboard' | 'instruments') => void;
  currentUser: User | null;
  onNewSession: () => void;
  onOpenThesisModal: () => void;
  activeSessionParticipant?: string;
  hasActiveSession: boolean;
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onSelectTheme: (mode: ThemeMode) => void;
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
  theme,
  onSelectTheme,
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f172a] text-slate-900 dark:text-white border-b border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-md backdrop-blur transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 h-16">
          {/* Institutional Brand: EduPulse & UniCórdoba */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-[#059669] flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-400/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Edu<span className="text-[#059669] dark:text-[#34d399]">Pulse</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                  Universidad de Córdoba
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block font-body">
                Licenciatura en Informática • Interacción Dialógica Mediada por IA
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Conversación, Historial, Cuestionarios) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            <button
              onClick={() => onSelectTab('interview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'interview'
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-white border border-emerald-200 dark:border-slate-700 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${hasActiveSession ? 'text-[#059669] dark:text-[#34d399] animate-pulse' : ''}`} />
              <span>{t.navChat}</span>
              {hasActiveSession && (
                <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {activeSessionParticipant || 'Activo'}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-white border border-emerald-200 dark:border-slate-700 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t.navDashboard}</span>
            </button>

            <button
              onClick={() => onSelectTab('instruments')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'instruments'
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-white border border-emerald-200 dark:border-slate-700 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t.navInstruments}</span>
            </button>
          </nav>

          {/* Controls: Theme Switcher, Language, Thesis Info, New Session, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 pl-2 sm:pl-3 lg:pl-4 border-l border-slate-200 dark:border-slate-800">
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                title={
                  theme === 'light'
                    ? t.themeLight
                    : theme === 'dark'
                    ? t.themeDark
                    : t.themeSystem
                }
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
              >
                {theme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
                {theme === 'dark' && <Moon className="h-4 w-4 text-sky-400" />}
                {theme === 'system' && <Monitor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs font-medium">
                  <button
                    onClick={() => {
                      onSelectTheme('light');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                      theme === 'light' ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="h-3.5 w-3.5 text-amber-500" />
                      <span>{t.themeLight}</span>
                    </div>
                    {theme === 'light' && <Check className="h-3.5 w-3.5 text-amber-500" />}
                  </button>

                  <button
                    onClick={() => {
                      onSelectTheme('dark');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                      theme === 'dark' ? 'text-sky-600 dark:text-sky-300 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="h-3.5 w-3.5 text-sky-400" />
                      <span>{t.themeDark}</span>
                    </div>
                    {theme === 'dark' && <Check className="h-3.5 w-3.5 text-sky-400" />}
                  </button>

                  <button
                    onClick={() => {
                      onSelectTheme('system');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                      theme === 'system' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.themeSystem}</span>
                    </div>
                    {theme === 'system' && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Language Toggle (ES / EN) */}
            <button
              onClick={onToggleLanguage}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Thesis Project Info Modal Trigger */}
            <button
              onClick={onOpenThesisModal}
              title={t.navInfo}
              className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            >
              <Info className="h-4 w-4" />
            </button>

            {/* New Session Button */}
            <button
              onClick={onNewSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#059669] hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.newChat}</span>
            </button>

            {/* Google Authentication */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Investigador'}
                    className="h-8 w-8 rounded-full border border-emerald-400/50 shadow-2xs"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  title={t.signOut}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
              >
                <LogIn className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">{t.signInGoogle}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
