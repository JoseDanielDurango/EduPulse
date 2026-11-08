import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Users,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Quote,
} from 'lucide-react';
import { InstrumentDefinition, InstrumentQuestion, InstrumentResponse } from '../../types/instruments';
import { removeInstrumentResponse } from '../../lib/firebase';
import { isOptionMatch, getLocalizedOptionLabel } from '../../lib/defaultInstruments';
import { Language } from '../../lib/i18n';

const formatCampusLabel = (campus: string, lang: Language) => {
  if (lang !== 'en') return campus;
  if (campus.includes('Central')) return 'Montería Central Campus';
  if (campus.includes('Berástegui')) return 'Berástegui Campus (Ciénaga de Oro)';
  if (campus.includes('Lorica')) return 'Lorica Campus';
  if (campus.includes('Sahagún')) return 'Sahagún Campus';
  if (campus.includes('Montelíbano')) return 'Montelíbano Campus';
  if (campus.includes('Planeta Rica')) return 'Planeta Rica Campus';
  if (campus.includes('Distancia')) return 'Distance Learning / Other';
  return campus;
};

interface InstrumentResponsesViewerProps {
  instrument: InstrumentDefinition;
  responses: InstrumentResponse[];
  onFillInstrument: () => void;
  language: Language;
}

export const InstrumentResponsesViewer: React.FC<InstrumentResponsesViewerProps> = ({
  instrument,
  responses,
  onFillInstrument,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'individual'>('summary');
  const [currentIndividualIndex, setCurrentIndividualIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedData, setCopiedData] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter responses specific to this instrument
  const instrumentResponses = useMemo(() => {
    return responses.filter((r) => r.instrumentId === instrument.id);
  }, [responses, instrument.id]);

  // Filtered by search query (for respondent names or campuses)
  const filteredResponses = useMemo(() => {
    if (!searchQuery.trim()) return instrumentResponses;
    const q = searchQuery.toLowerCase();
    return instrumentResponses.filter(
      (r) =>
        r.participantName?.toLowerCase().includes(q) ||
        r.centerLocation?.toLowerCase().includes(q) ||
        String(r.semester).includes(q) ||
        r.studentCode?.toLowerCase().includes(q)
    );
  }, [instrumentResponses, searchQuery]);

  // Clamp individual index when responses count changes
  const activeIndividualResponse = useMemo(() => {
    if (instrumentResponses.length === 0) return null;
    const validIndex = Math.min(
      Math.max(0, currentIndividualIndex),
      instrumentResponses.length - 1
    );
    return instrumentResponses[validIndex];
  }, [instrumentResponses, currentIndividualIndex]);

  // Aggregate metrics
  const stats = useMemo(() => {
    const total = instrumentResponses.length;
    if (total === 0) return { total: 0, avgAge: 0, semesters: {}, campuses: {} };

    let ageSum = 0;
    let ageCount = 0;
    const semesters: Record<string, number> = {};
    const campuses: Record<string, number> = {};

    instrumentResponses.forEach((r) => {
      if (r.age && !isNaN(Number(r.age))) {
        ageSum += Number(r.age);
        ageCount++;
      }
      const sem = `${r.semester}° Sem`;
      semesters[sem] = (semesters[sem] || 0) + 1;

      const loc = r.centerLocation || 'Sin sede';
      campuses[loc] = (campuses[loc] || 0) + 1;
    });

    return {
      total,
      avgAge: ageCount > 0 ? (ageSum / ageCount).toFixed(1) : 0,
      semesters,
      campuses,
    };
  }, [instrumentResponses]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (instrumentResponses.length === 0) return;

    // Build headers
    const baseHeaders = [
      'ID_Registro',
      'Fecha_Envio',
      'Participante',
      'Codigo_Estudiantil',
      'Edad',
      'Semestre',
      'Sede_Campus',
      'Consentimiento_Aceptado',
    ];

    const questionHeaders = instrument.questions
      .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
      .map((q) => `"${q.id}_${q.title.replace(/"/g, '""').substring(0, 40)}"`);

    const headers = [...baseHeaders, ...questionHeaders].join(',');

    // Build rows
    const rows = instrumentResponses.map((r) => {
      const baseValues = [
        `"${r.id}"`,
        `"${new Date(r.submittedAt).toLocaleString()}"`,
        `"${(r.participantName || '').replace(/"/g, '""')}"`,
        `"${(r.studentCode || '').replace(/"/g, '""')}"`,
        `"${r.age || ''}"`,
        `"${r.semester || ''}"`,
        `"${(r.centerLocation || '').replace(/"/g, '""')}"`,
        `"${r.informedConsentAccepted ? 'SI' : 'NO'}"`,
      ];

      const questionValues = instrument.questions
        .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
        .map((q) => {
          const ans = r.answers[q.id];
          if (ans === undefined || ans === null) return '""';
          if (typeof ans === 'object') {
            return `"${JSON.stringify(ans).replace(/"/g, '""')}"`;
          }
          return `"${String(ans).replace(/"/g, '""')}"`;
        });

      return [...baseValues, ...questionValues].join(',');
    });

    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduPulse_${instrument.code}_Respuestas_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle Export JSON
  const handleExportJSON = () => {
    if (instrumentResponses.length === 0) return;
    const jsonStr = JSON.stringify(instrumentResponses, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduPulse_${instrument.code}_Respuestas_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle Copy TSV for Excel / Google Sheets
  const handleCopyTSV = () => {
    if (instrumentResponses.length === 0) return;

    const baseHeaders = ['ID', 'Fecha', 'Nombre', 'Semestre', 'Edad', 'Sede'];
    const qHeaders = instrument.questions
      .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
      .map((q) => q.title.substring(0, 35));
    const allHeaders = [...baseHeaders, ...qHeaders].join('\t');

    const rows = instrumentResponses.map((r) => {
      const base = [
        r.id,
        new Date(r.submittedAt).toLocaleDateString(),
        r.participantName,
        `${r.semester}°`,
        r.age,
        r.centerLocation,
      ];
      const qAns = instrument.questions
        .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
        .map((q) => {
          const ans = r.answers[q.id];
          if (!ans) return '';
          if (typeof ans === 'object') return JSON.stringify(ans);
          return String(ans).replace(/[\r\n\t]/g, ' ');
        });
      return [...base, ...qAns].join('\t');
    });

    const fullTSV = [allHeaders, ...rows].join('\n');
    navigator.clipboard.writeText(fullTSV);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2500);
  };

  // Handle Delete Response
  const handleDeleteResponse = async (id: string) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this response?' : '¿Estás seguro de que deseas eliminar esta respuesta?')) {
      await removeInstrumentResponse(id);
      if (currentIndividualIndex > 0) {
        setCurrentIndividualIndex((prev) => prev - 1);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Academic Header with Frutiger Aero Glass */}
      <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 shadow-lg p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                {instrument.code}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-cyan-300 uppercase tracking-wider">
                {language === 'en' ? 'Research Responses' : 'Panel de Respuestas y Métricas'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {instrument.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-cyan-200/80">
              {instrument.phase} • Universidad de Córdoba
            </p>
          </div>

          {/* Quick Action: Fill questionnaire */}
          <button
            onClick={onFillInstrument}
            className="btn-aero-cyan inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>{language === 'en' ? 'Answer Questionnaire' : 'Responder Cuestionario'}</span>
          </button>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="aero-card p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-cyan-200/80 block">
              {language === 'en' ? 'Total Responses' : 'Total de Respuestas'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats.total}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {stats.total === 1
                  ? language === 'en'
                    ? 'student'
                    : 'estudiante'
                  : language === 'en'
                  ? 'students'
                  : 'estudiantes'}
              </span>
            </div>
          </div>

          <div className="aero-card p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-cyan-200/80 block">
              {language === 'en' ? 'Average Age' : 'Edad Promedio'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats.avgAge || '--'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {language === 'en' ? 'years' : 'años'}
              </span>
            </div>
          </div>

          <div className="aero-card p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-cyan-200/80 block">
              {language === 'en' ? 'Campuses' : 'Sedes Representadas'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {Object.keys(stats.campuses).length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {language === 'en' ? 'campuses' : 'sedes'}
              </span>
            </div>
          </div>

          <div className="aero-card p-4 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-cyan-200/80 block">
              {language === 'en' ? 'Semesters' : 'Semestres de Muestra'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {Object.keys(stats.semesters).length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {language === 'en' ? 'cohorts' : 'cohortes'}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Sub-tabs (Resumen / Individual) & Export Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-cyan-800/40">
          {/* Subtabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-cyan-500/20">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'summary'
                  ? 'btn-aero-cyan text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Aggregated Summary' : 'Resumen Agregado'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/30 text-white">
                {instrumentResponses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('individual')}
              disabled={instrumentResponses.length === 0}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer disabled:opacity-40 ${
                activeTab === 'individual'
                  ? 'btn-aero-cyan text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Individual Responses' : 'Respuestas Individuales'}</span>
            </button>
          </div>

          {/* Export Actions (Aero Glass Buttons) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={instrumentResponses.length === 0}
              title={language === 'en' ? 'Download CSV file' : 'Descargar archivo CSV'}
              className="btn-aero-glass inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer disabled:opacity-40 shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={instrumentResponses.length === 0}
              title={language === 'en' ? 'Download JSON format' : 'Descargar en formato JSON'}
              className="btn-aero-glass inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer disabled:opacity-40 shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleCopyTSV}
              disabled={instrumentResponses.length === 0}
              title={language === 'en' ? 'Copy for Google Sheets / Excel' : 'Copiar datos para Google Sheets o Excel'}
              className="btn-aero-glass inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer disabled:opacity-40 shadow-xs"
            >
              {copiedData ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                    {language === 'en' ? 'Copied!' : '¡Copiado!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'en' ? 'Copy Table' : 'Copiar Tabla'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {instrumentResponses.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BarChart3 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {language === 'en' ? 'No responses received yet' : 'Aún no hay respuestas registradas'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {language === 'en'
                ? 'Be the first to submit a response or share the questionnaire with students of the Licenciatura en Informática.'
                : 'Sé el primero en responder o comparte el enlace de la aplicación con los estudiantes de la Licenciatura en Informática.'}
            </p>
          </div>
          <button
            onClick={onFillInstrument}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-[#059669] hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{language === 'en' ? 'Fill Questionnaire Now' : 'Diligenciar Cuestionario Ahora'}</span>
          </button>
        </div>
      )}

      {/* TAB 1: AGGREGATED SUMMARY */}
      {instrumentResponses.length > 0 && activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Demographic Distributions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {language === 'en' ? 'Demographic Distribution of Sample' : 'Distribución Sociodemográfica de la Muestra'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {instrumentResponses.length} {language === 'en' ? 'respondents' : 'participantes'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Semester Breakdown */}
              <div className="space-y-3">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
                  {language === 'en' ? 'Distribution by Semester' : 'Distribución por Semestre en Curso'}
                </span>
                <div className="space-y-2">
                  {Object.entries(stats.semesters)
                    .sort((a, b) => b[1] - a[1])
                    .map(([sem, count]) => {
                      const pct = Math.round((count / instrumentResponses.length) * 100);
                      return (
                        <div key={sem} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{sem}</span>
                            <span className="text-slate-500 font-mono">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-white/60 dark:bg-slate-900/60 rounded-full overflow-hidden border border-white/80 dark:border-cyan-500/20">
                            <div
                              className="h-full aero-progress-bar rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Campus Breakdown */}
              <div className="space-y-3">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
                  {language === 'en' ? 'Distribution by Campus' : 'Distribución por Sede o Centro de Tutoría'}
                </span>
                <div className="space-y-2">
                  {Object.entries(stats.campuses)
                    .sort((a, b) => b[1] - a[1])
                    .map(([campus, count]) => {
                      const pct = Math.round((count / instrumentResponses.length) * 100);
                      const displayCampus = formatCampusLabel(campus, language);
                      return (
                        <div key={campus} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{displayCampus}</span>
                            <span className="text-slate-500 font-mono">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-white/60 dark:bg-slate-900/60 rounded-full overflow-hidden border border-white/80 dark:border-cyan-500/20">
                            <div
                              className="h-full aero-progress-bar rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Questions Breakdown */}
          {instrument.questions
            .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
            .map((q, idx) => {
              return (
                <div
                  key={q.id}
                  className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-6 sm:p-7 space-y-4 shadow-sm"
                >
                  {/* Question Title & Meta */}
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-center">
                          {idx + 4}
                        </span>
                        {q.category && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {q.category}
                          </span>
                        )}
                        {q.subCategory && (
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            • {q.subCategory}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {q.title}
                      </h4>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {instrumentResponses.filter((r) => r.answers[q.id] !== undefined).length} / {instrumentResponses.length} {language === 'en' ? 'answers' : 'respuestas'}
                    </span>
                  </div>

                  {/* Visual Analytics by Question Type */}
                  <div className="pt-2">
                    {/* SINGLE CHOICE / RATING BREAKDOWN */}
                    {q.type === 'single_choice' && (
                      <div className="space-y-3">
                        {q.options?.map((opt) => {
                          const count = instrumentResponses.filter((r) =>
                            isOptionMatch(q.id, opt, r.answers[q.id])
                          ).length;
                          const pct = instrumentResponses.length > 0
                            ? Math.round((count / instrumentResponses.length) * 100)
                            : 0;

                          return (
                            <div key={opt} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {opt}
                                </span>
                                <span className="text-slate-500 font-mono font-bold">
                                  {count} <span className="font-normal text-slate-400">({pct}%)</span>
                                </span>
                              </div>
                              <div className="h-3 w-full bg-white/60 dark:bg-slate-900/60 rounded-full overflow-hidden border border-white/80 dark:border-cyan-500/20">
                                <div
                                  className="h-full aero-progress-bar rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* MULTIPLE CHOICE BREAKDOWN */}
                    {q.type === 'multiple_choice' && (
                      <div className="space-y-3">
                        {q.options?.map((opt) => {
                          const count = instrumentResponses.filter((r) => {
                            const val = r.answers[q.id];
                            return (
                              Array.isArray(val) &&
                              val.some((item) => isOptionMatch(q.id, opt, String(item)))
                            );
                          }).length;
                          const pct = instrumentResponses.length > 0
                            ? Math.round((count / instrumentResponses.length) * 100)
                            : 0;

                          return (
                            <div key={opt} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {opt}
                                </span>
                                <span className="text-slate-500 font-mono font-bold">
                                  {count} <span className="font-normal text-slate-400">({pct}%)</span>
                                </span>
                              </div>
                              <div className="h-3 w-full bg-white/60 dark:bg-slate-900/60 rounded-full overflow-hidden border border-white/80 dark:border-cyan-500/20">
                                <div
                                  className="h-full aero-progress-bar rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* MATRIX GRID FREQUENCY MATRIX */}
                    {q.type === 'matrix_grid' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                              <th className="py-2.5 pr-4 font-bold text-slate-700 dark:text-slate-300">
                                {language === 'en' ? 'Activity / Use Case' : 'Actividad o Uso'}
                              </th>
                              {q.matrixColumns?.map((col) => (
                                <th key={col.id} className="py-2.5 px-3 text-center whitespace-nowrap">
                                  {col.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {q.matrixRows?.map((row) => {
                              return (
                                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                  <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-200">
                                    {row.label}
                                  </td>
                                  {q.matrixColumns?.map((col) => {
                                    const count = instrumentResponses.filter((r) => {
                                      const matrix = r.answers[q.id];
                                      return matrix && matrix[row.id] === col.id;
                                    }).length;
                                    const pct = instrumentResponses.length > 0
                                      ? Math.round((count / instrumentResponses.length) * 100)
                                      : 0;

                                    return (
                                      <td key={col.id} className="py-3 px-3 text-center font-mono">
                                        <div className="inline-flex flex-col items-center">
                                          <span className="font-bold text-slate-900 dark:text-white">
                                            {count}
                                          </span>
                                          <span className="text-[10px] text-slate-400">
                                            {pct}%
                                          </span>
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* PARAGRAPH / OPEN-ENDED REFLECTIONS WALL */}
                    {q.type === 'paragraph' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>
                            {language === 'en' ? 'Verbatim student reflections' : 'Reflexiones textuales de los participantes'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                          {instrumentResponses
                            .filter((r) => r.answers[q.id] && String(r.answers[q.id]).trim().length > 0)
                            .map((r) => (
                              <div
                                key={r.id}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
                              >
                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                  <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {r.participantName}
                                  </span>
                                  <span>
                                    {r.semester}° {language === 'en' ? 'Sem' : 'Sem'} • {formatCampusLabel(r.centerLocation || '', language).split(' ')[0]}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300 italic font-body leading-relaxed">
                                  "{String(r.answers[q.id])}"
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* TAB 2: INDIVIDUAL RESPONSES VIEWER (Google Forms style) */}
      {instrumentResponses.length > 0 && activeTab === 'individual' && activeIndividualResponse && (
        <div className="space-y-6">
          {/* Individual Navigation Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Pagination Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentIndividualIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndividualIndex === 0}
                className="h-9 w-9 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{language === 'en' ? 'Response' : 'Respuesta'}{' '}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {currentIndividualIndex + 1}
                </span>{' '}
                <span>{language === 'en' ? 'of' : 'de'} {instrumentResponses.length}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentIndividualIndex((prev) =>
                    Math.min(instrumentResponses.length - 1, prev + 1)
                  )
                }
                disabled={currentIndividualIndex === instrumentResponses.length - 1}
                className="h-9 w-9 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Respondent Selector Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={currentIndividualIndex}
                onChange={(e) => setCurrentIndividualIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
              >
                {instrumentResponses.map((r, idx) => (
                  <option key={r.id} value={idx}>
                    #{idx + 1} - {r.participantName} ({r.semester}° Sem)
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleDeleteResponse(activeIndividualResponse.id)}
                title={language === 'en' ? 'Delete this response' : 'Eliminar esta respuesta'}
                className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Full Individual Response Sheet with Aero Glass */}
          <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-lg">
            {/* Participant Profile Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  {language === 'en' ? 'Respondent Profile' : 'Ficha del Participante'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeIndividualResponse.participantName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span>{activeIndividualResponse.semester}° {language === 'en' ? 'Semester' : 'Semestre'}</span>
                  <span>•</span>
                  <span>{activeIndividualResponse.age} {language === 'en' ? 'years old' : 'años'}</span>
                  <span>•</span>
                  <span>{formatCampusLabel(activeIndividualResponse.centerLocation || '', language)}</span>
                  {activeIndividualResponse.studentCode && (
                    <>
                      <span>•</span>
                      <span className="font-mono">ID: {activeIndividualResponse.studentCode}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-500">
                <span className="block font-semibold">
                  {new Date(activeIndividualResponse.submittedAt).toLocaleDateString()}
                </span>
                <span>{new Date(activeIndividualResponse.submittedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Rendered Answers to Each Question */}
            <div className="space-y-6">
              {instrument.questions
                .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
                .map((q, idx) => {
                  const ans = activeIndividualResponse.answers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold flex items-center justify-center">
                          {idx + 4}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                          {q.title}
                        </h4>
                      </div>

                      {/* Answer Value Rendering */}
                      <div className="pl-7 pt-1 text-xs text-slate-700 dark:text-slate-300 font-body">
                        {ans === undefined || ans === null || ans === '' ? (
                          <span className="text-slate-400 italic">
                            {language === 'en' ? 'No answer registered' : 'Sin respuesta registrada'}
                          </span>
                        ) : q.type === 'matrix_grid' && typeof ans === 'object' ? (
                          <div className="space-y-1.5 pt-1">
                            {q.matrixRows?.map((row) => {
                              const chosenColId = ans[row.id];
                              const chosenCol = q.matrixColumns?.find((c) => c.id === chosenColId);
                              return (
                                <div key={row.id} className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/40">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {row.label}
                                  </span>
                                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                    {chosenCol?.label || chosenColId || '--'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : Array.isArray(ans) ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {ans.map((item) => (
                              <span
                                key={item}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              >
                                {getLocalizedOptionLabel(q.id, String(item), language)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 font-normal leading-relaxed">
                            {getLocalizedOptionLabel(q.id, String(ans), language)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
