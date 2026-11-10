/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
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

      {/* Main View Area with Mobile Bottom Nav Clearance */}
      <main className="flex-1 pb-20 md:pb-6">
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
              /* Sleek, Modern, High-End Student Hub */
              <div className="max-w-3xl mx-auto px-4 py-6 sm:py-12 space-y-6 sm:space-y-8">
                {/* Hero Card: Cereza Welcome Card */}
                <div className="aero-card rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
                  <div className="flex flex-col items-center max-w-xl mx-auto space-y-4">
                    {/* Cereza Avatar with Luminous Ring */}
                    <div className="relative">
                      <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-teal-500 shadow-xl ring-4 ring-white/80 dark:ring-cyan-500/30 flex items-center justify-center">
                        <img
                          src="/cereza-avatar.png"
                          alt="Cereza"
                          className="h-full w-full object-contain rounded-full drop-shadow-sm"
                        />
                      </div>
                      <span className="absolute bottom-0 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      </span>
                    </div>

                    {/* Institutional Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-700/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Licenciatura en Informática • Universidad de Córdoba</span>
                    </div>

                    {/* Clean Title & Subtitle */}
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Diálogo Reflexivo con <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">Cereza</span>
                      </h1>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                        {language === 'en'
                          ? 'A guided qualitative dialogue on artificial intelligence, pedagogical practices, and ethics in teacher education.'
                          : 'Un espacio de conversación cualitativa guiada para explorar tus vivencias, prácticas pedagógicas y dilemas éticos con la IA en la Licenciatura.'}
                      </p>
                    </div>

                    {/* Single Prominent Primary Action */}
                    <div className="w-full sm:w-auto pt-2">
                      <button
                        onClick={() => {
                          setIsNewSessionModalOpen(true);
                        }}
                        className="btn-aero-green w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg transition active:scale-98 cursor-pointer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{t.heroStartBtn}</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secondary Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Card 1: Cuestionarios */}
                  <div
                    onClick={() => setCurrentTab('instruments')}
                    className="aero-card rounded-2xl p-5 flex items-start gap-3.5 cursor-pointer hover:border-emerald-400/60 transition group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-cyan-100/80 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {language === 'en' ? 'Diagnostic Questionnaires' : 'Cuestionarios y Diagnóstico'}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Complete the quantitative instruments on AI perceptions and didactic self-efficacy.'
                          : 'Diligencia los instrumentos estructurados sobre percepciones, usos y autoeficacia con IA.'}
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Ficha de Tesis */}
                  <div
                    onClick={() => setIsThesisModalOpen(true)}
                    className="aero-card rounded-2xl p-5 flex items-start gap-3.5 cursor-pointer hover:border-emerald-400/60 transition group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                          {language === 'en' ? 'Research Thesis Sheet' : 'Ficha de Investigación'}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-body leading-relaxed">
                        {language === 'en'
                          ? 'Objectives, researchers, academic director, and methodological framework.'
                          : 'Consulta los objetivos, investigadores responsables, director y marco del estudio.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic Confidentiality Footer Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 font-body text-center">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {language === 'en'
                      ? 'Voluntary participation under strict academic ethics and confidentiality.'
                      : 'Participación voluntaria y anónima bajo estricta confidencialidad investigativa.'}
                  </span>
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

      {/* Mobile Floating Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'dashboard' && !isAdmin) return;
          setCurrentTab(tab);
          if (tab !== 'interview') {
            setViewingSummarySession(null);
          }
        }}
        isAdmin={isAdmin}
        onOpenThesisModal={() => setIsThesisModalOpen(true)}
        hasActiveSession={!!activeSession && activeSession.status === 'active'}
        language={language}
      />

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
