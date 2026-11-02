import React from 'react';
import { X, GraduationCap, BookOpen, Target, Users, MapPin, Award, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { THESIS_PROJECT_INFO } from '../lib/thesisContext';
import { Language } from '../lib/i18n';

interface ThesisProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const ThesisProjectModal: React.FC<ThesisProjectModalProps> = ({ isOpen, onClose, language = 'es' }) => {
  if (!isOpen) return null;
  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Institution */}
        <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#059669] to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Universidad de Córdoba • {THESIS_PROJECT_INFO.year}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {THESIS_PROJECT_INFO.program}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
              {THESIS_PROJECT_INFO.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Facultad de Educación y Ciencias Humanas — Montería, Córdoba, Colombia
            </p>
          </div>
        </div>

        {/* Authors, Director & Research Line */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px] mb-1">
              Autores (Investigadores)
            </span>
            <div className="space-y-1 font-semibold text-slate-900 dark:text-white">
              {THESIS_PROJECT_INFO.authors.map((author, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{author}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px] mb-1">
              Director del Trabajo
            </span>
            <p className="font-semibold text-slate-900 dark:text-white">
              {THESIS_PROJECT_INFO.director}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              Docente Investigador
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px] mb-1">
              Línea de Investigación
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium">
              {THESIS_PROJECT_INFO.researchLine}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              Sublínea: {THESIS_PROJECT_INFO.subLine}
            </p>
          </div>
        </div>

        {/* Problem Formulation & Qualitative Assumption */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200">
            <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 dark:text-indigo-300 block mb-1">
              Formulación del Problema
            </span>
            <p className="font-medium italic leading-relaxed">
              "{THESIS_PROJECT_INFO.problemFormulation}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-200">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-300 block mb-1">
              Supuesto Cualitativo
            </span>
            <p className="font-medium italic leading-relaxed">
              "{THESIS_PROJECT_INFO.assumption}"
            </p>
          </div>
        </div>

        {/* Research Objectives */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider">
            <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Objetivos de la Investigación</span>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
              <strong className="text-slate-900 dark:text-white block mb-1">Objetivo General:</strong>
              {THESIS_PROJECT_INFO.generalObjective}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <strong className="text-slate-900 dark:text-white block">Objetivos Específicos:</strong>
              {THESIS_PROJECT_INFO.specificObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{i + 1}.</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodological Framework & EduPulse's Role */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] text-slate-700 dark:text-slate-300">
            <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Técnicas de Recolección de Datos (Capítulo 3 y 4)</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>1. Análisis documental:</strong> Matriz institucional y de políticas educativas.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>2. Entrevistas semiestructuradas:</strong> Guion analítico presencial.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>3. Interacción dialógica mediada por IA (EduPulse):</strong> Agente inteligente conversacional (Maya) que promueve un diálogo reflexivo, espontáneo y fluido, libre de la rigidez de cuestionarios cerrados, decidiendo la saturación de los temas.</span>
            </li>
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
            <strong>Marco Legal & Contexto:</strong> {THESIS_PROJECT_INFO.legalFramework} • Muestra intencional: 20 a 40 estudiantes del programa.
          </p>
        </div>

        {/* Methodological Design & Categories Matrix (Table 1) */}
        <div>
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider mb-2">
            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Matriz de Categorías de Análisis (Tabla 1)</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Subcategorías</th>
                  <th className="py-2.5 px-3">Unidades de Análisis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white align-top">Inteligencia Artificial (IA)</td>
                  <td className="py-2.5 px-3 align-top font-medium">Gestión y mediación pedagógica – Dimensión ética y crítica</td>
                  <td className="py-2.5 px-3 align-top">Uso para retroalimentación, optimización de procesos académicos, reflexiones sobre privacidad, responsabilidad, originalidad y sesgos algorítmicos.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white align-top">Formación Docente</td>
                  <td className="py-2.5 px-3 align-top font-medium">Articulación de saberes (Pedagógico, Tecnológico y Ético) – Práctica Reflexiva</td>
                  <td className="py-2.5 px-3 align-top">Cómo se incorporan conocimientos técnicos y pedagógicos en el currículo; mediación consciente, autoeficacia y ética.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white align-top">Efectos de la IA</td>
                  <td className="py-2.5 px-3 align-top font-medium">Impacto en la práctica profesional (Planeación y Creatividad) – Retos y limitaciones formativas</td>
                  <td className="py-2.5 px-3 align-top">Cambios en autonomía ("efecto muleta") y reflexión crítica; barreras de infraestructura tecnológica, conectividad y transición al modelo curricular.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            {isEn ? 'Close Project Information' : 'Entendido / Cerrar Ficha'}
          </button>
        </div>
      </div>
    </div>
  );
};
