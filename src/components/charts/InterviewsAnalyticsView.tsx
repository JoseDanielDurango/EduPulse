import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Users,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Quote,
  ShieldAlert,
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  Copy,
  Check,
  ExternalLink,
  Mail,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { InterviewSession } from '../../types';
import { Language } from '../../lib/i18n';
import { FormsDonutChart, FormsBarChart, ChartDataPoint } from './GoogleFormsCharts';
import { openEmailForSession, copySessionToClipboard } from '../../lib/sheetsExport';

interface InterviewsAnalyticsViewProps {
  sessions: InterviewSession[];
  language: Language;
  onViewSessionSummary?: (session: InterviewSession) => void;
}

export const InterviewsAnalyticsView: React.FC<InterviewsAnalyticsViewProps> = ({
  sessions,
  language,
  onViewSessionSummary,
}) => {
  const [analyticsTab, setAnalyticsTab] = useState<'general' | 'individual'>('general');
  const [individualIndex, setIndividualIndex] = useState(0);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);
  const [copiedSession, setCopiedSession] = useState(false);

  // Clamp individual index to valid range
  const safeIndividualIndex = Math.min(
    Math.max(0, individualIndex),
    Math.max(0, sessions.length - 1)
  );
  const activeSession = sessions[safeIndividualIndex];

  // Aggregate Metrics (General Analytics)
  const analytics = useMemo(() => {
    const total = sessions.length;
    if (total === 0) {
      return {
        total: 0,
        completedCount: 0,
        activeCount: 0,
        avgTurns: 0,
        sentimentData: [],
        semesterData: [],
        campusData: [],
        topicData: [],
        commonPainPoints: [],
        featuredQuotes: [],
      };
    }

    const completed = sessions.filter((s) => s.status === 'completed');
    const completedCount = completed.length;
    const activeCount = total - completedCount;

    // Total dialog turns
    const totalTurns = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
    const avgTurns = total > 0 ? (totalTurns / total).toFixed(1) : '0';

    // Sentiment breakdown
    const sentimentCounts: Record<string, number> = {
      positive: 0,
      reflective: 0,
      concerned: 0,
      neutral: 0,
    };

    // Semester breakdown
    const semesterCounts: Record<string, number> = {};

    // Campus breakdown
    const campusCounts: Record<string, number> = {};

    // Category / Topic frequencies
    const topicCounts: Record<string, number> = {
      'Formación Pedagógica': 0,
      'Ética e Integridad': 0,
      'Habilidades y Alfabetización': 0,
      'Brecha y Conectividad': 0,
      'Futuro Laboral Docente': 0,
    };

    // Pain points collected
    const painPointsMap: Record<string, number> = {};
    const quotesList: { quote: string; participant: string; semester: string }[] = [];

    sessions.forEach((s) => {
      // Sentiment
      const sent = s.summary?.sentiment || s.summary?.overallSentiment || 'neutral';
      if (sent.includes('pos') || sent.includes('opt')) sentimentCounts.positive++;
      else if (sent.includes('ref') || sent.includes('crit')) sentimentCounts.reflective++;
      else if (sent.includes('pre') || sent.includes('cau')) sentimentCounts.concerned++;
      else sentimentCounts.neutral++;

      // Semester
      const sem = s.semester ? `${s.semester}° Sem` : 'No especificado';
      semesterCounts[sem] = (semesterCounts[sem] || 0) + 1;

      // Campus
      const loc = s.centerLocation || 'Sede Central Montería';
      campusCounts[loc] = (campusCounts[loc] || 0) + 1;

      // Key pain points
      const painPoints = s.summary?.keyPainPoints || [];
      if (Array.isArray(painPoints)) {
        painPoints.forEach((pp: string) => {
          const trimmed = pp.trim();
          if (trimmed.length > 5) {
            painPointsMap[trimmed] = (painPointsMap[trimmed] || 0) + 1;
          }
        });
      }

      // Structured quotes and category insights
      if (s.structuredResponses && Array.isArray(s.structuredResponses)) {
        s.structuredResponses.forEach((sr) => {
          const srPainPoints = sr.painPointsOrNeeds || sr.challengesOrLimitations || [];
          if (Array.isArray(srPainPoints)) {
            srPainPoints.forEach((pp: string) => {
              const trimmed = (pp || '').trim();
              if (trimmed.length > 5) {
                painPointsMap[trimmed] = (painPointsMap[trimmed] || 0) + 1;
              }
            });
          }
          if (sr.category) {
            const cat = sr.category;
            if (cat.includes('Pedag')) topicCounts['Formación Pedagógica']++;
            else if (cat.includes('Étic') || cat.includes('Integ')) topicCounts['Ética e Integridad']++;
            else if (cat.includes('Alfab') || cat.includes('Habil')) topicCounts['Habilidades y Alfabetización']++;
            else if (cat.includes('Brech') || cat.includes('Conect')) topicCounts['Brecha y Conectividad']++;
            else if (cat.includes('Labor') || cat.includes('Futur')) topicCounts['Futuro Laboral Docente']++;
          }

          if (sr.directQuotes && Array.isArray(sr.directQuotes)) {
            sr.directQuotes.forEach((q) => {
              if (q && q.trim().length > 15 && quotesList.length < 10) {
                quotesList.push({
                  quote: q.trim(),
                  participant: s.participantName || s.studentCode || 'Informante',
                  semester: s.semester ? `${s.semester}° Sem` : '',
                });
              }
            });
          }
        });
      }
    });

    // Format Sentiment Chart Data
    const sentimentData: ChartDataPoint[] = [
      {
        label: language === 'en' ? 'Reflective & Critical' : 'Reflexivo y Crítico',
        count: sentimentCounts.reflective,
        color: '#06b6d4',
      },
      {
        label: language === 'en' ? 'Optimistic & Positive' : 'Optimista / Favorable',
        count: sentimentCounts.positive,
        color: '#10b981',
      },
      {
        label: language === 'en' ? 'Cautious / Concerned' : 'Cauteloso / Preocupado',
        count: sentimentCounts.concerned,
        color: '#f59e0b',
      },
      {
        label: language === 'en' ? 'Neutral' : 'Neutral / En exploración',
        count: sentimentCounts.neutral,
        color: '#64748b',
      },
    ].filter((d) => d.count > 0);

    // Format Semester Chart Data
    const semesterData: ChartDataPoint[] = Object.entries(semesterCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => parseInt(a.label) - parseInt(b.label));

    // Format Campus Chart Data
    const campusData: ChartDataPoint[] = Object.entries(campusCounts)
      .map(([label, count]) => ({
        label: label.replace('Sede ', ''),
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Format Topic Chart Data
    const topicData: ChartDataPoint[] = Object.entries(topicCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const commonPainPoints = Object.entries(painPointsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      total,
      completedCount,
      activeCount,
      avgTurns,
      sentimentData,
      semesterData,
      campusData,
      topicData,
      commonPainPoints,
      featuredQuotes: quotesList,
    };
  }, [sessions, language]);

  // Individual Metrics & Visualizations for Safe Active Session
  const individualMetrics = useMemo(() => {
    if (!activeSession) return null;

    const msgs = activeSession.messages || [];
    const totalTurns = msgs.length;
    const userTurns = msgs.filter((m) => m.sender === 'participant').length;
    const assistantTurns = msgs.filter((m) => m.sender === 'agent').length;

    // Posture / Sentiment
    const rawSentiment =
      activeSession.summary?.sentiment ||
      activeSession.summary?.overallSentiment ||
      'reflective';

    let sentimentLabel = language === 'en' ? 'Reflective & Critical' : 'Reflexivo y Crítico';
    let sentimentColor = '#06b6d4';
    let sentimentBg =
      'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';

    if (rawSentiment.includes('pos') || rawSentiment.includes('opt')) {
      sentimentLabel = language === 'en' ? 'Optimistic & Positive' : 'Optimista / Favorable';
      sentimentColor = '#10b981';
      sentimentBg =
        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    } else if (rawSentiment.includes('pre') || rawSentiment.includes('cau')) {
      sentimentLabel = language === 'en' ? 'Cautious / Concerned' : 'Cauteloso / Preocupado';
      sentimentColor = '#f59e0b';
      sentimentBg =
        'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    } else if (rawSentiment.includes('neu')) {
      sentimentLabel = language === 'en' ? 'Neutral / Exploratory' : 'Neutral / En Exploración';
      sentimentColor = '#64748b';
      sentimentBg =
        'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }

    // Categories & Qualitative Dimensions for this individual
    const categoryCounts: Record<string, number> = {
      'Formación Pedagógica': 0,
      'Ética e Integridad': 0,
      'Habilidades y Alfabetización': 0,
      'Brecha y Conectividad': 0,
      'Futuro Laboral Docente': 0,
    };

    const quotes: { quote: string; category?: string }[] = [];
    const painPoints: string[] = [];

    // Structured Responses extraction
    if (activeSession.structuredResponses && Array.isArray(activeSession.structuredResponses)) {
      activeSession.structuredResponses.forEach((sr) => {
        const cat = sr.category || '';
        if (cat.includes('Pedag')) categoryCounts['Formación Pedagógica']++;
        else if (cat.includes('Étic') || cat.includes('Integ')) categoryCounts['Ética e Integridad']++;
        else if (cat.includes('Alfab') || cat.includes('Habil')) categoryCounts['Habilidades y Alfabetización']++;
        else if (cat.includes('Brech') || cat.includes('Conect')) categoryCounts['Brecha y Conectividad']++;
        else if (cat.includes('Labor') || cat.includes('Futur')) categoryCounts['Futuro Laboral Docente']++;
        else categoryCounts['Formación Pedagógica']++;

        if (sr.directQuotes && Array.isArray(sr.directQuotes)) {
          sr.directQuotes.forEach((q) => {
            if (q && q.trim().length > 15) {
              quotes.push({ quote: q.trim(), category: sr.category });
            }
          });
        }

        const srPain = sr.painPointsOrNeeds || sr.challengesOrLimitations || [];
        if (Array.isArray(srPain)) {
          srPain.forEach((p) => {
            if (p && p.trim().length > 5 && !painPoints.includes(p.trim())) {
              painPoints.push(p.trim());
            }
          });
        }
      });
    }

    // Summary pain points
    if (activeSession.summary?.keyPainPoints && Array.isArray(activeSession.summary.keyPainPoints)) {
      activeSession.summary.keyPainPoints.forEach((p) => {
        if (p && p.trim().length > 5 && !painPoints.includes(p.trim())) {
          painPoints.push(p.trim());
        }
      });
    }

    // If structured counts are empty, infer from dialog text
    const totalCatCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
    if (totalCatCount === 0 && userTurns > 0) {
      msgs
        .filter((m) => m.sender === 'participant')
        .forEach((m) => {
          const text = (m.text || '').toLowerCase();
          if (
            text.includes('clase') ||
            text.includes('enseñ') ||
            text.includes('pedagog') ||
            text.includes('didact') ||
            text.includes('profesor') ||
            text.includes('docente')
          ) {
            categoryCounts['Formación Pedagógica']++;
          }
          if (
            text.includes('plagio') ||
            text.includes('copia') ||
            text.includes('ética') ||
            text.includes('honesto') ||
            text.includes('trampa')
          ) {
            categoryCounts['Ética e Integridad']++;
          }
          if (
            text.includes('promp') ||
            text.includes('herramienta') ||
            text.includes('usar') ||
            text.includes('aprender') ||
            text.includes('chatgpt')
          ) {
            categoryCounts['Habilidades y Alfabetización']++;
          }
          if (
            text.includes('internet') ||
            text.includes('conect') ||
            text.includes('computador') ||
            text.includes('rural') ||
            text.includes('señal') ||
            text.includes('recurso')
          ) {
            categoryCounts['Brecha y Conectividad']++;
          }
          if (
            text.includes('reemplaz') ||
            text.includes('futuro') ||
            text.includes('trabajo') ||
            text.includes('laboral') ||
            text.includes('empleo')
          ) {
            categoryCounts['Futuro Laboral Docente']++;
          }
        });
    }

    // Individual Donut Data: Qualitative Dimensions
    const individualDimensionData: ChartDataPoint[] = [
      {
        label: language === 'en' ? 'Pedagogical Training' : 'Formación Pedagógica',
        count: categoryCounts['Formación Pedagógica'] || (userTurns > 0 ? 1 : 0),
        color: '#06b6d4',
      },
      {
        label: language === 'en' ? 'Ethics & Integrity' : 'Ética e Integridad',
        count: categoryCounts['Ética e Integridad'] || (userTurns > 1 ? 1 : 0),
        color: '#10b981',
      },
      {
        label: language === 'en' ? 'AI Skills & Literacy' : 'Habilidades y Alfabetización',
        count: categoryCounts['Habilidades y Alfabetización'] || (userTurns > 2 ? 1 : 0),
        color: '#3b82f6',
      },
      {
        label: language === 'en' ? 'Connectivity & Digital Divide' : 'Brecha y Conectividad',
        count: categoryCounts['Brecha y Conectividad'],
        color: '#f59e0b',
      },
      {
        label: language === 'en' ? 'Teaching Future / Labor' : 'Futuro Laboral Docente',
        count: categoryCounts['Futuro Laboral Docente'],
        color: '#8b5cf6',
      },
    ].filter((d) => d.count > 0);

    // Individual Bar Data: Thematic density
    const individualCategoryBarData: ChartDataPoint[] = Object.entries(categoryCounts)
      .map(([label, count]) => ({
        label:
          language === 'en'
            ? label === 'Formación Pedagógica'
              ? 'Pedagogical Training'
              : label === 'Ética e Integridad'
              ? 'Ethics & Integrity'
              : label === 'Habilidades y Alfabetización'
              ? 'Skills & Literacy'
              : label === 'Brecha y Conectividad'
              ? 'Digital Divide'
              : 'Teaching Future'
            : label,
        count,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      totalTurns,
      userTurns,
      assistantTurns,
      sentimentLabel,
      sentimentColor,
      sentimentBg,
      individualDimensionData,
      individualCategoryBarData,
      quotes,
      painPoints,
    };
  }, [activeSession, language]);

  const handleCopyQuote = (quoteText: string) => {
    navigator.clipboard.writeText(quoteText).catch(() => {});
    setCopiedQuote(quoteText);
    setTimeout(() => setCopiedQuote(null), 2500);
  };

  const handleCopySessionData = () => {
    if (!activeSession) return;
    const ok = copySessionToClipboard(activeSession);
    if (ok) {
      setCopiedSession(true);
      setTimeout(() => setCopiedSession(false), 2500);
    }
  };

  const handleEmailInformant = () => {
    if (!activeSession) return;
    openEmailForSession(activeSession, 'josedudaca@gmail.com');
  };

  if (sessions.length === 0) {
    return (
      <div className="aero-card rounded-3xl p-12 text-center border border-white/90 dark:border-cyan-500/30">
        <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-3 opacity-60" />
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
          {language === 'en' ? 'No interviews registered yet' : 'Aún no hay entrevistas registradas para graficar'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-cyan-200/70 max-w-sm mx-auto mt-1">
          {language === 'en'
            ? 'Start a dialogue session with Cereza to generate qualitative analytics and charts.'
            : 'Inicia un diálogo cualitativo con Cereza para generar métricas estadísticas y hermenéuticas.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      {/* Top Switcher: General Graphics vs Individual Graphics */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-white/90 dark:border-cyan-500/30 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-cyan-900/40">
          <button
            onClick={() => setAnalyticsTab('general')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              analyticsTab === 'general'
                ? 'btn-aero-cyan text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'General Graphics (Sample)' : 'Gráficos Generales (Muestra)'}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/30 text-white font-mono">
              {sessions.length}
            </span>
          </button>

          <button
            onClick={() => setAnalyticsTab('individual')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              analyticsTab === 'individual'
                ? 'btn-aero-cyan text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Individual Graphics (By Informant)' : 'Gráficos Individuales (Por Informante)'}</span>
          </button>
        </div>

        {/* Individual Informant Pagination & Selector */}
        {analyticsTab === 'individual' && activeSession && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-cyan-800">
              <button
                onClick={() => setIndividualIndex((prev) => Math.max(0, prev - 1))}
                disabled={safeIndividualIndex === 0}
                title={language === 'en' ? 'Previous informant' : 'Informante anterior'}
                className="p-1.5 rounded-xl text-slate-600 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-mono font-bold text-slate-700 dark:text-cyan-200 px-2 select-none">
                {safeIndividualIndex + 1} / {sessions.length}
              </span>

              <button
                onClick={() => setIndividualIndex((prev) => Math.min(sessions.length - 1, prev + 1))}
                disabled={safeIndividualIndex >= sessions.length - 1}
                title={language === 'en' ? 'Next informant' : 'Siguiente informante'}
                className="p-1.5 rounded-xl text-slate-600 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <select
              value={safeIndividualIndex}
              onChange={(e) => setIndividualIndex(Number(e.target.value))}
              className="px-3 py-1.5 rounded-2xl text-xs bg-white/90 dark:bg-slate-800 border border-slate-300 dark:border-cyan-800 text-slate-900 dark:text-white cursor-pointer font-medium max-w-[220px] sm:max-w-xs truncate"
            >
              {sessions.map((s, idx) => (
                <option key={s.id || idx} value={idx}>
                  #{idx + 1} - {s.studentCode || `E0${idx + 1}`} ({s.participantName || 'Informante'}) -{' '}
                  {s.semester ? `${s.semester}° Sem` : 'Semestre N/A'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODE 1: GENERAL GRAPHICS (MUESTRA COMPLETA)                           */}
      {/* ===================================================================== */}
      {analyticsTab === 'general' && (
        <div className="space-y-6">
          {/* Overview Stat Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Sample Size' : 'Muestra Total'}</span>
                <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {analytics.total}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {language === 'en' ? 'Informants registered' : 'Docentes en formación'}
              </p>
            </div>

            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Completed Sessions' : 'Tasa de Completitud'}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {Math.round((analytics.completedCount / analytics.total) * 100)}%
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {analytics.completedCount} {language === 'en' ? 'of' : 'de'} {analytics.total}{' '}
                {language === 'en' ? 'completed' : 'finalizadas'}
              </p>
            </div>

            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Avg. Dialog Turns' : 'Profundidad Dialógica'}</span>
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {analytics.avgTurns}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {language === 'en' ? 'Interactions per session' : 'Turnos promedio por sesión'}
              </p>
            </div>

            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Campuses' : 'Sedes Involucradas'}</span>
                <MapPin className="h-4 w-4 text-teal-600 dark:text-cyan-300" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-cyan-300 mt-1">
                {analytics.campusData.length}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {language === 'en' ? 'Centros de Tutoría' : 'Cobertura territorial'}
              </p>
            </div>
          </div>

          {/* Row 1: Sentiment Donut Chart & Semesters Vertical Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Donut */}
            <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en' ? 'Hermeneutic Posture Towards AI' : 'Postura Hermenéutica frente a la IA'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">N={analytics.total}</span>
              </div>

              <FormsDonutChart
                data={analytics.sentimentData}
                centerLabel={`${analytics.total}`}
                centerSublabel={language === 'en' ? 'Interviews' : 'Entrevistas'}
              />
            </div>

            {/* Semesters Bar Chart */}
            <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en' ? 'Informants by Academic Semester' : 'Informantes por Semestre en Curso'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">1° al 10°</span>
              </div>

              <FormsBarChart
                data={analytics.semesterData}
                orientation="vertical"
                showPercentages={true}
              />
            </div>
          </div>

          {/* Row 2: Campus Breakdown & Thematic Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campuses Horizontal Bars */}
            <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-600 dark:text-cyan-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en' ? 'Distribution by Campus / Location' : 'Distribución por Sede o Centro de Tutoría'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">UniCórdoba</span>
              </div>

              <FormsBarChart
                data={analytics.campusData}
                orientation="horizontal"
                showPercentages={true}
              />
            </div>

            {/* Thematic Categories */}
            <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en' ? 'Thematic Dimensions Explored' : 'Dimensiones Temáticas Abordadas'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Capítulo 5</span>
              </div>

              <FormsBarChart
                data={analytics.topicData}
                orientation="horizontal"
                showPercentages={true}
              />
            </div>
          </div>

          {/* Row 3: Key Pain Points & Featured Qualitative Quotes */}
          {analytics.commonPainPoints.length > 0 && (
            <div className="aero-card rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'en' ? 'Key Pedagogical Challenges Identified' : 'Retos y Desafíos Pedagógicos Más Frecuentes'}
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {analytics.commonPainPoints.map(([point, count], idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-cyan-900/50 text-slate-800 dark:text-cyan-200 shadow-2xs"
                  >
                    <span>{point}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950 font-bold text-cyan-800 dark:text-cyan-300">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Featured Quotes for Chapter 5 */}
          {analytics.featuredQuotes.length > 0 && (
            <div className="aero-card rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <Quote className="h-4 w-4 text-emerald-600 dark:text-cyan-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'en' ? 'Verbatim Student Quotes (Thesis Chapter 5)' : 'Citas Textuales Verbatim para el Capítulo 5 de la Tesis'}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {analytics.featuredQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-cyan-900/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-cyan-300">
                      <span>{q.participant}</span>
                      {q.semester && <span className="text-slate-400">{q.semester}</span>}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{q.quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: INDIVIDUAL GRAPHICS & HERMENEUTIC PROFILE (POR INFORMANTE)    */}
      {/* ===================================================================== */}
      {analyticsTab === 'individual' && activeSession && individualMetrics && (
        <div className="space-y-6">
          {/* Informant Header Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-cyan-900/30 via-slate-900/40 to-emerald-950/30 border border-white/80 dark:border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {activeSession.studentCode || `E0${safeIndividualIndex + 1}`}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${individualMetrics.sentimentBg}`}
                >
                  {individualMetrics.sentimentLabel}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    activeSession.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {activeSession.status === 'completed'
                    ? language === 'en'
                      ? 'Completed'
                      : 'Completada'
                    : language === 'en'
                    ? 'In Progress'
                    : 'En progreso'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {activeSession.participantName || `Informante #${safeIndividualIndex + 1}`}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-cyan-200/80">
                <span>
                  {activeSession.semester
                    ? `${activeSession.semester}° ${language === 'en' ? 'Semester' : 'Semestre'}`
                    : 'Semestre N/A'}
                </span>
                <span>•</span>
                <span>{activeSession.centerLocation || 'Sede Central Montería'}</span>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {new Date(activeSession.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {onViewSessionSummary && (
                <button
                  onClick={() => onViewSessionSummary(activeSession)}
                  className="px-3.5 py-1.5 rounded-full btn-aero-cyan text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>{language === 'en' ? 'View Transcript' : 'Ver Transcripción'}</span>
                </button>
              )}

              <button
                onClick={handleEmailInformant}
                title={
                  language === 'en'
                    ? 'Send summary to researchers'
                    : 'Enviar resumen de este informante a los investigadores'
                }
                className="px-3.5 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Mail className="h-3.5 w-3.5 text-cyan-300" />
                <span>{language === 'en' ? 'Send to researchers' : 'Enviar a investigadores'}</span>
              </button>

              <button
                onClick={handleCopySessionData}
                title={language === 'en' ? 'Copy interview summary' : 'Copiar ficha al portapapeles'}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                {copiedSession ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{language === 'en' ? 'Copied!' : '¡Copiado!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-300" />
                    <span>{language === 'en' ? 'Copy' : 'Copiar'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Informant Individual KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Dialog Turns' : 'Turnos Registrados'}</span>
                <MessageSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {individualMetrics.totalTurns}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {individualMetrics.userTurns} {language === 'en' ? 'student' : 'estudiante'} /{' '}
                {individualMetrics.assistantTurns} {language === 'en' ? 'Cereza' : 'Cereza'}
              </p>
            </div>

            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Posture' : 'Postura Hermenéutica'}</span>
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="font-display text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                {individualMetrics.sentimentLabel}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {language === 'en' ? 'Qualitative disposition' : 'Disposición frente a la IA'}
              </p>
            </div>

            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Verbatim Quotes' : 'Citas Textuales'}</span>
                <Quote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {individualMetrics.quotes.length}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {language === 'en' ? 'Extracted for thesis' : 'Para el Capítulo 5'}
              </p>
            </div>

            <div className="aero-card rounded-3xl p-4 sm:p-5 border border-white/90 dark:border-cyan-500/30">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-cyan-200/80">
                <span>{language === 'en' ? 'Identified Challenges' : 'Retos Señalados'}</span>
                <ShieldAlert className="h-4 w-4 text-amber-500" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {individualMetrics.painPoints.length}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-semibold mt-0.5">
                {language === 'en' ? 'Pedagogical friction points' : 'Fricciones o necesidades'}
              </p>
            </div>
          </div>

          {/* Row 1: Individual Donut Chart & Individual Horizontal Bar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Donut of Qualitative Dimensions */}
            <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en'
                      ? 'Discursive Distribution by Dimension'
                      : 'Distribución Dialógica por Dimensión'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {activeSession.studentCode || `E0${safeIndividualIndex + 1}`}
                </span>
              </div>

              <FormsDonutChart
                data={individualMetrics.individualDimensionData}
                centerLabel={`${individualMetrics.totalTurns}`}
                centerSublabel={language === 'en' ? 'Turns' : 'Aportes'}
              />
            </div>

            {/* Chart 2: Thematic Intensity Horizontal Bars */}
            <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en'
                      ? 'Thematic Depth of Contributions'
                      : 'Profundidad Temática de los Aportes'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Capítulo 5</span>
              </div>

              <FormsBarChart
                data={individualMetrics.individualCategoryBarData}
                orientation="horizontal"
                showPercentages={true}
              />
            </div>
          </div>

          {/* Hermeneutic Synthesis Card */}
          <div className="aero-card rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-cyan-900/40">
              <Lightbulb className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'en'
                  ? 'Hermeneutic Synthesis & Cereza Persona Analysis'
                  : 'Síntesis Hermenéutica e Interpretación de Cereza'}
              </h4>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {activeSession.summary?.overview ||
                (language === 'en'
                  ? 'The informant reflects on pedagogical integration, highlighting didactic mediation, critical ethics, and technological empowerment within the Licenciatura en Informática.'
                  : 'El docente en formación expresa sus vivencias en torno a la mediación pedagógica con IA, señalando retos de alfabetización crítica, integridad académica y la necesidad de articular herramientas inteligentes sin perder el rol humano en el aula.')}
            </p>

            {/* Key Insights bullets */}
            {(() => {
              const insights =
                activeSession.summary?.keyThemes ||
                activeSession.summary?.keyInsights ||
                activeSession.summary?.actionableInsights ||
                [];
              if (!insights || insights.length === 0) return null;
              return (
                <div className="pt-2 border-t border-slate-100 dark:border-cyan-900/30 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-cyan-200">
                    {language === 'en' ? 'Key Identified Themes:' : 'Hallazgos Clave Identificados:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {insights.map((insight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>

          {/* Key Challenges / Friction Points identified for this student */}
          {individualMetrics.painPoints.length > 0 && (
            <div className="aero-card rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'en'
                    ? 'Specific Challenges & Needs Expressed by this Informant'
                    : 'Retos, Limitaciones o Necesidades Expresadas por este Informante'}
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {individualMetrics.painPoints.map((point, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-cyan-900/50 text-slate-800 dark:text-cyan-200 shadow-2xs"
                  >
                    <span>{point}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verbatim Quotes Wall for this Informant */}
          {individualMetrics.quotes.length > 0 ? (
            <div className="aero-card rounded-3xl border border-white/90 dark:border-cyan-500/30 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <Quote className="h-4 w-4 text-emerald-600 dark:text-cyan-400" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'en'
                      ? 'Verbatim Quotes for Chapter 5 (This Informant)'
                      : 'Citas Textuales Verbatim para el Capítulo 5 (Este Informante)'}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {individualMetrics.quotes.length} {language === 'en' ? 'quotes' : 'citas'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {individualMetrics.quotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-cyan-900/40 space-y-2 text-xs flex flex-col justify-between"
                  >
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{q.quote}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-cyan-900/30 text-[11px]">
                      <span className="text-slate-400 font-semibold truncate max-w-[200px]">
                        {q.category || 'Aporte Reflexivo'}
                      </span>
                      <button
                        onClick={() => handleCopyQuote(q.quote)}
                        className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                      >
                        {copiedQuote === q.quote ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">
                              {language === 'en' ? 'Copied' : 'Copiada'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>{language === 'en' ? 'Copy quote' : 'Copiar cita'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-cyan-900/40 text-center text-xs text-slate-500 dark:text-cyan-200/70">
              {language === 'en'
                ? 'No direct verbatim quotes extracted for this informant yet. View the full transcript to read their complete answers.'
                : 'Aún no se han indexado citas textuales directas para este informante. Puedes consultar la transcripción completa pulsando "Ver Transcripción".'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
