import React, { useState } from 'react';
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
  'Otro / Egresando',
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
  'Other / Graduating',
];

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  guides,
  defaultGuideId,
  onStartSession,
  currentUserId = 'anonymous',
  currentUserEmail,
  existingSessionCount = 0,
  language,
}) => {
  const t = translations[language];
  const nextCodeNumber = String(existingSessionCount + 1).padStart(2, '0');

  const [selectedGuideId, setSelectedGuideId] = useState(
    defaultGuideId || (guides[0]?.id ?? '')
  );
  const [participantName, setParticipantName] = useState('');
  const [semester, setSemester] = useState('');
  const [customSemester, setCustomSemester] = useState('');
  const [centerLocation, setCenterLocation] = useState('');
  const [showLocationField, setShowLocationField] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  if (!isOpen) return null;

  const currentGuide = guides.find((g) => g.id === selectedGuideId) || guides[0];
  const semesterOptions = language === 'en' ? SEMESTER_OPTIONS_EN : SEMESTER_OPTIONS_ES;

  const finalSemester = semester === 'custom' || semester.includes('Otro') || semester.includes('Other')
    ? customSemester.trim()
    : semester.trim();

  const isNameValid = participantName.trim().length > 0;
  const isSemesterValid = finalSemester.length > 0;
  const isFormValid = isNameValid && isSemesterValid;

  const defaultProgram = language === 'en'
    ? 'Bachelor in Computer Science Education & Audiovisual Media'
    : 'Licenciatura en Informática con Énfasis en Medios Audiovisuales';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (!isFormValid || !currentGuide) {
      return;
    }

    const pName = participantName.trim();
    const pSemester = finalSemester;
    const sTitle = `${currentGuide.title} - ${pName} (${pSemester})`;

    const newSession: InterviewSession = {
      id: `session-${Date.now()}`,
      studentCode: `E${nextCodeNumber}`,
      title: sTitle,
      guideId: currentGuide.id,
      guideTitle: currentGuide.title,
      researcherId: currentUserId,
      researcherEmail: currentUserEmail,
      participantName: pName,
      participantRole: defaultProgram,
      semester: pSemester,
      centerLocation: centerLocation.trim() || (language === 'en' ? 'Main Campus' : 'Sede Principal'),
      status: 'active',
      currentQuestionIndex: 0,
      totalQuestions: currentGuide.questions.length,
      currentClarificationCount: 0,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onStartSession(newSession, currentGuide);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-4 my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label={t.modalCancel}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {t.modalTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.modalSubtitle}
            </p>
          </div>
        </div>

        {/* Exclusive Program & Pedagogical Notice Banner */}
        <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <GraduationCap className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>{defaultProgram}</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium pl-6">
            {language === 'en'
              ? 'Maya personalizes her questions and depth strictly according to your semester.'
              : 'Maya adapta sus preguntas y profundidad de diálogo según el semestre que estás cursando.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Topic selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t.modalTopicLabel}
            </label>
            <select
              value={selectedGuideId}
              onChange={(e) => setSelectedGuideId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.questions.length} {t.questionsCount})
                </option>
              ))}
            </select>
          </div>

          {/* 1. Nombre (Obligatorio) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.modalNameLabel} <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                {language === 'en' ? 'Required' : 'Obligatorio'}
              </span>
            </div>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder={t.modalNamePlaceholder}
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border transition focus:ring-2 focus:outline-hidden ${
                  submittedAttempt && !isNameValid
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-emerald-500'
                }`}
              />
            </div>
            {submittedAttempt && !isNameValid && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {language === 'en' ? 'Please enter your name.' : 'Por favor ingresa tu nombre.'}
              </p>
            )}
          </div>

          {/* 2. Semestre (Obligatorio) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.modalSemesterLabel} <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                {language === 'en' ? 'Required' : 'Obligatorio'}
              </span>
            </div>
            <div className="relative">
              <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-white transition focus:ring-2 focus:outline-hidden ${
                  submittedAttempt && !isSemesterValid
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-emerald-500'
                }`}
              >
                <option value="">{t.modalSemesterOptionDefault}</option>
                {semesterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom semester input if "Otro" is picked */}
            {(semester.includes('Otro') || semester.includes('Other')) && (
              <div className="mt-2 animate-fade-in">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'e.g. 11th Semester, Graduate...' : 'ej. 11° Semestre, Egresado en grado...'}
                  value={customSemester}
                  onChange={(e) => setCustomSemester(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
            )}

            {submittedAttempt && !isSemesterValid && (
              <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {language === 'en' ? 'Please select your semester.' : 'Por favor selecciona tu semestre.'}
              </p>
            )}
          </div>

          {/* Sede / Ubicación (Opcional) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowLocationField(!showLocationField)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showLocationField ? 'rotate-180' : ''}`} />
              <span>{language === 'en' ? '+ Add campus or city (optional)' : '+ Agregar sede o ciudad (opcional)'}</span>
            </button>

            {showLocationField && (
              <div className="mt-2 relative animate-fade-in">
                <MapPin className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.modalLocationPlaceholder}
                  value={centerLocation}
                  onChange={(e) => setCenterLocation(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Validation Notice */}
          {!isFormValid && (
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>
                {language === 'en'
                  ? 'Name and Semester must be completed before starting.'
                  : 'Debes completar Nombre y Semestre antes de iniciar la charla.'}
              </span>
            </p>
          )}

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              {t.modalCancel}
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition active:scale-95 ${
                isFormValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer ring-2 ring-emerald-500/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              <span>{t.modalStart}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
