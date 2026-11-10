import React, { useEffect } from 'react';
import { X, GraduationCap, BookOpen, Target, Users, MapPin, Award, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { THESIS_PROJECT_INFO } from '../lib/thesisContext';
import { Language } from '../lib/i18n';

interface ThesisProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const ThesisProjectModal: React.FC<ThesisProjectModalProps> = ({ isOpen, onClose, language = 'es' }) => {
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const isEn = language === 'en';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      {/* Outer Modal Shell: provides the rounded-3xl frosted glass frame and pins header/footer */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="aero-glass rounded-3xl max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[88vh] text-slate-900 dark:text-slate-100 border border-white/90 dark:border-cyan-500/40 overflow-hidden"
      >
        {/* Sticky Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-200/60 dark:border-cyan-800/40 shrink-0 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-start gap-3.5">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/80 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
              <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 relative z-10" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/70 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                  {isEn ? 'University of Córdoba' : 'Universidad de Córdoba'} • {THESIS_PROJECT_INFO.year}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                  {isEn ? 'Bachelor in Computer Science Education' : THESIS_PROJECT_INFO.program}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                {isEn
                  ? 'Qualitative Dialogic Interaction Mediated by AI for Pedagogical Research'
                  : THESIS_PROJECT_INFO.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-cyan-200/70 mt-0.5 font-medium">
                {isEn
                  ? 'Faculty of Education and Human Sciences — Montería, Córdoba, Colombia'
                  : 'Facultad de Educación y Ciencias Humanas — Montería, Córdoba, Colombia'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 transition cursor-pointer shrink-0"
            aria-label={isEn ? 'Close modal' : 'Cerrar modal'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body (Contained cleanly inside with delicate scrollbar) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 overscroll-contain modal-scroll">
          {/* Authors, Director & Research Line */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 aero-card p-4 rounded-2xl text-xs border border-white/80 dark:border-cyan-800/50">
            <div>
              <span className="font-extrabold text-emerald-700 dark:text-cyan-300 block uppercase tracking-wider text-[10px] mb-1">
                {isEn ? 'Authors (Researchers)' : 'Autores (Investigadores)'}
              </span>
              <div className="space-y-1 font-semibold text-slate-900 dark:text-white">
                {THESIS_PROJECT_INFO.authors.map((author, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-xs" />
                    <span>{author}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-extrabold text-emerald-700 dark:text-cyan-300 block uppercase tracking-wider text-[10px] mb-1">
                {isEn ? 'Thesis Director / Advisor' : 'Director del Trabajo'}
              </span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {THESIS_PROJECT_INFO.director}
              </p>
              <p className="text-slate-500 dark:text-cyan-200/70 text-[11px] mt-0.5">
                {isEn ? 'Research Professor' : 'Docente Investigador'}
              </p>
            </div>

            <div>
              <span className="font-extrabold text-emerald-700 dark:text-cyan-300 block uppercase tracking-wider text-[10px] mb-1">
                {isEn ? 'Research Line' : 'Línea de Investigación'}
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {isEn ? 'Education, Technology and Pedagogical Innovation' : THESIS_PROJECT_INFO.researchLine}
              </p>
              <p className="text-slate-500 dark:text-cyan-200/70 text-[11px] mt-0.5">
                {isEn ? 'Subline: ' : 'Sublínea: '}{THESIS_PROJECT_INFO.subLine}
              </p>
            </div>
          </div>

          {/* Problem Formulation & Qualitative Assumption */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-900/60 text-xs text-cyan-950 dark:text-cyan-200 shadow-xs">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-cyan-800 dark:text-cyan-300 block mb-1">
                {isEn ? 'Problem Formulation' : 'Formulación del Problema'}
              </span>
              <p className="font-medium italic leading-relaxed">
                "{isEn
                  ? 'How does the mediation of Generative AI influence the didactic training, pedagogical practices, and ethical perspectives of teachers-in-training in the Bachelor of Computer Science at the University of Córdoba?'
                  : THESIS_PROJECT_INFO.problemFormulation}"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-950 dark:text-emerald-200 shadow-xs">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-800 dark:text-emerald-300 block mb-1">
                {isEn ? 'Qualitative Assumption' : 'Supuesto Cualitativo'}
              </span>
              <p className="font-medium italic leading-relaxed">
                "{isEn
                  ? 'AI integration reconfigures pedagogical design, self-efficacy, and critical reflection among pre-service teachers, moving beyond instrumental adoption towards emergent ethical dilemmas.'
                  : THESIS_PROJECT_INFO.assumption}"
              </p>
            </div>
          </div>

          {/* Research Objectives */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider">
              <Target className="h-4 w-4 text-emerald-600 dark:text-cyan-400" />
              <span>{isEn ? 'Research Objectives' : 'Objetivos de la Investigación'}</span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="p-3.5 aero-card rounded-2xl">
                <strong className="text-slate-900 dark:text-white block mb-1">
                  {isEn ? 'General Objective:' : 'Objetivo General:'}
                </strong>
                {isEn
                  ? 'Analyze the pedagogical, didactic, and ethical meanings and practices constructed by pre-service teachers in the Bachelor of Computer Science at the University of Córdoba regarding generative AI.'
                  : THESIS_PROJECT_INFO.generalObjective}
              </div>

              <div className="p-3.5 aero-card rounded-2xl space-y-2">
                <strong className="text-slate-900 dark:text-white block">
                  {isEn ? 'Specific Objectives:' : 'Objetivos Específicos:'}
                </strong>
                {(isEn
                  ? [
                      'Characterize current student practices, perceptions, and uses of artificial intelligence tools in teacher training.',
                      'Analyze pre-service teachers reflections on pedagogical mediation, didactic self-efficacy, and ethical dilemmas associated with AI.',
                      'Triangulate documentary findings, quantitative instrument assessments, and qualitative AI-mediated dialogic interactions to understand educational impact.',
                    ]
                  : THESIS_PROJECT_INFO.specificObjectives
                ).map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-extrabold text-emerald-600 dark:text-cyan-400 shrink-0">{i + 1}.</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Methodological Framework & EduPulse's Role */}
          <div className="p-4 rounded-2xl aero-card space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-cyan-300">
              <Cpu className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>
                {isEn
                  ? 'Data Collection Techniques (Chapters 3 & 4)'
                  : 'Técnicas de Recolección de Datos (Capítulo 3 y 4)'}
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>1. {isEn ? 'Documentary analysis:' : 'Análisis documental:'}</strong>{' '}
                  {isEn
                    ? 'Institutional curriculum and educational policy matrix.'
                    : 'Matriz institucional y de políticas educativas.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>2. {isEn ? 'Semi-structured interviews:' : 'Entrevistas semiestructuradas:'}</strong>{' '}
                  {isEn
                    ? 'In-person analytical guide and field notes.'
                    : 'Guion analítico presencial.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>3. {isEn ? 'AI-Mediated Dialogic Interaction (EduPulse):' : 'Interacción dialógica mediada por IA (EduPulse):'}</strong>{' '}
                  {isEn
                    ? 'Conversational AI agent (Cereza) facilitating reflective, spontaneous dialogue, free of closed questionnaire bias, reaching thematic saturation.'
                    : 'Agente inteligente conversacional (Cereza) que promueve un diálogo reflexivo, espontáneo y fluido, libre de la rigidez de cuestionarios cerrados, decidiendo la saturación de los temas.'}
                </span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 dark:text-cyan-200/70 pt-1 border-t border-slate-200/60 dark:border-cyan-800/40">
              <strong>{isEn ? 'Legal Framework & Context:' : 'Marco Legal & Contexto:'}</strong>{' '}
              {THESIS_PROJECT_INFO.legalFramework} • {isEn ? 'Purposive sample: 20 to 40 pre-service students.' : 'Muestra intencional: 20 a 40 estudiantes del programa.'}
            </p>
          </div>

          {/* Methodological Design & Categories Matrix (Table 1) */}
          <div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-cyan-400" />
              <span>
                {isEn
                  ? 'Analytical Categories Matrix (Table 1)'
                  : 'Matriz de Categorías de Análisis (Tabla 1)'}
              </span>
            </div>

            <div className="overflow-x-auto border border-cyan-200/80 dark:border-cyan-800/60 rounded-2xl text-xs shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cyan-100/70 dark:bg-cyan-950/80 text-cyan-950 dark:text-cyan-100 font-bold border-b border-cyan-200/80 dark:border-cyan-800/60">
                    <th className="py-2.5 px-3">{isEn ? 'Category' : 'Categoría'}</th>
                    <th className="py-2.5 px-3">{isEn ? 'Subcategories' : 'Subcategorías'}</th>
                    <th className="py-2.5 px-3">{isEn ? 'Units of Analysis' : 'Unidades de Análisis'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100/60 dark:divide-cyan-900/40 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white align-top">
                      {isEn ? 'Artificial Intelligence (AI)' : 'Inteligencia Artificial (IA)'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-medium">
                      {isEn
                        ? 'Pedagogical mediation & management – Ethical and critical dimension'
                        : 'Gestión y mediación pedagógica – Dimensión ética y crítica'}
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'Feedback usage, optimization of academic workflows, reflections on data privacy, accountability, originality, and algorithmic bias.'
                        : 'Uso para retroalimentación, optimización de procesos académicos, reflexiones sobre privacidad, responsabilidad, originalidad y sesgos algorítmicos.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white align-top">
                      {isEn ? 'Teacher Education' : 'Formación Docente'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-medium">
                      {isEn
                        ? 'Knowledge articulation (Pedagogical, Technological, Ethical) – Reflective Practice'
                        : 'Articulación de saberes (Pedagógico, Tecnológico y Ético) – Práctica Reflexiva'}
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'Incorporation of technical and pedagogical knowledge into the syllabus; deliberate mediation, didactic self-efficacy, and ethics.'
                        : 'Cómo se incorporan conocimientos técnicos y pedagógicos en el currículo; mediación consciente, autoeficacia y ética.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white align-top">
                      {isEn ? 'Effects of AI' : 'Efectos de la IA'}
                    </td>
                    <td className="py-2.5 px-3 align-top font-medium">
                      {isEn
                        ? 'Impact on professional practice (Planning & Creativity) – Formative challenges and limits'
                        : 'Impacto en la práctica profesional (Planeación y Creatividad) – Retos y limitaciones formativas'}
                    </td>
                    <td className="py-2.5 px-3 align-top">
                      {isEn
                        ? 'Changes in autonomy ("crutch effect") and critical thinking; digital infrastructure barriers, connectivity, and curriculum alignment.'
                        : 'Cambios en autonomía ("efecto muleta") y reflexión crítica; barreras de infraestructura tecnológica, conectividad y transición al modelo curricular.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pinned Bottom Footer Action */}
        <div className="flex justify-end p-4 sm:px-7 border-t border-slate-200/60 dark:border-cyan-800/40 shrink-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <button
            onClick={onClose}
            className="btn-aero-cyan px-6 py-2 rounded-full text-white font-extrabold text-xs shadow-md transition cursor-pointer"
          >
            {isEn ? 'Close Project Information' : 'Entendido / Cerrar Ficha'}
          </button>
        </div>
      </div>
    </div>
  );
};
