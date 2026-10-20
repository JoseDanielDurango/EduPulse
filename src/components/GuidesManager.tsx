import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  Target,
  GraduationCap,
} from 'lucide-react';
import { InterviewGuide, InterviewQuestion } from '../types';
import { saveGuide } from '../lib/firebase';
import { Language, translations } from '../lib/i18n';

interface GuidesManagerProps {
  guides: InterviewGuide[];
  onSelectGuideForSession: (guide: InterviewGuide) => void;
  language?: Language;
}

export const GuidesManager: React.FC<GuidesManagerProps> = ({
  guides,
  onSelectGuideForSession,
  language = 'es',
}) => {
  const t = translations[language];
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetPersona, setTargetPersona] = useState('Docentes en formación (Licenciatura en Informática)');
  const [goalsInput, setGoalsInput] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([
    {
      id: 'q1',
      category: 'Inteligencia Artificial (IA)',
      subCategory: 'Gestión y mediación pedagógica',
      topic: 'Uso de Herramientas de IA en Actividades de la Licenciatura',
      question: '¿De qué manera incorporas herramientas de inteligencia artificial en tus actividades académicas y prácticas pedagógicas de la Licenciatura?',
      probingTips: 'Pregunta qué herramientas específicas utiliza, en qué asignaturas y con qué frecuencia.',
      objectiveLink: 'Objetivo Específico 1: Identificar prácticas actuales.',
    },
    {
      id: 'q2',
      category: 'Formación Docente',
      subCategory: 'Articulación de saberes',
      topic: 'Articulación Pedagógica y Tecnológica',
      question: '¿Cómo consideras que se articulan los saberes pedagógicos con el conocimiento técnico de la inteligencia artificial en el currículo de la Licenciatura en Informática con Énfasis en Medios Audiovisuales?',
      probingTips: 'Pide ejemplos si se enseña con enfoque didáctico o puramente instrumental.',
      objectiveLink: 'Objetivo Específico 3: Evaluar competencias pedagógicas y tecnológicas.',
    },
    {
      id: 'q3',
      category: 'Efectos de la IA',
      subCategory: 'Retos y limitaciones formativas',
      topic: 'Limitaciones y Brechas en la Universidad de Córdoba',
      question: '¿Cuáles han sido las mayores dificultades, limitaciones o vacíos que has enfrentado (conectividad, infraestructura, falta de capacitación formal)?',
      probingTips: 'Indaga en el contexto regional (Montería, sedes o centros de tutoría) y acceso a equipos.',
      objectiveLink: 'Objetivo Específico 3: Evaluar limitaciones y barreras.',
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        category: 'Inteligencia Artificial (IA)',
        subCategory: 'Dimensión ética y crítica',
        topic: `Tema ${questions.length + 1}`,
        question: '',
        probingTips: 'Pedir ejemplos concretos en clases o prácticas pedagógicas.',
        objectiveLink: 'Objetivo Específico del Estudio',
      },
    ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof InterviewQuestion, val: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: val };
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveCustomGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.some((q) => !q.question.trim())) {
      alert('Por favor proporciona un título y asegúrate de que todas las preguntas tengan texto.');
      return;
    }

    const newGuide: InterviewGuide = {
      id: `guide-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Guion personalizado de entrevista cualitativa.',
      targetPersona: targetPersona.trim() || 'Estudiantes y Docentes en formación',
      researchGoals: goalsInput.split('\n').map((g) => g.trim()).filter(Boolean),
      institutionalContext: 'Universidad de Córdoba - Montería, Colombia',
      questions,
      isTemplate: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveGuide(newGuide);
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setGoalsInput('');
    } catch (err) {
      console.error('Error saving guide:', err);
      alert('No se pudo guardar la guía.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Guiones e Instrumentos Cualitativos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Metodología de Grado
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Guiones semiestructurados para recolección hermenéutica en la Universidad de Córdoba.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isCreating ? 'Cerrar Creador' : 'Crear Guion'}</span>
        </button>
      </div>

      {/* Form to Create Custom Guide */}
      {isCreating && (
        <form
          onSubmit={handleSaveCustomGuide}
          className="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-700 rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Diseñar Guion de Entrevista Semiestructurada</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Las preguntas deben alinearse con las categorías institucionales: Inteligencia Artificial, Formación Docente y Efectos de la IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Título del Guion *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Guion para Egresados de la Licenciatura"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Población / Informantes
              </label>
              <input
                type="text"
                value={targetPersona}
                onChange={(e) => setTargetPersona(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Objetivos Específicos que Responde (Uno por línea)
              </label>
              <textarea
                rows={2}
                placeholder="Identificar prácticas actuales con IA&#10;Evaluar beneficios en el desarrollo de competencias pedagógicas"
                value={goalsInput}
                onChange={(e) => setGoalsInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dynamic Questions Builder with Thesis Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Preguntas de la Entrevista ({questions.length})
              </label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Agregar Pregunta</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300">Pregunta {idx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                        Categoría de Análisis
                      </label>
                      <select
                        value={q.category}
                        onChange={(e) => handleUpdateQuestion(idx, 'category', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Inteligencia Artificial (IA)">Inteligencia Artificial (IA)</option>
                        <option value="Formación Docente">Formación Docente</option>
                        <option value="Efectos de la IA">Efectos de la IA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                        Subcategoría
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Dimensión ética y crítica"
                        value={q.subCategory}
                        onChange={(e) => handleUpdateQuestion(idx, 'subCategory', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                        Tema Específico
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Privacidad y Sesgos"
                        value={q.topic}
                        onChange={(e) => handleUpdateQuestion(idx, 'topic', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                      Pregunta Abierta para el Informante *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pregunta abierta y dialógica que formulará la entrevistadora..."
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-0.5">
                      Orientaciones para Repreguntar (Probing)
                    </label>
                    <input
                      type="text"
                      placeholder="Pautas para que la IA repregunte si la respuesta es breve (ej. pedir ejemplos en clases de la Licenciatura)."
                      value={q.probingTips}
                      onChange={(e) => handleUpdateQuestion(idx, 'probingTips', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm cursor-pointer"
            >
              Guardar Guion
            </button>
          </div>
        </form>
      )}

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.map((g) => (
          <div
            key={g.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {g.isTemplate ? 'Instrumento Oficial de Tesis' : 'Guion Complementario'}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  {g.questions.length} Preguntas
                </span>
              </div>

              <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-base mb-1">{g.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {g.description}
              </p>

              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-xs mb-3 space-y-1">
                <div className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Población: {g.targetPersona}
                </div>
                {g.institutionalContext && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {g.institutionalContext}
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Categorías Abordadas:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(g.questions.map((q) => q.category))).map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Creado: {new Date(g.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => onSelectGuideForSession(g)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition active:scale-95 shadow-xs cursor-pointer"
              >
                <span>Usar este Guion</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
