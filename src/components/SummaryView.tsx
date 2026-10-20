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
  GraduationCap,
  Quote,
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

  const participantCode = session.studentCode || `EST-${(session.participantName || '01').slice(0, 2).toUpperCase()}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-body">
      {/* Top Banner (Stitch Academic Pulse Navigation) */}
      <div className="elevation-card rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToInterview}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#059669] mb-2 transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.summaryBack}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              Matriz Cualitativa de Resultados
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]"></span>
              {participantCode} • {session.semester || 'Licenciatura'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Universidad de Córdoba • {session.guideTitle} • {session.messages.length} turnos de diálogo
          </p>
        </div>

        {/* Stitch Export Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportGoogleSheets}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#059669] hover:bg-[#047857] text-white shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{isExporting ? t.summaryExporting : t.summaryExportSheets}</span>
          </button>

          <button
            onClick={() => downloadSessionAsCSV(session)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#cbd5e1] text-[#0f172a] bg-white hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.summaryDownloadCSV}</span>
          </button>

          <button
            onClick={() => downloadSessionAsJSON(session)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#cbd5e1] text-[#0f172a] bg-white hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Code2 className="h-3.5 w-3.5 text-slate-500" />
            <span>{t.summaryDownloadJSON}</span>
          </button>
        </div>
      </div>

      {/* Export Notice / Direct Google Sheet Link Banner */}
      {exportedUrl && (
        <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#065f46] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{t.summaryExportedNotice}</h4>
              <p className="text-xs text-emerald-800">Sincronizado con Google Drive para análisis CAQDAS.</p>
            </div>
          </div>
          <a
            href={exportedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs transition shadow-xs whitespace-nowrap"
          >
            <span>{t.summaryOpenSheets}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {exportError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 text-xs flex items-center justify-between gap-3 font-body">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{exportError}</span>
          </div>
          <button
            onClick={handleExportGoogleSheets}
            className="underline font-semibold hover:text-rose-700 text-xs shrink-0 cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Analytical Cards (Stitch Academic Pulse Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 elevation-card rounded-xl p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[#059669] mb-2">
              <Sparkles className="h-4 w-4" />
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                {t.overviewTitle}
              </h2>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-body">
              {summary.overview}
            </p>
          </div>

          {summary.keyThemes && summary.keyThemes.length > 0 && (
            <div className="pt-3 border-t border-[#e2e8f0]">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                {t.themesTitle} (Códigos Emergentes)
              </h3>
              <div className="flex flex-wrap gap-2">
                {summary.keyThemes.map((theme: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f1f5f9] text-[#0f172a] border border-[#cbd5e1]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="elevation-card rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#0284c7] mb-3">
            <TrendingUp className="h-4 w-4" />
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#0f172a]">
              {t.recommendationsTitle}
            </h2>
          </div>

          <div className="space-y-3 font-body">
            {(summary.actionableInsights || []).map((insight: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="h-5 w-5 rounded-full bg-sky-100 text-[#0284c7] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs & Data Table */}
      <div className="elevation-card rounded-xl overflow-hidden">
        <div className="px-5 pt-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'table'
                  ? 'border-[#059669] text-[#059669]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="h-4 w-4" />
              <span>{t.tabTable} ({responses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'json'
                  ? 'border-[#059669] text-[#059669]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>{t.tabJson}</span>
            </button>

            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                activeTab === 'transcript'
                  ? 'border-[#059669] text-[#059669]'
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              {hasCopied ? <Check className="h-3.5 w-3.5 text-[#059669]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{hasCopied ? 'Copiado' : 'Copiar JSON'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Table with Stitch Reflexive Quotes */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            {responses.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aún no se han generado registros analíticos.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs sm:text-sm font-body">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-slate-600 font-semibold font-display">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-48">{t.colTopic}</th>
                    <th className="py-3 px-4 min-w-[200px]">{t.colSynthesis}</th>
                    <th className="py-3 px-4 min-w-[180px]">{t.colDetails}</th>
                    <th className="py-3 px-4 min-w-[160px]">{t.colFriction}</th>
                    <th className="py-3 px-4 min-w-[240px]">{t.colQuotes} (Citas Textuales)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] text-slate-700">
                  {responses.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        {item.topicIndex || idx + 1}
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-[#0f172a] text-xs mb-0.5">{item.topic}</div>
                        <div className="text-slate-500 text-[11px] italic">{item.coreQuestion}</div>
                      </td>
                      <td className="py-4 px-4 align-top leading-relaxed text-[#0f172a]">
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
                          <div className="space-y-2">
                            {item.directQuotes.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="bg-white p-2.5 rounded-lg border border-[#e2e8f0] border-l-4 border-l-[#0284c7] text-[#0f172a] shadow-xs text-xs quote-reflexive"
                              >
                                <p className="leading-snug italic font-normal">"{q}"</p>
                              </div>
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
          <div className="p-4 bg-[#0f172a] text-slate-100 overflow-x-auto font-mono text-xs">
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
          <div className="p-6 space-y-3.5 max-h-[550px] overflow-y-auto font-body">
            {session.messages.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                  m.sender === 'agent'
                    ? 'bg-[#f1f5f9] border-[#e2e8f0] text-[#1e293b]'
                    : 'bg-white border-[#e2e8f0] border-l-4 border-l-[#0284c7] text-[#0f172a]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs font-bold font-display">
                  <span>{m.sender === 'agent' ? 'Maya (Entrevistadora)' : `${session.participantName} [Cita]`}</span>
                  <span className="text-slate-400 font-normal text-[10px] font-mono">
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
