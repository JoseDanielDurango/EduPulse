import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Table as TableIcon,
  Code2,
  FileText,
  ArrowLeft,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { InterviewSession, InterviewSummary } from '../types';
import {
  exportSessionToGoogleSheets,
  downloadSessionAsCSV,
  downloadSessionAsJSON,
} from '../lib/sheetsExport';
import { saveSession } from '../lib/firebase';
import { Language, translations } from '../lib/i18n';

interface SummaryViewProps {
  session: InterviewSession;
  onBackToInterview: () => void;
  onUpdateSession: (session: InterviewSession) => void;
  language: Language;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  session,
  onBackToInterview,
  onUpdateSession,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'table' | 'json' | 'transcript'>('table');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportedUrl, setExportedUrl] = useState<string | null>(session.exportedSheetUrl || null);
  const [hasCopied, setHasCopied] = useState(false);

  const summary: InterviewSummary = session.summary || {
    overview: language === 'en' ? 'Conversation reflections are being analyzed.' : 'Las reflexiones de la conversación están siendo analizadas.',
    keyThemes: [],
    actionableInsights: [],
    overallSentiment: 'neutral / mixed',
    participantPersonaInsight: '',
  };

  const responses = session.structuredResponses || [];

  const handleExportGoogleSheets = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const result = await exportSessionToGoogleSheets(session, undefined, language);
      setExportedUrl(result.spreadsheetUrl);

      const updated = {
        ...session,
        exportedSheetUrl: result.spreadsheetUrl,
        exportedSheetId: result.spreadsheetId,
      };
      onUpdateSession(updated);
      await saveSession(updated);
    } catch (err: any) {
      console.error('Export error:', err);
      setExportError(err.message || 'Error exporting to Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyJSON = () => {
    const rawJson = JSON.stringify(
      {
        sessionTitle: session.title,
        participant: session.participantName,
        role: session.participantRole,
        overview: session.summary,
        table: session.structuredResponses,
      },
      null,
      2
    );
    navigator.clipboard.writeText(rawJson);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation & Action Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToInterview}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.summaryBack}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.summaryTitle}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {session.participantName} • {session.guideTitle} • {session.messages.length} exchanges
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportGoogleSheets}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition active:scale-95 disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExporting ? t.summaryExporting : t.summaryExportSheets}</span>
          </button>

          <button
            onClick={() => downloadSessionAsCSV(session)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.summaryDownloadCSV}</span>
          </button>

          <button
            onClick={() => downloadSessionAsJSON(session)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition shadow-2xs"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{t.summaryDownloadJSON}</span>
          </button>
        </div>
      </div>

      {/* Export Notice / Direct Google Sheet Link Banner */}
      {exportedUrl && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 animate-fade-in shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{t.summaryExportedNotice}</h4>
            </div>
          </div>
          <a
            href={exportedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition shadow-xs whitespace-nowrap"
          >
            <span>{t.summaryOpenSheets}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {exportError && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 text-rose-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{exportError}</span>
          </div>
          <button
            onClick={handleExportGoogleSheets}
            className="underline font-semibold hover:text-rose-700 text-xs shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.overviewTitle}
              </h2>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {summary.overview}
            </p>
          </div>

          {summary.keyThemes && summary.keyThemes.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t.themesTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {summary.keyThemes.map((theme: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-700 mb-3">
            <TrendingUp className="h-4 w-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.recommendationsTitle}
            </h2>
          </div>

          <div className="space-y-3">
            {(summary.actionableInsights || []).map((insight: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 pt-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 transition ${
                activeTab === 'table'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="h-4 w-4" />
              <span>{t.tabTable} ({responses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 transition ${
                activeTab === 'json'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>{t.tabJson}</span>
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 transition ${
                activeTab === 'transcript'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{t.tabTranscript} ({session.messages.length})</span>
            </button>
          </div>

          {activeTab === 'json' && (
            <button
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{hasCopied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Table */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            {responses.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No items generated yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-48">{t.colTopic}</th>
                    <th className="py-3 px-4 min-w-[200px]">{t.colSynthesis}</th>
                    <th className="py-3 px-4 min-w-[180px]">{t.colDetails}</th>
                    <th className="py-3 px-4 min-w-[160px]">{t.colFriction}</th>
                    <th className="py-3 px-4 min-w-[200px]">{t.colQuotes}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {responses.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        {item.topicIndex || idx + 1}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900 text-xs mb-0.5">{item.topic}</div>
                        <div className="text-slate-500 text-[11px] italic">{item.coreQuestion}</div>
                      </td>
                      <td className="py-4 px-4 align-top leading-relaxed text-slate-800">
                        {item.participantAnswerSummary}
                      </td>
                      <td className="py-4 px-4 align-top">
                        {item.clarifyingNotes && item.clarifyingNotes.length > 0 ? (
                          <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600">
                            {item.clarifyingNotes.map((note, nIdx) => (
                              <li key={nIdx} className="leading-snug">{note}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400 italic text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top">
                        {item.painPointsOrNeeds && item.painPointsOrNeeds.length > 0 ? (
                          <div className="space-y-1">
                            {item.painPointsOrNeeds.map((pain, pIdx) => (
                              <div
                                key={pIdx}
                                className="inline-block px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium mr-1 mb-1"
                              >
                                {pain}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 align-top space-y-2">
                        {item.directQuotes && item.directQuotes.length > 0 ? (
                          <div className="space-y-1.5 text-xs italic text-indigo-950 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                            {item.directQuotes.map((q, qIdx) => (
                              <p key={qIdx} className="leading-snug">"{q}"</p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: JSON */}
        {activeTab === 'json' && (
          <div className="p-4 bg-slate-900 text-slate-100 overflow-x-auto font-mono text-xs">
            <pre className="leading-relaxed">
              {JSON.stringify(
                {
                  title: session.title,
                  participant: session.participantName,
                  summary: session.summary,
                  responses: session.structuredResponses,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Tab 3: Transcript */}
        {activeTab === 'transcript' && (
          <div className="p-6 space-y-3.5 max-h-[550px] overflow-y-auto">
            {session.messages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                  m.sender === 'agent'
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-xs font-bold">
                  <span>{m.sender === 'agent' ? 'Maya' : session.participantName}</span>
                  <span className="text-slate-400 font-normal text-[10px]">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
