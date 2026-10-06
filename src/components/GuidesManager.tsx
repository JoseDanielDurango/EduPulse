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
      description: description.trim() || 'Guion de entrevista semiestructurada para el estudio de IA en formación docente.',
      targetPersona: targetPersona.trim() || 'Docentes en formación del programa',
      institutionalContext: 'Universidad de Córdoba - Licenciatura en Informática con Énfasis en Medios Audiovisuales',
      researchGoals: goalsInput
        .split('\n')
        .map((g) => g.trim())
        .filter(Boolean),
      questions: questions,
      isTemplate: false,
      createdAt: new Date().toISOString(),
    };

    await saveGuide(newGuide);
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setTargetPersona('Docentes en formación (Licenciatura en Informática)');
    setGoalsInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              {language === 'en' ? 'Discussion Guides' : 'Temas y Ejes de Diálogo'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.topicsTitle}
          </h1>
          <p className="text-sm text-slate-500">
            {t.topicsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isCreating ? (language === 'en' ? 'Cancel' : 'Cancelar') : t.topicsCreateBtn}</span>
        </button>
      </div>

      {/* Guide Creation Modal/Drawer */}
      {isCreating && (
        <form
          onSubmit={handleSaveCustomGuide}
          className="bg-white border-2 border-emerald-300 rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in"
        >
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Diseñar Guion de Entrevista Semiestructurada</h2>
            <p className="text-xs text-slate-500">
              Las preguntas deben alinearse con las categorías institucionales: Inteligencia Artificial, Formación Docente y Efectos de la IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Título del Guion *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Guion para Egresados de la Licenciatura"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Población / Informantes
              </label>
              <input
                type="text"
                value={targetPersona}
                onChange={(e) => setTargetPersona(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Objetivos Específicos que Responde (Uno por línea)
              </label>
              <textarea
                rows={2}
                placeholder="Identificar prácticas actuales con IA&#10;Evaluar beneficios en el desarrollo de competencias pedagógicas"
                value={goalsInput}
                onChange={(e) => setGoalsInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Dynamic Questions Builder with Thesis Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Preguntas de la Entrevista ({questions.length})
              </label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Agregar Pregunta</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-800">Pregunta {idx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Categoría de Análisis
                      </label>
                      <select
                        value={q.category}
                        onChange={(e) => handleUpdateQuestion(idx, 'category', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Inteligencia Artificial (IA)">Inteligencia Artificial (IA)</option>
                        <option value="Formación Docente">Formación Docente</option>
                        <option value="Efectos de la IA">Efectos de la IA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Subcategoría
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Dimensión ética y crítica"
                        value={q.subCategory}
                        onChange={(e) => handleUpdateQuestion(idx, 'subCategory', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Tema Específico
                      </label>
                      <input
                        type="text"
                        placeholder="ej. Privacidad y Sesgos"
                        value={q.topic}
                        onChange={(e) => handleUpdateQuestion(idx, 'topic', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Pregunta Abierta para el Informante *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pregunta abierta y dialógica que formulará la entrevistadora..."
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Orientaciones para Repreguntar (Probing)
                    </label>
                    <input
                      type="text"
                      placeholder="Pautas para que la IA repregunte si la respuesta es breve (ej. pedir ejemplos en clases de la Licenciatura)."
                      value={q.probingTips}
                      onChange={(e) => handleUpdateQuestion(idx, 'probingTips', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-dashed border-amber-300 bg-amber-50/50 text-amber-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
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
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {g.isTemplate ? 'Instrumento Oficial de Tesis' : 'Guion Complementario'}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  {g.questions.length} Preguntas
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base mb-1">{g.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {g.description}
              </p>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs mb-3 space-y-1">
                <div className="font-semibold text-emerald-900">
                  Población: {g.targetPersona}
                </div>
                {g.institutionalContext && (
                  <div className="text-[11px] text-slate-500">
                    {g.institutionalContext}
                  </div>
                )}
              </div>

              {/* Questions preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Matriz de Preguntas:
                </span>
                <div className="space-y-1.5">
                  {g.questions.slice(0, 4).map((q, qIdx) => (
                    <div key={q.id || qIdx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="font-bold text-emerald-700 text-[11px] shrink-0">P{qIdx + 1}.</span>
                      <div>
                        <span className="font-bold text-slate-800 mr-1">[{q.category || 'Categoría'}]:</span>
                        <span className="line-clamp-1 text-slate-600">{q.question}</span>
                      </div>
                    </div>
                  ))}
                  {g.questions.length > 4 && (
                    <div className="text-[11px] text-emerald-700 font-bold">
                      +{g.questions.length - 4} preguntas más en la matriz...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => onSelectGuideForSession(g)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95"
              >
                <span>{t.topicsApplyBtn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
