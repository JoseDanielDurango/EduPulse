import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Trash2,
  FileSpreadsheet,
  ArrowRight,
  Radio,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { InterviewSession } from '../types';
import { removeSession } from '../lib/firebase';
import { Language, translations } from '../lib/i18n';

interface SessionsDashboardProps {
  sessions: InterviewSession[];
  onOpenSession: (session: InterviewSession) => void;
  onViewSummary: (session: InterviewSession) => void;
  onNewSession: () => void;
  language: Language;
}

export const SessionsDashboard: React.FC<SessionsDashboardProps> = ({
  sessions,
  onOpenSession,
  onViewSummary,
  onNewSession,
  language,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = sessions.filter((s) => {
    const matchesSearch =
      (s.participantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.guideTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.centerLocation || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const exportedSheetsCount = sessions.filter((s) => !!s.exportedSheetUrl).length;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(language === 'en' ? 'Delete this conversation?' : '¿Eliminar esta conversación?')) {
      await removeSession(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            <span className="aero-gradient-text">{t.dashTitle}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-cyan-200/70 font-medium">
            {t.dashSubtitle}
          </p>
        </div>
        <button
          onClick={onNewSession}
          className="btn-aero-green inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm text-white shadow-md transition active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <span>{t.dashNewBtn}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="aero-card rounded-3xl p-4 sm:p-5 shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-600 dark:text-cyan-200/80 text-xs font-bold">
            <span>{t.dashTotal}</span>
            <div className="h-7 w-7 rounded-xl bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shadow-2xs">
              <MessageCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{sessions.length}</div>
        </div>

        <div className="aero-card rounded-3xl p-4 sm:p-5 shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-600 dark:text-cyan-200/80 text-xs font-bold">
            <span>{t.dashActive}</span>
            <div className="h-7 w-7 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{activeCount}</div>
        </div>

        <div className="aero-card rounded-3xl p-4 sm:p-5 shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-600 dark:text-cyan-200/80 text-xs font-bold">
            <span>{t.dashCompleted}</span>
            <div className="h-7 w-7 rounded-xl bg-blue-100/70 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{completedCount}</div>
        </div>

        <div className="aero-card rounded-3xl p-4 sm:p-5 shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-600 dark:text-cyan-200/80 text-xs font-bold">
            <span>{t.dashSheets}</span>
            <div className="h-7 w-7 rounded-xl bg-teal-100/70 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shadow-2xs">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-cyan-300 mt-2">{exportedSheetsCount}</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="aero-glass rounded-3xl p-4 shadow-md border border-white/90 dark:border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cyan-300" />
          <input
            type="text"
            placeholder={t.dashSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-cyan-200/70 dark:border-cyan-800/70 focus:outline-hidden focus:ring-4 focus:ring-cyan-400/20 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {(['all', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition cursor-pointer shadow-2xs ${
                statusFilter === status
                  ? 'btn-aero-green text-white'
                  : 'btn-aero-glass text-slate-700 dark:text-slate-200'
              }`}
            >
              {status === 'all' ? (language === 'en' ? 'All' : 'Todas') : status === 'active' ? t.statusActive : t.statusCompleted}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="aero-card rounded-3xl p-12 text-center shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="h-14 w-14 rounded-2xl bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-300 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{t.dashEmptyTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-cyan-200/70 max-w-md mx-auto mt-1 mb-4">
            {t.dashEmptyDesc}
          </p>
          <button
            onClick={onNewSession}
            className="btn-aero-green inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold text-white transition cursor-pointer shadow-md"
          >
            {t.dashNewBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const isCompleted = s.status === 'completed';
            const progress = Math.min(
              100,
              Math.round(((s.currentQuestionIndex || 0) / (s.totalQuestions || 5)) * 100)
            );

            return (
              <div
                key={s.id}
                onClick={() => (isCompleted ? onViewSummary(s) : onOpenSession(s))}
                className="aero-card rounded-3xl p-5 shadow-sm border border-white/90 dark:border-cyan-500/30 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                        isCompleted
                          ? 'bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                          : 'bg-white/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {!isCompleted && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />}
                      {isCompleted ? t.statusCompleted : t.statusActive}
                    </span>

                    <span className="text-[11px] text-slate-400 dark:text-cyan-300/60 font-mono">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-cyan-300 transition font-display">
                    {s.participantName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-cyan-200/70 font-semibold mt-0.5">
                    {s.semester ? <span className="text-emerald-700 dark:text-emerald-400">{s.semester}</span> : null}
                    {s.semester ? ' • ' : ''}
                    {language === 'en' ? 'Computer Science & Media Ed.' : 'Lic. en Informática'}
                  </p>

                  <div className="mt-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-cyan-100 dark:border-cyan-900/40 text-xs backdrop-blur-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{s.guideTitle}</span>
                  </div>

                  {/* Progress status */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-cyan-200/60 font-bold mb-1">
                      <span>{isCompleted ? '100%' : `${progress}%`}</span>
                    </div>
                    <div className="w-full bg-cyan-100/50 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-cyan-200/50 dark:border-cyan-800/40">
                      <div
                        className="aero-progress-bar h-full rounded-full transition-all"
                        style={{ width: `${isCompleted ? 100 : progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-cyan-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.exportedSheetUrl ? (
                      <a
                        href={s.exportedSheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Google Sheets"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 dark:text-emerald-300 bg-white/80 dark:bg-emerald-950 hover:bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 transition shadow-2xs"
                      >
                        <FileSpreadsheet className="h-3 w-3" />
                        <span>Sheet</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-cyan-200/40 italic">
                        {t.statusNotExported}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(s.id, e)}
                      title={t.dashDelete}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => (isCompleted ? onViewSummary(s) : onOpenSession(s))}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-cyan-300 hover:text-emerald-900 dark:hover:text-cyan-200 p-1 cursor-pointer"
                    >
                      <span>{isCompleted ? t.dashBtnView : t.dashBtnContinue}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
