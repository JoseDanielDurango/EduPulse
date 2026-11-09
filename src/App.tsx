/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { InterviewRoom } from './components/InterviewRoom';
import { SummaryView } from './components/SummaryView';
import { SessionsDashboard } from './components/SessionsDashboard';
import { NewSessionModal } from './components/NewSessionModal';
import { ThesisProjectModal } from './components/ThesisProjectModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { InstrumentsView } from './components/instruments/InstrumentsView';
import {
  isUserAdmin,
  isPinUnlocked,
  lockResearcherPin,
} from './lib/adminAuth';
import {
  observeAuth,
  subscribeToSessions,
  subscribeToGuides,
  saveSession,
  subscribeToInstrumentResponses,
} from './lib/firebase';
import { DEFAULT_GUIDES } from './lib/defaultGuides';
import { THESIS_PROJECT_INFO } from './lib/thesisContext';
import { InterviewGuide, InterviewSession, ThemeMode } from './types';
import { InstrumentResponse } from './types/instruments';
import { Language, translations } from './lib/i18n';
import {
  Play,
  FileSpreadsheet,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  MessageCircle,
  GraduationCap,
  Info,
  ChevronRight,
  Clock,
  ClipboardList,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'instruments'>('interview');
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [guides, setGuides] = useState<InterviewGuide[]>(DEFAULT_GUIDES);
  const [instrumentResponses, setInstrumentResponses] = useState<InstrumentResponse[]>([]);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [viewingSummarySession, setViewingSummarySession] = useState<InterviewSession | null>(null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isPinAuthorized, setIsPinAuthorized] = useState<boolean>(() => isPinUnlocked());

  // Researcher / Admin Authorization Check
  const isAdmin = isUserAdmin(currentUser) || isPinAuthorized;

  // Language state (persisted in localStorage)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('edupulse_lang');
    return (saved === 'en' || saved === 'es') ? (saved as Language) : 'es';
  });

  // Theme state: light, dark, or system (persisted in localStorage)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('edupulse_theme');
    return (saved === 'light' || saved === 'dark' || saved === 'system') ? (saved as ThemeMode) : 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('edupulse_theme', theme);

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === 'es' ? 'en' : 'es';
      localStorage.setItem('edupulse_lang', next);
      return next;
    });
  };

  const t = translations[language];

  // Protect dashboard tab from unauthorized access
  useEffect(() => {
    if (currentTab === 'dashboard' && !isAdmin) {
      setCurrentTab('interview');
    }
  }, [currentTab, isAdmin]);

  // Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubscribeAuth = observeAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Firestore Real-time Sessions (Strictly restricted to authorized researchers)
  useEffect(() => {
    if (!isAdmin) {
      setSessions([]);
      return;
    }

    const unsubscribeSessions = subscribeToSessions((updatedSessions) => {
      setSessions(updatedSessions);
      if (activeSession) {
        const found = updatedSessions.find((s) => s.id === activeSession.id);
        if (found && found.updatedAt !== activeSession.updatedAt) {
          setActiveSession(found);
        }
      }
    });

    return () => unsubscribeSessions();
  }, [isAdmin, activeSession?.id]);

  // Subscribe to Firestore Guides
  useEffect(() => {
    const unsubscribeGuides = subscribeToGuides((updatedGuides) => {
      if (updatedGuides && updatedGuides.length > 0) {
        setGuides(updatedGuides);
      }
    });
    return () => unsubscribeGuides();
  }, []);

  // Subscribe to Firestore & Offline Instrument Responses (Restricted to researchers)
  useEffect(() => {
    if (!isAdmin) {
      setInstrumentResponses([]);
      return;
    }

    const unsubscribeResponses = subscribeToInstrumentResponses((updatedResponses) => {
      setInstrumentResponses(updatedResponses);
    });
    return () => unsubscribeResponses();
  }, [isAdmin]);

  // Load last active session from localStorage
  useEffect(() => {
    if (!activeSession && sessions.length > 0) {
      const lastSessionId = localStorage.getItem('last_active_session_id');
      if (lastSessionId) {
        const found = sessions.find((s) => s.id === lastSessionId);
        if (found) {
          setActiveSession(found);
        }
      }
    }
  }, [sessions]);

  const handleStartNewSession = (newSession: InterviewSession, _guide: InterviewGuide) => {
    setActiveSession(newSession);
    setViewingSummarySession(null);
    setCurrentTab('interview');
    localStorage.setItem('last_active_session_id', newSession.id);
    saveSession(newSession);
  };

  const handleOpenExistingSession = (session: InterviewSession) => {
    setActiveSession(session);
    setViewingSummarySession(null);
    setCurrentTab('interview');
    localStorage.setItem('last_active_session_id', session.id);
  };

  const handleViewSummary = (session: InterviewSession) => {
    setViewingSummarySession(session);
    setCurrentTab('interview');
  };

  const handleUpdateSession = (updated: InterviewSession) => {
    setActiveSession(updated);
    if (viewingSummarySession?.id === updated.id) {
      setViewingSummarySession(updated);
    }
  };

  const handleFinishSession = (completedSession: InterviewSession) => {
    setActiveSession(completedSession);
    setViewingSummarySession(completedSession);
  };

  const currentGuide = guides[0] || DEFAULT_GUIDES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-200">
      {/* Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'dashboard' && !isAdmin) return;
          setCurrentTab(tab);
          if (tab !== 'interview') {
            setViewingSummarySession(null);
          }
        }}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminLoginModalOpen(true)}
        onLockAdmin={() => {
          lockResearcherPin();
          setIsPinAuthorized(false);
        }}
        onNewSession={() => {
          setIsNewSessionModalOpen(true);
        }}
        onOpenThesisModal={() => setIsThesisModalOpen(true)}
        activeSessionParticipant={activeSession?.studentCode || activeSession?.participantName}
        hasActiveSession={!!activeSession && activeSession.status === 'active'}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onSelectTheme={setTheme}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'interview' && (
          <>
            {viewingSummarySession ? (
              <SummaryView
                session={viewingSummarySession}
                onBackToInterview={() => setViewingSummarySession(null)}
                onUpdateSession={handleUpdateSession}
                language={language}
                isAdmin={isAdmin}
              />
            ) : activeSession ? (
              <InterviewRoom
                session={activeSession}
                guide={currentGuide}
                onUpdateSession={handleUpdateSession}
                onFinishSession={handleFinishSession}
                language={language}
              />
            ) : (
              /* Friendly, Modern Conversational Landing with Frutiger Aero Aesthetic */
              <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 text-center space-y-12 relative">
                {/* Decorative Ambient Floating Aero Bubbles */}
                <div
                  className="aero-bubble w-20 h-20 -top-6 -left-10 opacity-70 hidden md:block"
                  style={{ animationDelay: '0s', animationDuration: '7s' }}
                />
                <div
                  className="aero-bubble w-12 h-12 top-24 -right-8 opacity-60 hidden md:block"
                  style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}
                />
                <div
                  className="aero-bubble w-8 h-8 bottom-32 -left-6 opacity-50 hidden md:block"
                  style={{ animationDelay: '2.5s', animationDuration: '6.5s' }}
                />

                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-white/90 dark:border-emerald-600/40 shadow-sm backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-cyan-400 animate-pulse" />
                  <span>{t.heroBadge}</span>
                </div>

                {/* Hero Title & Subtitle */}
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {t.heroTitlePrefix}{' '}
                    <span className="aero-gradient-text drop-shadow-xs">
                      {t.heroTitleGradient}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 dark:text-cyan-100/80 max-w-2xl mx-auto leading-relaxed font-body">
                    {t.heroSubtitle}
                  </p>
                </div>

                {/* Primary Action Buttons (Glossy Frutiger Aero Pills) */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => {
                      setIsNewSessionModalOpen(true);
                    }}
                    className="btn-aero-green inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{t.heroStartBtn}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('instruments')}
                    className="btn-aero-cyan inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>{language === 'en' ? 'Questionnaires & Diagnostic' : 'Cuestionarios y Diagnóstico'}</span>
                  </button>

                  <button
                    onClick={() => setIsThesisModalOpen(true)}
                    className="btn-aero-glass inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-bold text-sm shadow-xs transition cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-emerald-600 dark:text-cyan-400" />
                    <span>{language === 'en' ? 'Research Project Info' : 'Ficha de Investigación'}</span>
                  </button>
                </div>

                {/* 3 Friendly Value Pillars in Aero Glass Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left pt-6">
                  <div className="aero-card p-6 rounded-3xl space-y-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-b from-emerald-300 via-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-md relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
                      <MessageCircle className="h-5 w-5 drop-shadow-xs" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      {t.prop1Title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-cyan-100/70 leading-relaxed font-body">
                      {t.prop1Desc}
                    </p>
                  </div>

                  <div className="aero-card p-6 rounded-3xl space-y-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-700 text-white flex items-center justify-center font-bold shadow-md relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
                      <FileSpreadsheet className="h-5 w-5 drop-shadow-xs" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      {t.prop2Title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-cyan-100/70 leading-relaxed font-body">
                      {t.prop2Desc}
                    </p>
                  </div>

                  <div className="aero-card p-6 rounded-3xl space-y-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-b from-teal-300 via-emerald-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
                      <ShieldCheck className="h-5 w-5 drop-shadow-xs" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      {t.prop3Title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-cyan-100/70 leading-relaxed font-body">
                      {t.prop3Desc}
                    </p>
                  </div>
                </div>

                {/* Recent Dialogues (Restricted strictly to Authorized Researchers) */}
                {isAdmin && sessions.length > 0 && (
                  <div className="aero-card p-6 rounded-3xl text-left">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-cyan-300/80">
                          {t.heroRecentChats}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-cyan-100/70">
                          {sessions.length} {language === 'en' ? 'recorded dialogues' : 'conversaciones registradas'}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('dashboard')}
                        className="text-xs font-bold text-emerald-700 dark:text-cyan-300 hover:underline transition cursor-pointer"
                      >
                        {t.heroViewAll} →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {sessions.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          onClick={() =>
                            s.status === 'completed'
                              ? handleViewSummary(s)
                              : handleOpenExistingSession(s)
                          }
                          className="py-3 flex items-center justify-between hover:bg-white/60 dark:hover:bg-slate-800/60 px-3 rounded-2xl cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-b from-emerald-300 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {(s.participantName || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {s.participantName}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-cyan-200/70 ml-2">
                                • {s.studentCode || 'EST'} ({s.semester || 'Licenciatura'})
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 dark:text-cyan-300 inline-flex items-center gap-1">
                            <span>
                              {s.status === 'completed'
                                ? language === 'en'
                                  ? 'View takeaways'
                                  : 'Ver reflexiones'
                                : language === 'en'
                                ? 'Resume chat'
                                : 'Continuar charla'}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtle, Professional Research Footer */}
                <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 text-center space-y-2 text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                  <p className="font-medium text-slate-600 dark:text-slate-300">
                    {t.footerContext}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-[11px]">
                    {t.footerInstitutional} • {t.footerResearchers} {THESIS_PROJECT_INFO.authors.join(' & ')} • Director: {THESIS_PROJECT_INFO.director}
                  </p>
                  <button
                    onClick={() => setIsThesisModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline pt-1 cursor-pointer"
                  >
                    <GraduationCap className="h-3 w-3" />
                    <span>{t.footerAboutBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {currentTab === 'dashboard' && isAdmin && (
          <SessionsDashboard
            sessions={sessions}
            onOpenSession={handleOpenExistingSession}
            onViewSummary={handleViewSummary}
            onNewSession={() => {
              setIsNewSessionModalOpen(true);
            }}
            language={language}
          />
        )}

        {currentTab === 'instruments' && (
          <InstrumentsView
            responses={instrumentResponses}
            language={language}
            onOpenThesisModal={() => setIsThesisModalOpen(true)}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {/* New Qualitative Session Modal */}
      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        guides={guides}
        onStartSession={handleStartNewSession}
        currentUserId={currentUser?.uid || 'anonymous'}
        currentUserEmail={currentUser?.email || undefined}
        existingSessionCount={sessions.length}
        language={language}
      />

      {/* Thesis Project Info Modal */}
      <ThesisProjectModal
        isOpen={isThesisModalOpen}
        onClose={() => setIsThesisModalOpen(false)}
        language={language}
      />

      {/* Researcher / Admin Login & Passcode Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onAdminStateChange={() => {
          setIsPinAuthorized(isPinUnlocked() || isUserAdmin(currentUser));
        }}
        language={language}
      />
    </div>
  );
}
