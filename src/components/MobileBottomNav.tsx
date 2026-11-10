import React from 'react';
import {
  MessageCircle,
  Radio,
  ClipboardList,
  LayoutDashboard,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface MobileBottomNavProps {
  currentTab: 'interview' | 'dashboard' | 'instruments';
  onSelectTab: (tab: 'interview' | 'dashboard' | 'instruments') => void;
  isAdmin: boolean;
  onOpenThesisModal: () => void;
  hasActiveSession: boolean;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  isAdmin,
  onOpenThesisModal,
  hasActiveSession,
  language,
}) => {
  const t = translations[language];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 aero-glass border-t border-white/80 dark:border-cyan-500/20 shadow-2xl backdrop-blur-2xl pb-safe transition-all duration-200"
    >
      <div className="flex items-center justify-around h-15 px-2">
        {/* Tab 1: Conversación / Chat con Cereza */}
        <button
          onClick={() => onSelectTab('interview')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition cursor-pointer relative ${
            currentTab === 'interview'
              ? 'text-emerald-700 dark:text-cyan-300 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Radio
              className={`h-5 w-5 transition-transform ${
                currentTab === 'interview' ? 'scale-110' : ''
              } ${hasActiveSession ? 'text-emerald-500 dark:text-cyan-400 animate-pulse' : ''}`}
            />
            {hasActiveSession && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-ping" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
            {t.navChat}
          </span>
          {currentTab === 'interview' && (
            <span className="absolute bottom-0.5 h-1 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-xs" />
          )}
        </button>

        {/* Tab 2: Cuestionarios / Instrumentos */}
        <button
          onClick={() => onSelectTab('instruments')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition cursor-pointer relative ${
            currentTab === 'instruments'
              ? 'text-emerald-700 dark:text-cyan-300 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList
            className={`h-5 w-5 transition-transform ${
              currentTab === 'instruments' ? 'scale-110' : ''
            }`}
          />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[75px]">
            {language === 'en' ? 'Surveys' : 'Cuestionarios'}
          </span>
          {currentTab === 'instruments' && (
            <span className="absolute bottom-0.5 h-1 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-xs" />
          )}
        </button>

        {/* Tab 3: Historial (Only for Authorized Researchers / Admins) */}
        {isAdmin && (
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition cursor-pointer relative ${
              currentTab === 'dashboard'
                ? 'text-emerald-700 dark:text-cyan-300 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard
              className={`h-5 w-5 transition-transform ${
                currentTab === 'dashboard' ? 'scale-110' : ''
              }`}
            />
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
              {t.navDashboard}
            </span>
            {currentTab === 'dashboard' && (
              <span className="absolute bottom-0.5 h-1 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-xs" />
            )}
          </button>
        )}

        {/* Tab 4: Ficha de Tesis / Información */}
        <button
          onClick={onOpenThesisModal}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition cursor-pointer text-slate-500 dark:text-slate-400 font-medium hover:text-emerald-700 dark:hover:text-cyan-300"
        >
          <GraduationCap className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
            {language === 'en' ? 'Project' : 'Proyecto'}
          </span>
        </button>
      </div>
    </nav>
  );
};
