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
import { GuidesManager } from './components/GuidesManager';
import { NewSessionModal } from './components/NewSessionModal';
import { ThesisProjectModal } from './components/ThesisProjectModal';
import {
  observeAuth,
  subscribeToSessions,
  subscribeToGuides,
  saveSession,
} from './lib/firebase';
import { DEFAULT_GUIDES } from './lib/defaultGuides';
import { THESIS_PROJECT_INFO } from './lib/thesisContext';
import { InterviewGuide, InterviewSession } from './types';
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
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'interview' | 'dashboard' | 'guides'>('interview');
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [guides, setGuides] = useState<InterviewGuide[]>(DEFAULT_GUIDES);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [viewingSummarySession, setViewingSummarySession] = useState<InterviewSession | null>(null);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);
  const [selectedGuideForNewSession, setSelectedGuideForNewSession] = useState<string | undefined>();

  // Language state (persisted in localStorage)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('edupulse_lang');
    return (saved === 'en' || saved === 'es') ? (saved as Language) : 'es';
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === 'es' ? 'en' : 'es';
      localStorage.setItem('edupulse_lang', next);
      return next;
    });
  };

  const t = translations[language];

  // Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubscribeAuth = observeAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Firestore Real-time Sessions
  useEffect(() => {
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
  }, [activeSession?.id]);

  // Subscribe to Firestore Guides
  useEffect(() => {
    const unsubscribeGuides = subscribeToGuides((updatedGuides) => {
      if (updatedGuides && updatedGuides.length > 0) {
        setGuides(updatedGuides);
      }
    });
    return () => unsubscribeGuides();
  }, []);

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

  const currentGuide = guides.find((g) => g.id === activeSession?.guideId) || guides[0] || DEFAULT_GUIDES[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'interview') {
            setViewingSummarySession(null);
          }
        }}
        currentUser={currentUser}
        onNewSession={() => {
          setSelectedGuideForNewSession(undefined);
          setIsNewSessionModalOpen(true);
        }}
        onOpenThesisModal={() => setIsThesisModalOpen(true)}
        activeSessionParticipant={activeSession?.studentCode || activeSession?.participantName}
        hasActiveSession={!!activeSession && activeSession.status === 'active'}
        language={language}
        onToggleLanguage={handleToggleLanguage}
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
              /* Friendly, Modern Conversational Landing */
              <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16 text-center space-y-12">
                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-900 border border-emerald-300 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                  <span>{t.heroBadge}</span>
                </div>

                {/* Hero Title & Subtitle */}
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {t.heroTitlePrefix}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                      {t.heroTitleGradient}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {t.heroSubtitle}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => {
                      setSelectedGuideForNewSession(undefined);
                      setIsNewSessionModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{t.heroStartBtn}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('guides')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 shadow-2xs transition cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>{t.heroTopicsBtn}</span>
                  </button>

                  <button
                    onClick={() => setIsThesisModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl font-semibold text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    title={t.navInfo}
                  >
                    <Info className="h-4 w-4 text-slate-400" />
                    <span>{t.navInfo}</span>
                  </button>
                </div>

                {/* 3 Friendly Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left pt-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-emerald-200 transition">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {t.prop1Title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t.prop1Desc}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-emerald-200 transition">
                    <div className="h-10 w-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {t.prop2Title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t.prop2Desc}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-emerald-200 transition">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {t.prop3Title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {t.prop3Desc}
                    </p>
                  </div>
                </div>

                {/* Recent Dialogues (if any exist) */}
                {sessions.length > 0 && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left shadow-2xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                          {t.heroRecentChats}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {sessions.length} {language === 'en' ? 'recorded dialogues' : 'conversaciones registradas'}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('dashboard')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                      >
                        {t.heroViewAll} →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {sessions.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          onClick={() =>
                            s.status === 'completed'
                              ? handleViewSummary(s)
                              : handleOpenExistingSession(s)
                          }
                          className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                              {(s.participantName || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900">
                                {s.participantName}
                              </span>
                              <span className="text-xs text-slate-400 ml-2">
                                • {s.guideTitle || 'Tema general'}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                            <span>{s.status === 'completed' ? (language === 'en' ? 'View takeaways' : 'Ver reflexiones') : (language === 'en' ? 'Resume chat' : 'Continuar charla')}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtle, Professional Research Footer */}
                <div className="pt-8 border-t border-slate-200/80 text-center space-y-2 text-xs text-slate-500 max-w-xl mx-auto">
                  <p className="font-medium text-slate-600">
                    {t.footerContext}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {t.footerInstitutional} • {t.footerResearchers} {THESIS_PROJECT_INFO.authors.join(' & ')}
                  </p>
                  <button
                    onClick={() => setIsThesisModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline pt-1 cursor-pointer"
                  >
                    <GraduationCap className="h-3 w-3" />
                    <span>{t.footerAboutBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {currentTab === 'dashboard' && (
          <SessionsDashboard
            sessions={sessions}
            onOpenSession={handleOpenExistingSession}
            onViewSummary={handleViewSummary}
            onNewSession={() => {
              setSelectedGuideForNewSession(undefined);
              setIsNewSessionModalOpen(true);
            }}
            language={language}
          />
        )}

        {currentTab === 'guides' && (
          <GuidesManager
            guides={guides}
            onSelectGuideForSession={(guide) => {
              setSelectedGuideForNewSession(guide.id);
              setIsNewSessionModalOpen(true);
            }}
            language={language}
          />
        )}
      </main>

      {/* New Qualitative Session Modal */}
      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        guides={guides}
        defaultGuideId={selectedGuideForNewSession}
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
    </div>
  );
}
