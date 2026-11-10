import React, { useState, useEffect } from 'react';
import { X, Play, MessageCircle, User, GraduationCap, Calendar, ChevronDown, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { InterviewGuide, InterviewSession } from '../types';
import { Language, translations } from '../lib/i18n';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  guides: InterviewGuide[];
  defaultGuideId?: string;
  onStartSession: (newSession: InterviewSession, guide: InterviewGuide) => void;
  currentUserId?: string;
  currentUserEmail?: string;
  existingSessionCount?: number;
  language: Language;
}

const SEMESTER_OPTIONS_ES = [
  '1° Semestre',
  '2° Semestre',
  '3° Semestre',
  '4° Semestre',
  '5° Semestre',
  '6° Semestre',
  '7° Semestre',
  '8° Semestre',
  '9° Semestre',
  '10° Semestre',
  'Egresando / Otro',
];

const SEMESTER_OPTIONS_EN = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  '9th Semester',
  '10th Semester',
  'Graduating / Other',
];

const CAMPUS_LOCATIONS = [
  'Sede Central Montería',
  'Centro de Tutoría Planeta Rica',
  'Centro de Tutoría Lorica',
  'Centro de Tutoría Sahagún',
  'Centro de Tutoría Montelíbano',
];

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  guides,
  onStartSession,
  currentUserId = 'anonymous',
  currentUserEmail,
  existingSessionCount = 0,
  language,
}) => {
  const t = translations[language];
  const nextCodeNumber = String(existingSessionCount + 1).padStart(2, '0');

  // Single conversation guide
  const singleGuide = guides[0];

  const [participantName, setParticipantName] = useState('');
  const [semester, setSemester] = useState('');
  const [customSemester, setCustomSemester] = useState('');
  const [centerLocation, setCenterLocation] = useState('Sede Central Montería');
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !singleGuide) return null;

  const semesterOptions = language === 'en' ? SEMESTER_OPTIONS_EN : SEMESTER_OPTIONS_ES;

  const finalSemester =
    semester === 'custom' || semester.includes('Otro') || semester.includes('Other')
      ? customSemester.trim()
      : semester.trim();

  const isNameValid = participantName.trim().length > 0;
  const isSemesterValid = finalSemester.length > 0;
  const isFormValid = isNameValid && isSemesterValid;

  const defaultProgram =
    language === 'en'
      ? 'Bachelor in Computer Science Education (Universidad de Córdoba)'
      : 'Licenciatura en Informática (Universidad de Córdoba)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (!isFormValid) {
      return;
    }

    const pName = participantName.trim();
    const pSemester = finalSemester;
    const sTitle = `Diálogo Cualitativo - ${pName} (${pSemester})`;

    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      studentCode: `EST-${nextCodeNumber}`,
      title: sTitle,
      guideId: singleGuide.id,
      guideTitle: singleGuide.title,
      researcherId: currentUserId,
      researcherEmail: currentUserEmail,
      participantName: pName,
      participantRole: 'Docente en Formación - Licenciatura en Informática',
      semester: pSemester,
      centerLocation: centerLocation.trim() || 'Sede Central Montería',
      status: 'active',
      currentQuestionIndex: 0,
      totalQuestions: singleGuide.questions.length,
      currentClarificationCount: 0,
      currentDimension: singleGuide.questions[0]?.topic || 'Prácticas Cotidianas con IA',
      qualitativePhase: 'Exploración Inicial',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onStartSession(newSession, singleGuide);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      {/* Outer Shell with clipped rounded corners */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="aero-glass rounded-3xl max-w-lg w-full shadow-2xl relative my-auto max-h-[88vh] flex flex-col text-slate-900 dark:text-slate-100 border border-white/90 dark:border-cyan-500/40 overflow-hidden"
      >
        {/* Pinned Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-3.5 border-b border-slate-200/60 dark:border-cyan-800/40 shrink-0 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white/80 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
              <MessageCircle className="h-5 w-5 relative z-10" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {language === 'en' ? 'Start Qualitative Dialogue' : 'Iniciar Diálogo Cualitativo'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-cyan-200/70 mt-0.5 font-medium">
                {language === 'en'
                  ? 'Instrument 3: Dialogic interaction mediated by AI'
                  : 'Técnica 3: Interacción dialógica mediada por IA'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 transition cursor-pointer shrink-0"
            aria-label={t.modalCancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain modal-scroll">
          {/* Exclusive Program & Pedagogical Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-100/70 via-teal-50/60 to-cyan-100/70 dark:from-emerald-950/60 dark:to-cyan-950/60 border border-emerald-300/80 dark:border-cyan-700/60 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
              <GraduationCap className="h-4 w-4 text-emerald-700 dark:text-cyan-400 shrink-0" />
              <span>{defaultProgram}</span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-cyan-200/90 leading-relaxed font-medium pl-6">
              {language === 'en'
                ? 'Cereza leads an authentic, flowing dialogue that adapts naturally to your semester, with no rigid question count.'
                : 'Cereza conducirá una charla auténtica y fluida adaptada a tu semestre, sin preguntas rígidas, explorando tus experiencias y reflexiones.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Informative Single Protocol Box (No dropdown!) */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-cyan-800/60 backdrop-blur-xs shadow-xs">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-cyan-300 mb-0.5">
                {language === 'en' ? 'Research Protocol' : 'Protocolo de Investigación'}
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {singleGuide.title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-cyan-200/70 mt-0.5">
                {language === 'en'
                  ? 'Explores pedagogical practices, ethics & autonomy, active learning transitions, and co-learning proposals.'
                  : 'Aborda mediación didáctica, dilemas éticos y "efecto muleta", transición al modelo curricular y propuestas para el programa.'}
              </p>
            </div>

            {/* 1. Nombre (Obligatorio) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {t.modalNameLabel} <span className="text-rose-500 font-extrabold">*</span>
                </label>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100/70 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  {language === 'en' ? 'Required' : 'Obligatorio'}
                </span>
              </div>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={t.modalNamePlaceholder}
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm rounded-2xl border transition focus:ring-4 focus:outline-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs ${
                    submittedAttempt && !isNameValid
                      ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-400/20 text-rose-900 dark:text-rose-200'
                      : 'border-slate-300/80 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-400/20 text-slate-900 dark:text-white'
                  }`}
                />
              </div>
              {submittedAttempt && !isNameValid && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{language === 'en' ? 'Please enter your name or preferred callsign.' : 'Por favor escribe tu nombre o cómo prefieres que te llame Cereza.'}</span>
                </p>
              )}
            </div>

            {/* 2. Semestre (Obligatorio) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {t.modalSemesterLabel} <span className="text-rose-500 font-extrabold">*</span>
                </label>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-100/70 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  {language === 'en' ? 'Required' : 'Obligatorio'}
                </span>
              </div>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className={`w-full pl-10 pr-8 py-2.5 text-base sm:text-sm rounded-2xl border appearance-none transition focus:ring-4 focus:outline-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs ${
                    submittedAttempt && !isSemesterValid
                      ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-400/20 text-rose-900 dark:text-rose-200'
                      : 'border-slate-300/80 dark:border-slate-700 focus:border-cyan-500 focus:ring-cyan-400/20 text-slate-900 dark:text-white'
                  }`}
                >
                  <option value="">{t.modalSemesterOptionDefault}</option>
                  {semesterOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Custom semester field if selected */}
              {(semester === 'custom' || semester.includes('Otro') || semester.includes('Other')) && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'e.g. 5th Semester / Thesis stage' : 'ej. 4° Semestre / Proyecto de grado'}
                    value={customSemester}
                    onChange={(e) => setCustomSemester(e.target.value)}
                    className="w-full px-4 py-2 text-base sm:text-sm rounded-2xl border border-cyan-300 dark:border-cyan-700 bg-white/70 dark:bg-slate-900/60 dark:text-white focus:ring-4 focus:ring-cyan-400/20 focus:outline-hidden"
                  />
                </div>
              )}

              {submittedAttempt && !isSemesterValid && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{language === 'en' ? 'Select your current semester.' : 'Selecciona el semestre que estás cursando.'}</span>
                </p>
              )}
            </div>

            {/* 3. Sede o Centro de Tutoría (Opcional / Contextual) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
                {language === 'en' ? 'Campus / Tutorial Center (Optional)' : 'Sede / Centro de Tutoría (Opcional)'}
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                <select
                  value={centerLocation}
                  onChange={(e) => setCenterLocation(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-base sm:text-sm rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 dark:text-white appearance-none focus:ring-4 focus:ring-cyan-400/20 focus:border-cyan-500 focus:outline-hidden"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/60 dark:border-cyan-800/40">
              <button
                type="button"
                onClick={onClose}
                className="btn-aero-glass px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {t.modalCancel}
              </button>
              <button
                type="submit"
                className="btn-aero-green inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold text-white shadow-md transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{t.modalStart}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
