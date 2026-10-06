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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.dashTitle}
          </h1>
          <p className="text-sm text-slate-500">
            {t.dashSubtitle}
          </p>
        </div>
        <button
          onClick={onNewSession}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <span>{t.dashNewBtn}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.dashTotal}</span>
            <MessageCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{sessions.length}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.dashActive}</span>
            <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{activeCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.dashCompleted}</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{completedCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.dashSheets}</span>
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{exportedSheetsCount}</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.dashSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          {(['all', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === status
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'all' ? (language === 'en' ? 'All' : 'Todas') : status === 'active' ? t.statusActive : t.statusCompleted}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">{t.dashEmptyTitle}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {t.dashEmptyDesc}
          </p>
          <button
            onClick={onNewSession}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
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
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {!isCompleted && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {isCompleted ? t.statusCompleted : t.statusActive}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                    {s.participantName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {s.semester ? <span className="font-semibold text-emerald-700">{s.semester}</span> : null}
                    {s.semester ? ' • ' : ''}
                    {language === 'en' ? 'Computer Science & Media Ed.' : 'Lic. en Informática y Medios'}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800 line-clamp-1">{s.guideTitle}</span>
                  </div>

                  {/* Progress status */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>{isCompleted ? '100%' : `${progress}%`}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${isCompleted ? 100 : progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.exportedSheetUrl ? (
                      <a
                        href={s.exportedSheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Google Sheets"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200 transition"
                      >
                        <FileSpreadsheet className="h-3 w-3" />
                        <span>Sheet</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {s.messages.length} msgs
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(s.id, e)}
                      title="Delete"
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition">
                      {isCompleted ? (language === 'en' ? 'Summary' : 'Resumen') : (language === 'en' ? 'Open' : 'Entrar')}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
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
