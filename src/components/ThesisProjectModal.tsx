import React from 'react';
import { X, GraduationCap, BookOpen, Target, Users, MapPin, Award, CheckCircle2 } from 'lucide-react';
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
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Institution */}
        <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Universidad de Córdoba • 2025
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-indigo-600">
                Licenciatura en Informática con Énfasis en Medios Audiovisuales
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 leading-snug">
              {THESIS_PROJECT_INFO.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Facultad de Educación y Ciencias Humanas — Montería, Córdoba, Colombia
            </p>
          </div>
        </div>

        {/* Authors & Research Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px] mb-1">
              Autores / Investigadores Principales
            </span>
            <div className="space-y-1 font-semibold text-slate-900">
              {THESIS_PROJECT_INFO.authors.map((author, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{author}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px] mb-1">
              Línea de Investigación
            </span>
            <p className="text-slate-800 font-medium">
              {THESIS_PROJECT_INFO.researchLine}
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Sublínea: {THESIS_PROJECT_INFO.subLine}
            </p>
          </div>
        </div>

        {/* Problem Formulation & Assumption */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950">
            <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 block mb-1">
              Formulación del Problema
            </span>
            <p className="font-medium italic leading-relaxed">
              "{THESIS_PROJECT_INFO.problemFormulation}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 block mb-1">
              Supuesto Cualitativo
            </span>
            <p className="font-medium italic leading-relaxed">
              "{THESIS_PROJECT_INFO.assumption}"
            </p>
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Target className="h-4 w-4 text-indigo-600" />
            <span>Objetivos de la Investigación</span>
          </div>

          <div className="text-xs text-slate-700 space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block mb-1">Objetivo General:</strong>
              {THESIS_PROJECT_INFO.generalObjective}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <strong className="text-slate-900 block">Objetivos Específicos:</strong>
              {THESIS_PROJECT_INFO.specificObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 shrink-0">{i + 1}.</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methodological Design & Categories Matrix */}
        <div>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider mb-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            <span>Matriz de Categorías de Análisis (Tabla 1)</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Subcategorías</th>
                  <th className="py-2.5 px-3">Unidades de Análisis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 align-top">Inteligencia Artificial (IA)</td>
                  <td className="py-2.5 px-3 align-top font-medium">Gestión y mediación pedagógica – Dimensión ética y crítica</td>
                  <td className="py-2.5 px-3 align-top">Uso de IA para retroalimentación, optimización académica, reflexiones sobre privacidad, responsabilidad y sesgos.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 align-top">Formación Docente</td>
                  <td className="py-2.5 px-3 align-top font-medium">Articulación de saberes (Pedagógico, Tecnológico y Ético) – Práctica Reflexiva</td>
                  <td className="py-2.5 px-3 align-top">Cómo se incorporan conocimientos técnicos y pedagógicos en el currículo; mediación consciente y ética.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900 align-top">Efectos de la IA</td>
                  <td className="py-2.5 px-3 align-top font-medium">Impacto en la práctica profesional (Planeación y Creatividad) – Retos y limitaciones formativas</td>
                  <td className="py-2.5 px-3 align-top">Cambios en autonomía y reflexión crítica; barreras de infraestructura, conectividad y falta de capacitación formal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            {isEn ? 'Close Project Information' : 'Entendido / Cerrar Ficha'}
          </button>
        </div>
      </div>
    </div>
  );
};
