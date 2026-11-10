import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  PlusCircle,
  Radio,
  Globe,
  Info,
  Sun,
  Moon,
  Monitor,
  Check,
  ClipboardList,
  ShieldCheck,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logout } from '../lib/firebase';
import { lockResearcherPin } from '../lib/adminAuth';
import { Language, translations } from '../lib/i18n';
import { ThemeMode } from '../types';

interface NavbarProps {
  currentTab: 'interview' | 'dashboard' | 'instruments';
  onSelectTab: (tab: 'interview' | 'dashboard' | 'instruments') => void;
  currentUser: User | null;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLockAdmin: () => void;
  onNewSession: () => void;
  onOpenThesisModal: () => void;
  activeSessionParticipant?: string;
  hasActiveSession: boolean;
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onSelectTheme: (mode: ThemeMode) => void;
  canGoBack?: boolean;
  onGoBack?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isAdmin,
  onOpenAdminModal,
  onLockAdmin,
  onNewSession,
  onOpenThesisModal,
  activeSessionParticipant,
  hasActiveSession,
  language,
  onToggleLanguage,
  theme,
  onSelectTheme,
  canGoBack = false,
  onGoBack,
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
    <header className="sticky top-0 z-40 aero-glass border-b border-white/80 dark:border-cyan-500/20 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 h-14 md:h-16 w-full">
          {/* Institutional Brand: EduPulse & UniCórdoba */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {canGoBack && onGoBack && (
              <button
                onClick={onGoBack}
                title={language === 'en' ? 'Go back' : 'Volver'}
                className="btn-aero-glass h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-cyan-300 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
                aria-label={language === 'en' ? 'Go back' : 'Volver'}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-b from-white/90 via-cyan-50/80 to-emerald-100/90 dark:from-slate-900/90 dark:via-cyan-950/80 dark:to-emerald-950/90 p-1 flex items-center justify-center shadow-md ring-2 ring-white/80 dark:ring-cyan-400/50 relative overflow-hidden group cursor-pointer backdrop-blur-xs shrink-0">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
              <img
                src="/umbran-watch-icon.png"
                alt="Umbran Watch Symbol"
                className="h-full w-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-xs"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white shrink-0">
                  Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">Pulse</span>
                </span>
                <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/80 shadow-2xs backdrop-blur-xs shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-sm"></span>
                  {language === 'en' ? 'University of Córdoba' : 'Universidad de Córdoba'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-cyan-200/70 hidden 2xl:block font-body truncate">
                {language === 'en'
                  ? 'Bachelor in Computer Science • AI-Mediated Dialogic Interaction'
                  : 'Licenciatura en Informática • Interacción Dialógica Mediada por IA'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop only - 1024px+; on mobile/tablets rendered via MobileBottomNav) */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            <button
              onClick={() => onSelectTab('interview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-all cursor-pointer ${
                currentTab === 'interview'
                  ? 'btn-aero-green font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-cyan-300 hover:bg-white/60 dark:hover:bg-slate-800/60 font-semibold'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${hasActiveSession ? 'text-white animate-pulse' : ''}`} />
              <span>{t.navChat}</span>
              {hasActiveSession && (
                <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/30 text-white border border-white/40">
                  {activeSessionParticipant || (language === 'en' ? 'Active' : 'Activo')}
                </span>
              )}
            </button>

            {/* Historial Tab (Only visible for Authorized Researchers / Admins) */}
            {isAdmin && (
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'btn-aero-green font-bold shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-cyan-300 hover:bg-white/60 dark:hover:bg-slate-800/60 font-semibold'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>{t.navDashboard}</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('instruments')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-all cursor-pointer ${
                currentTab === 'instruments'
                  ? 'btn-aero-green font-bold shadow-sm'
                  : 'text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-cyan-300 hover:bg-white/60 dark:hover:bg-slate-800/60 font-semibold'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>{t.navInstruments}</span>
            </button>
          </nav>

          {/* Controls: Theme Switcher, Language, Thesis Info, New Session, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 pl-2 sm:pl-3 lg:pl-4 border-l border-cyan-200/80 dark:border-cyan-800/50">
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
                className="btn-aero-glass inline-flex items-center justify-center h-8 w-8 rounded-full cursor-pointer shadow-xs"
              >
                {theme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
                {theme === 'dark' && <Moon className="h-4 w-4 text-sky-400" />}
                {theme === 'system' && <Monitor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              </button>

              {/* Theme Dropdown Menu */}
              {isThemeMenuOpen && (
                <div 
                  className="absolute left-0 top-full mt-2 w-48 rounded-2xl aero-glass border border-white/90 dark:border-cyan-500/40 shadow-2xl p-1.5 z-50 text-xs font-medium backdrop-blur-2xl"
                  style={{ position: 'absolute' }}
                >
                  <button
                    onClick={() => {
                      onSelectTheme('light');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/60 dark:hover:bg-slate-800/60 transition cursor-pointer ${
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
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/60 dark:hover:bg-slate-800/60 transition cursor-pointer ${
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
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-white/60 dark:hover:bg-slate-800/60 transition cursor-pointer ${
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
              className="btn-aero-glass inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Thesis Project Info Modal Trigger */}
            <button
              onClick={onOpenThesisModal}
              title={t.navInfo}
              className="btn-aero-glass hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-600 dark:text-slate-300 transition cursor-pointer shadow-xs"
            >
              <Info className="h-4 w-4 text-emerald-600 dark:text-cyan-400" />
            </button>

            {/* New Session Button */}
            <button
              onClick={onNewSession}
              title={t.newChat}
              className="btn-aero-cyan inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer shrink-0"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{t.newChat}</span>
            </button>

            {/* Researcher Access / Authentication */}
            {isAdmin ? (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div
                  title={currentUser?.email ? `Investigador: ${currentUser.email}` : 'Investigador Autorizado (PIN)'}
                  className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/80 shadow-2xs backdrop-blur-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'en' ? 'Researcher' : 'Investigador'}</span>
                </div>

                {currentUser ? (
                  currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Investigador'}
                      title={currentUser.email || undefined}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-emerald-400/80 shadow-md shrink-0"
                    />
                  ) : (
                    <div
                      title={currentUser.email || undefined}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300 shrink-0"
                    >
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )
                ) : (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-400/40 shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                )}

                <button
                  onClick={async () => {
                    await handleLogout();
                    onLockAdmin();
                  }}
                  title={language === 'en' ? 'Lock / Sign Out' : 'Cerrar sesión de Investigador'}
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="btn-aero-glass inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs hover:border-emerald-400 shrink-0"
                title={language === 'en' ? 'Unlock researcher tools' : 'Acceso exclusivo a investigadores'}
              >
                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-400" />
                <span className="hidden xl:inline">
                  {language === 'en' ? 'Researcher Access' : 'Acceso Investigador'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
