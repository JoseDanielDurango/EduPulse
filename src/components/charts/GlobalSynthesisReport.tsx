import React, { useState, useMemo } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Mail,
  GraduationCap,
  Users,
  MessageCircle,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowRight,
  TrendingUp,
  Brain,
  Quote,
  CheckCircle2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { InterviewSession } from '../../types';
import { InstrumentResponse } from '../../types/instruments';
import { Language } from '../../lib/i18n';
import {
  GlobalSynthesisData,
  generateDeterministicGlobalSynthesis,
} from '../../lib/globalAnalysisSynthesis';

interface GlobalSynthesisReportProps {
  sessions: InterviewSession[];
  instrumentResponses?: InstrumentResponse[];
  language: Language;
}

export const GlobalSynthesisReport: React.FC<GlobalSynthesisReportProps> = ({
  sessions,
  instrumentResponses = [],
  language,
}) => {
  const [activeSection, setActiveSection] = useState<
    'executive' | 'dimensions' | 'triangulation' | 'quotes' | 'recommendations'
  >('executive');
  const [hasCopied, setHasCopied] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomSummary, setAiCustomSummary] = useState<string | null>(null);

  const isEn = language === 'en';

  // Base deterministic synthesis
  const synthesisData: GlobalSynthesisData = useMemo(() => {
    return generateDeterministicGlobalSynthesis(sessions, instrumentResponses, language);
  }, [sessions, instrumentResponses, language]);

  // Handle Copy Full Report for Word/Docs
  const handleCopyReport = () => {
    let report = `# EDUPULSE v2.3 · INFORME MACRO-CUALITATIVO Y TRIANGULACIÓN (QUAN + QUAL)\n`;
    report += `Universidad de Córdoba · Licenciatura en Informática · Trabajo de Grado\n`;
    report += `Generado el: ${synthesisData.generatedAt}\n\n`;
    report += `========================================================================\n\n`;
    report += `## 1. FICHA METODOLÓGICA Y MUESTRA CONSOLIDADA\n`;
    report += `- Total de Entrevistas Semiestructuradas (Cereza): ${synthesisData.totalInterviews}\n`;
    report += `- Total de Instrumentos Diagnósticos Cuantitativos: ${synthesisData.totalDiagnostics}\n`;
    report += `- Total de Turnos Dialógicos Registrados: ${synthesisData.totalDialogueTurns}\n`;
    report += `- Sedes Universitarias Cubiertas: ${synthesisData.campusesRepresented.join(', ') || 'Montería'}\n`;
    report += `- Semestres Representados: ${synthesisData.semestersRepresented.join(', ') || '1° a 10°'}\n`;
    report += `- Estado de Saturación Teórica: ${synthesisData.theoreticalSaturationStatus}\n`;
    report += `- Postura Emocional y Reflexiva: ${synthesisData.overallSentiment}\n\n`;

    report += `## 2. SÍNTESIS EJECUTIVA TRANSVERSAL\n`;
    report += `${aiCustomSummary || synthesisData.executiveSummary}\n\n`;

    report += `## 3. META-ANÁLISIS POR DIMENSIONES CUALITATIVAS\n\n`;
    synthesisData.dimensions.forEach((dim) => {
      report += `### ${dim.title} (${dim.category})\n`;
      report += `${dim.narrative}\n\n`;
      report += `Hallazgos Clave:\n`;
      dim.keyFindings.forEach((f) => (report += `- ${f}\n`));
      report += `\nCitas Textuales Verbatim:\n`;
      dim.sampleQuotes.forEach((q) => {
        report += `> "${q.quote}" — [${q.studentCode}] (${q.semester}, ${q.campus})\n`;
      });
      if (dim.convergentQuantData) {
        report += `\nEvidencia Cuantitativa Convergente:\n${dim.convergentQuantData}\n`;
      }
      report += `\n------------------------------------------------------------------------\n\n`;
    });

    report += `## 4. MATRIZ DE TRIANGULACIÓN CONCURRENTE (QUAN + QUAL)\n\n`;
    synthesisData.triangulationMatrix.forEach((t, idx) => {
      report += `Eje ${idx + 1}: ${t.axis}\n`;
      report += `- Indicador Cuantitativo (Encuestas): ${t.quantitativeIndicator}\n`;
      report += `- Emergencia Cualitativa (Cereza): ${t.qualitativeEmergence}\n`;
      report += `- Conclusión Hermenéutica: ${t.hermeneuticConclusion}\n\n`;
    });

    report += `## 5. EVALUACIÓN DEL "EFECTO MULETA" (BASTANI ET AL., 2024)\n`;
    report += `Nivel de Conciencia: ${synthesisData.crutchEffectEvaluation.awarenessLevel}\n`;
    report += `Áreas de Riesgo Identificadas:\n`;
    synthesisData.crutchEffectEvaluation.riskAreas.forEach((r) => (report += `- ${r}\n`));
    report += `Estrategias Preventivas de los Informantes:\n`;
    synthesisData.crutchEffectEvaluation.preventiveStrategiesObserved.forEach((p) => (report += `- ${p}\n`));
    report += `Implicación Didáctica: ${synthesisData.crutchEffectEvaluation.pedagogicalImplication}\n\n`;

    report += `## 6. LINEAMIENTOS Y RECOMENDACIONES POLÍTICO-PEDAGÓGICAS\n`;
    synthesisData.institutionalRecommendations.forEach((rec, idx) => {
      report += `${idx + 1}. ${rec}\n`;
    });

    navigator.clipboard.writeText(report);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2500);
  };

  // Handle Download Report as File (.doc / .txt)
  const handleDownloadFile = () => {
    let report = `EDUPULSE v2.3 - INFORME GENERAL DE SÍNTESIS Y TRIANGULACIÓN\n`;
    report += `Universidad de Córdoba - Licenciatura en Informática\n`;
    report += `Fecha: ${synthesisData.generatedAt}\n\n`;
    report += `========================================================================\n\n`;
    report += `1. SÍNTESIS EJECUTIVA:\n${aiCustomSummary || synthesisData.executiveSummary}\n\n`;
    report += `2. DIMENSIONES CUALITATIVAS:\n`;
    synthesisData.dimensions.forEach((d) => {
      report += `\n-- ${d.title} --\n${d.narrative}\n`;
      d.sampleQuotes.forEach((q) => {
        report += `Cita [${q.studentCode}]: "${q.quote}"\n`;
      });
    });
    report += `\n3. RECOMENDACIONES INSTITUCIONALES:\n`;
    synthesisData.institutionalRecommendations.forEach((r, i) => {
      report += `${i + 1}. ${r}\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduPulse_Informe_General_Sintesis_${new Date().toISOString().slice(0, 10)}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Email to Researchers
  const handleEmailReport = () => {
    const subject = `[EduPulse] Informe General de Síntesis y Triangulación (${sessions.length} entrevistas)`;
    const body = `EDUPULSE - SÍNTESIS GENERAL DE INVESTIGACIÓN\nTotal entrevistas: ${sessions.length}\nTotal diagnósticos: ${instrumentResponses.length}\n\nSÍNTESIS EJECUTIVA:\n${synthesisData.executiveSummary.slice(0, 1200)}...\n\n(Revisar informe completo en la plataforma EduPulse)`;
    const mailto = `mailto:josedudaca@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
  };

  // Handle AI Regeneration with Gemini
  const handleRegenerateWithAI = async () => {
    if (sessions.length === 0) return;
    setIsGeneratingAI(true);
    try {
      const resp = await fetch('/api/global-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessions,
          instrumentResponses,
          language,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.executiveSummary) {
          setAiCustomSummary(data.executiveSummary);
        }
      }
    } catch (err) {
      console.warn('AI global analysis error, keeping deterministic synthesis:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Hero Header Card with Frutiger Aero Aesthetics */}
      <div className="aero-card rounded-3xl p-6 sm:p-7 shadow-lg border border-white/90 dark:border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-100/80 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60 shadow-2xs">
                {isEn ? 'META-ANALYSIS & TRIANGULATION' : 'META-ANÁLISIS Y TRIANGULACIÓN GENERAL'}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
                QUAN + QUAL · TABLE 1 ALIGNED
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              <span className="aero-gradient-text">
                {isEn
                  ? 'Integrated Research Synthesis & Macro Qualitative Report'
                  : 'Informe General de Síntesis Hermenéutica y Triangulación'}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-cyan-100/70 font-medium leading-relaxed">
              {isEn
                ? 'Consolidated written analysis across all dialogues with Cereza, Likert psychometric instruments, and pedagogical tensions recorded in the Bachelor in Computer Science Education.'
                : 'Análisis cualitativo y cuantitativo transversal consolidado de todas las conversaciones con Cereza, cuestionarios diagnósticos y vivencias pedagógicas en la Universidad de Córdoba.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyReport}
              className="btn-aero-glass px-4 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Copiar informe completo para Word o Google Docs"
            >
              {hasCopied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {isEn ? 'Copied to Clipboard!' : '¡Copiado al Portapapeles!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{isEn ? 'Copy Full Report' : 'Copiar Informe'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="btn-aero-cyan px-4 py-2.5 rounded-full text-xs font-bold text-white transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Descargar informe en formato texto / Word"
            >
              <Download className="h-4 w-4" />
              <span>{isEn ? 'Download (.doc)' : 'Descargar (.doc)'}</span>
            </button>

            <button
              onClick={handleRegenerateWithAI}
              disabled={isGeneratingAI || sessions.length === 0}
              className="btn-aero-green px-4 py-2.5 rounded-full text-xs font-bold text-white transition shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Solicitar a Gemini un meta-resumen actualizado con IA"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? (isEn ? 'Synthesizing...' : 'Sintetizando...') : (isEn ? 'AI Deep Refresh' : 'Regenerar con IA')}</span>
            </button>
          </div>
        </div>

        {/* Meta-KPIs Grid Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-slate-200/80 dark:border-cyan-800/50">
          <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-cyan-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80 block">
              {isEn ? 'Interviews' : 'Entrevistas Cereza'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-300">
              {synthesisData.totalInterviews}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-cyan-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80 block">
              {isEn ? 'Diagnostics' : 'Cuestionarios Likert'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-300">
              {synthesisData.totalDiagnostics}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-cyan-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80 block">
              {isEn ? 'Dialogue Turns' : 'Turnos Registrados'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-300">
              {synthesisData.totalDialogueTurns}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-cyan-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80 block">
              {isEn ? 'Campuses' : 'Sedes Representadas'}
            </span>
            <span className="font-display text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-300">
              {synthesisData.campusesRepresented.length || 1}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-cyan-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80 block">
              {isEn ? 'Semesters' : 'Rango Formativo'}
            </span>
            <span className="font-display text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-300">
              {synthesisData.semestersRepresented.length ? `${synthesisData.semestersRepresented[0]}-${synthesisData.semestersRepresented[synthesisData.semestersRepresented.length - 1]}` : '1°-10°'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-cyan-900/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80 block">
              {isEn ? 'Saturation' : 'Saturación'}
            </span>
            <span className="font-display text-xs font-bold text-emerald-700 dark:text-emerald-300 block truncate" title={synthesisData.theoreticalSaturationStatus}>
              {synthesisData.totalInterviews >= 6 ? (isEn ? 'High Saturation' : 'Alta Saturación') : (isEn ? 'Exploratory' : 'Fase Emergente')}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-cyan-900/40">
        {[
          { id: 'executive', label: isEn ? 'Executive Synthesis' : 'Síntesis Ejecutiva', icon: FileText },
          { id: 'dimensions', label: isEn ? 'Thematic Dimensions (Cereza)' : 'Dimensiones Cualitativas', icon: Brain },
          { id: 'triangulation', label: isEn ? 'QUAN + QUAL Triangulation' : 'Triangulación Mixta', icon: TrendingUp },
          { id: 'quotes', label: isEn ? 'Student Voices & Quotes' : 'Voces y Citas Emblemáticas', icon: Quote },
          { id: 'recommendations', label: isEn ? 'Curriculum Recommendations' : 'Recomendaciones Curriculares', icon: Lightbulb },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'btn-aero-cyan text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: EXECUTIVE SYNTHESIS */}
      {activeSection === 'executive' && (
        <div className="space-y-6">
          <div className="aero-card rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm border border-white/90 dark:border-cyan-500/30">
            <div className="flex items-center gap-2.5 text-cyan-600 dark:text-cyan-300">
              <BookOpen className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isEn ? 'Executive Macro-Synthesis of Qualitative Findings' : 'Síntesis Ejecutiva Transversal de Hallazgos'}
              </h3>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-body whitespace-pre-line bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              {aiCustomSummary || synthesisData.executiveSummary}
            </div>

            {/* Crutch Effect Special Callout Box */}
            <div className="mt-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs sm:text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  {isEn
                    ? 'Diagnosis on the "Crutch Effect" (Bastani et al., 2024)'
                    : 'Diagnóstico sobre el "Efecto Muleta" (Bastani et al., 2024)'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-body">
                {synthesisData.crutchEffectEvaluation.pedagogicalImplication}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-amber-400/30">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 block mb-1">
                    {isEn ? 'Identified Cognitive Risks:' : 'Riesgos de Pasividad Detectados:'}
                  </span>
                  <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {synthesisData.crutchEffectEvaluation.riskAreas.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-400/30">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                    {isEn ? 'Student Counter-Strategies:' : 'Estrategias de Resistencia de los Estudiantes:'}
                  </span>
                  <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {synthesisData.crutchEffectEvaluation.preventiveStrategiesObserved.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Territorial Contrast Card */}
            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-bold text-xs sm:text-sm">
                <MapPin className="h-4 w-4" />
                <span>{isEn ? 'Territorial Context Disparity (Córdoba)' : 'Disparidad Territorial (Montería vs Sedes Regionales)'}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-body">
                {synthesisData.territorialDisparities.digitalDivideFactor}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: THEMATIC DIMENSIONS */}
      {activeSection === 'dimensions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {synthesisData.dimensions.map((dim) => (
            <div
              key={dim.id}
              className="aero-card rounded-3xl p-6 space-y-4 shadow-sm border border-white/90 dark:border-cyan-500/30 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-300/60">
                    {dim.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isEn ? 'Validated' : 'Saturado'}
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {dim.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-body">
                  {dim.narrative}
                </p>

                <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-cyan-200 block">
                    {isEn ? 'Key Findings:' : 'Hallazgos Clave de la Dimensión:'}
                  </span>
                  <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                    {dim.keyFindings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sample Quote */}
              {dim.sampleQuotes.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border border-cyan-500/20 text-xs italic font-body text-slate-800 dark:text-cyan-100/90 relative">
                  <Quote className="h-4 w-4 text-cyan-500/40 absolute top-2 right-2" />
                  <p className="pr-4 leading-relaxed font-normal">
                    "{dim.sampleQuotes[0].quote}"
                  </p>
                  <span className="block mt-1 text-[10px] font-bold not-italic text-slate-500 dark:text-cyan-300/80">
                    — Informante [{dim.sampleQuotes[0].studentCode}] · {dim.sampleQuotes[0].semester} ({dim.sampleQuotes[0].campus})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: TRIANGULATION MATRIX (QUAN + QUAL) */}
      {activeSection === 'triangulation' && (
        <div className="aero-card rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {isEn ? 'Concurrent Methodological Triangulation Matrix' : 'Matriz de Triangulación Metodológica Concurrente'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-cyan-200/70">
                {isEn
                  ? 'Contrasting psychometric Likert indicators against verbatim qualitative emergence from Cereza.'
                  : 'Cruce sistemático entre los indicadores cuantitativos de los cuestionarios y las emergencias dialógicas de Cereza.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-cyan-300 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Eje Temático</th>
                  <th className="py-3 px-3">Indicador Cuantitativo (QUAN)</th>
                  <th className="py-3 px-3">Emergencia Cualitativa (QUAL - Cereza)</th>
                  <th className="py-3 px-3">Conclusión Hermenéutica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {synthesisData.triangulationMatrix.map((t, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition">
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white align-top max-w-[160px]">
                      {t.axis}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-800 dark:text-emerald-300 align-top max-w-[200px] leading-relaxed">
                      <span className="inline-block p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                        {t.quantitativeIndicator}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-cyan-900 dark:text-cyan-200 align-top max-w-[220px] leading-relaxed">
                      {t.qualitativeEmergence}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300 align-top max-w-[220px] leading-relaxed">
                      {t.hermeneuticConclusion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: STUDENT VOICES & QUOTES */}
      {activeSection === 'quotes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {isEn ? 'Curated Verbatim Quotes Repository' : 'Repositorio Curado de Citas Textuales Verbatim'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-cyan-300/80 font-medium">
              Organizadas por informante y semestre
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synthesisData.dimensions.flatMap((d) => d.sampleQuotes).map((q, idx) => (
              <div
                key={idx}
                className="aero-card rounded-2xl p-4.5 space-y-2.5 border border-white/80 dark:border-cyan-800/40 relative group hover:border-cyan-400/60 transition"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-cyan-300 font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300">
                    Informante [{q.studentCode}]
                  </span>
                  <span>{q.semester} • {q.campus}</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 italic font-body leading-relaxed quote-reflexive">
                  "{q.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: RECOMMENDATIONS */}
      {activeSection === 'recommendations' && (
        <div className="aero-card rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm border border-white/90 dark:border-cyan-500/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="h-5 w-5" />
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {isEn
                ? 'Strategic Curricular Directives for Universidad de Córdoba'
                : 'Lineamientos y Recomendaciones para el Comité Curricular'}
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {isEn
              ? 'Proposals synthesized from empirical dialogues and psychometric metrics for reforming the Bachelor in Computer Science Education under Law 2626 of 2026.'
              : 'Directrices generadas a partir de la triangulación empírica de este trabajo de grado para actualizar el plan de estudios y las prácticas docentes de la Licenciatura.'}
          </p>

          <div className="space-y-3 pt-2">
            {synthesisData.institutionalRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-cyan-900/40 flex items-start gap-3.5"
              >
                <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-body leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
