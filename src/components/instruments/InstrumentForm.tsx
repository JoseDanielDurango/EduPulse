import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Info,
  Clock,
  User,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { InstrumentDefinition, InstrumentQuestion, InstrumentResponse } from '../../types/instruments';
import {
  saveInstrumentResponse,
  saveInstrumentDraft,
  loadInstrumentDraft,
  clearInstrumentDraft,
} from '../../lib/firebase';
import { Language } from '../../lib/i18n';

interface InstrumentFormProps {
  instrument: InstrumentDefinition;
  onSubmitted?: (response: InstrumentResponse) => void;
  onViewAnalytics?: () => void;
  language: Language;
}

export const InstrumentForm: React.FC<InstrumentFormProps> = ({
  instrument,
  onSubmitted,
  onViewAnalytics,
  language,
}) => {
  // Demographic and header states
  const [participantName, setParticipantName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [age, setAge] = useState('');
  const [semester, setSemester] = useState<number | string>(5);
  const [centerLocation, setCenterLocation] = useState('Sede Central Montería');
  const [informedConsentAccepted, setInformedConsentAccepted] = useState(false);

  // Dynamic answers dictionary: questionId -> value
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Form states
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<InstrumentResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const isInitialMount = useRef(true);

  // Load draft on instrument change
  useEffect(() => {
    isInitialMount.current = true;
    const draft = loadInstrumentDraft(instrument.id);
    if (draft && draft.data) {
      const d = draft.data;
      setParticipantName(d.participantName || '');
      setStudentCode(d.studentCode || '');
      setAge(d.age || '');
      setSemester(d.semester !== undefined ? d.semester : 5);
      setCenterLocation(d.centerLocation || 'Sede Central Montería');
      setInformedConsentAccepted(!!d.informedConsentAccepted);
      setAnswers(d.answers || {});
      setLastSavedAt(draft.savedAt ? new Date(draft.savedAt).toLocaleTimeString() : null);
    } else {
      setParticipantName('');
      setStudentCode('');
      setAge('');
      setSemester(5);
      setCenterLocation('Sede Central Montería');
      setInformedConsentAccepted(false);
      setAnswers({});
      setLastSavedAt(null);
    }
    setSubmittedResponse(null);
    setValidationErrors({});

    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [instrument.id]);

  // Auto-save draft whenever inputs change (debounced)
  useEffect(() => {
    if (isInitialMount.current) return;
    if (submittedResponse) return; // Do not auto-save after final submission

    const timer = setTimeout(() => {
      const draftPayload = {
        participantName,
        studentCode,
        age,
        semester,
        centerLocation,
        informedConsentAccepted,
        answers,
      };
      saveInstrumentDraft(instrument.id, draftPayload);
      setLastSavedAt(new Date().toLocaleTimeString());
    }, 600);

    return () => clearTimeout(timer);
  }, [
    instrument.id,
    participantName,
    studentCode,
    age,
    semester,
    centerLocation,
    informedConsentAccepted,
    answers,
    submittedResponse,
  ]);

  const handleClearDraft = () => {
    clearInstrumentDraft(instrument.id);
    setParticipantName('');
    setStudentCode('');
    setAge('');
    setSemester(5);
    setCenterLocation('Sede Central Montería');
    setInformedConsentAccepted(false);
    setAnswers({});
    setLastSavedAt(null);
    setValidationErrors({});
    setShowClearConfirm(false);
  };

  const handleTextChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  const handleSingleChoiceChange = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  const handleMultipleChoiceToggle = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const currentList: string[] = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
      const index = currentList.indexOf(option);
      if (index >= 0) {
        currentList.splice(index, 1);
      } else {
        currentList.push(option);
      }
      return { ...prev, [questionId]: currentList };
    });
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  const handleMatrixChange = (questionId: string, rowId: string, colId: string) => {
    setAnswers((prev) => {
      const currentMatrix = typeof prev[questionId] === 'object' && prev[questionId] !== null
        ? { ...prev[questionId] }
        : {};
      currentMatrix[rowId] = colId;
      return { ...prev, [questionId]: currentMatrix };
    });
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!participantName.trim()) {
      errors.participantName = language === 'en' ? 'Full name is required' : 'El nombre completo es obligatorio';
    }
    if (!age || Number(age) < 14 || Number(age) > 99) {
      errors.age = language === 'en' ? 'Please enter a valid age (15-99)' : 'Ingresa una edad válida (15-99)';
    }
    if (!informedConsentAccepted) {
      errors.informedConsent = language === 'en'
        ? 'You must accept the informed consent to participate'
        : 'Debes aceptar el consentimiento informado para participar';
    }

    instrument.questions.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        if (q.type === 'matrix_grid') {
          const matrix = val || {};
          const rowCount = q.matrixRows?.length || 0;
          const answeredRows = Object.keys(matrix).length;
          if (answeredRows < rowCount) {
            errors[q.id] = language === 'en'
              ? 'Please answer all rows in the frequency table'
              : 'Por favor responde todas las filas de la matriz';
          }
        } else if (q.type === 'multiple_choice') {
          if (!Array.isArray(val) || val.length === 0) {
            errors[q.id] = language === 'en'
              ? 'Please select at least one option'
              : 'Selecciona al menos una opción';
          }
        } else if (q.type === 'number') {
          if (val === undefined || val === null || val === '') {
            errors[q.id] = language === 'en' ? 'This field is required' : 'Este campo es obligatorio';
          }
        } else {
          if (!val || (typeof val === 'string' && !val.trim())) {
            errors[q.id] = language === 'en' ? 'This question is required' : 'Esta pregunta es obligatoria';
          }
        }
      }
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`) || document.getElementById('form-error-banner');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const newResponseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Sync demographic questions to answers dictionary as well
      const completeAnswers = {
        ...answers,
        q1_nombre: participantName,
        q2_edad: age,
        q3_semestre: semester,
      };

      const payload: InstrumentResponse = {
        id: newResponseId,
        instrumentId: instrument.id,
        instrumentTitle: instrument.title,
        participantName: participantName.trim(),
        studentCode: studentCode.trim() || undefined,
        age: Number(age) || age,
        semester: Number(semester) || semester,
        centerLocation: centerLocation.trim(),
        informedConsentAccepted: true,
        answers: completeAnswers,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveInstrumentResponse(payload);
      clearInstrumentDraft(instrument.id);
      setSubmittedResponse(payload);

      if (onSubmitted) {
        onSubmitted(payload);
      }
    } catch (err) {
      console.error('Error submitting instrument response:', err);
      alert(language === 'en' ? 'Failed to submit response. Please try again.' : 'Error al guardar respuesta. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedResponse) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 shadow-lg p-6 sm:p-10 text-center space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{instrument.code} • {instrument.shortTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {language === 'en' ? 'Response Registered Successfully!' : '¡Respuesta Registrada con Éxito!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {language === 'en'
                ? `Thank you, ${submittedResponse.participantName}. Your contribution has been securely recorded for the research project at Universidad de Córdoba.`
                : `Muchas gracias, ${submittedResponse.participantName}. Tus respuestas han sido almacenadas de forma segura y confidencial en el repositorio de investigación de la Licenciatura en Informática.`}
            </p>
          </div>

          {/* Response summary pill */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-left max-w-lg mx-auto text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="font-semibold">{language === 'en' ? 'Participant:' : 'Participante:'}</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedResponse.participantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{language === 'en' ? 'Semester / Campus:' : 'Semestre / Sede:'}</span>
              <span>{submittedResponse.semester}° Semestre • {submittedResponse.centerLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{language === 'en' ? 'Submission ID:' : 'ID de Registro:'}</span>
              <span className="font-mono text-[11px] text-slate-500">{submittedResponse.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{language === 'en' ? 'Timestamp:' : 'Fecha y hora:'}</span>
              <span>{new Date(submittedResponse.submittedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSubmittedResponse(null);
                setParticipantName('');
                setStudentCode('');
                setAge('');
                setAnswers({});
                setInformedConsentAccepted(false);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-emerald-600" />
              <span>{language === 'en' ? 'Submit another response' : 'Enviar otra respuesta'}</span>
            </button>

            {onViewAnalytics && (
              <button
                onClick={onViewAnalytics}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#059669] hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
              >
                <span>{language === 'en' ? 'View Research Responses & Charts' : 'Ver Respuestas y Gráficos del Instrumento'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Questionnaire Academic Header with Frutiger Aero Glass */}
      <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 shadow-lg p-6 sm:p-8 space-y-4 relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 shadow-sm" />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {language === 'en'
                ? 'University of Córdoba • Bachelor in Computer Science'
                : 'Universidad de Córdoba • Licenciatura en Informática'}
            </span>
          </div>

          {/* Draft Auto-save Indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {lastSavedAt ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{language === 'en' ? `Draft saved (${lastSavedAt})` : `Borrador guardado (${lastSavedAt})`}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Save className="h-3.5 w-3.5" />
                <span>{language === 'en' ? 'Auto-saves as you type' : 'Guardado automático activo'}</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              title={language === 'en' ? 'Clear draft' : 'Limpiar borrador'}
              className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              {instrument.code}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              {instrument.phase}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {instrument.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
            {instrument.description}
          </p>
        </div>

        {/* Methodological Box */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 dark:text-emerald-300 block">
              {language === 'en' ? 'Methodological Objective' : 'Objetivo Metodológico'}
            </span>
            <p className="leading-relaxed">
              {instrument.methodologicalObjective}
            </p>
          </div>
        </div>

        {/* Clear draft modal confirmation */}
        {showClearConfirm && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
            <span>
              {language === 'en'
                ? 'Are you sure you want to erase all your answers and start over?'
                : '¿Seguro que deseas borrar todas las respuestas del borrador y comenzar de nuevo?'}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClearDraft}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold cursor-pointer transition"
              >
                {language === 'en' ? 'Yes, clear' : 'Sí, borrar'}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold cursor-pointer transition"
              >
                {language === 'en' ? 'Cancel' : 'Cancelar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Form Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Validation Error Banner */}
        {Object.keys(validationErrors).length > 0 && (
          <div
            id="form-error-banner"
            className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs flex items-center gap-3 animate-fade-in"
          >
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <span className="font-bold block">
                {language === 'en'
                  ? 'There are required fields left unanswered:'
                  : 'Faltan preguntas o campos obligatorios por completar:'}
              </span>
              <span className="text-[11px] text-red-700 dark:text-red-300">
                {language === 'en'
                  ? 'Please check the highlighted questions below and accept the informed consent.'
                  : 'Revisa las preguntas señaladas en rojo a continuación y recuerda marcar el consentimiento informado.'}
              </span>
            </div>
          </div>
        )}

        {/* Section 0: Informed Consent & Research Ethics */}
        <div
          id="field-informedConsent"
          className={`aero-glass rounded-3xl border p-6 sm:p-7 space-y-4 shadow-md transition ${
            validationErrors.informedConsent
              ? 'border-red-400 dark:border-red-600 ring-2 ring-red-400/20'
              : 'border-white/80 dark:border-cyan-500/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {language === 'en' ? 'Informed Consent & Academic Ethics' : 'Consentimiento Informado y Ética Investigativa'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en'
                  ? 'Participation is voluntary and strictly educational'
                  : 'Participación voluntaria y con fines estrictamente académicos'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 border border-slate-200/70 dark:border-slate-700/60 font-body">
            <p>
              {language === 'en'
                ? 'By completing this instrument, you participate in the undergraduate degree research project titled: "ESTRATEGIAS DE INTERACCIÓN DIALÓGICA MEDIADAS POR INTELIGENCIA ARTIFICIAL GENERATIVA PARA LA ENSEÑANZA Y APRENDIZAJE EN ESTUDIANTES DE LICENCIATURA EN INFORMÁTICA DE LA UNIVERSIDAD DE CÓRDOBA".'
                : 'Al diligenciar este instrumento, participas en la investigación de grado: "ESTRATEGIAS DE INTERACCIÓN DIALÓGICA MEDIADAS POR INTELIGENCIA ARTIFICIAL GENERATIVA PARA LA ENSEÑANZA Y APRENDIZAJE EN ESTUDIANTES DE LICENCIATURA EN INFORMÁTICA DE LA UNIVERSIDAD DE CÓRDOBA".'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'en'
                ? 'Your answers are handled confidentially and analyzed in aggregate for academic purposes only. You may withdraw at any time.'
                : 'Tus respuestas serán tratadas bajo estricta confidencialidad y analizadas de forma agregada para la investigación. La información no comprometerá tus evaluaciones académicas y puedes declinar en cualquier momento.'}
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1 group">
            <input
              type="checkbox"
              checked={informedConsentAccepted}
              onChange={(e) => {
                setInformedConsentAccepted(e.target.checked);
                if (validationErrors.informedConsent) {
                  setValidationErrors((prev) => {
                    const c = { ...prev };
                    delete c.informedConsent;
                    return c;
                  });
                }
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">
              {language === 'en'
                ? 'I have read the objective, accept voluntary participation, and authorize confidential treatment of my responses. *'
                : 'He leído el propósito de la investigación, acepto participar voluntariamente y autorizo el tratamiento confidencial de mis respuestas. *'}
            </span>
          </label>
          {validationErrors.informedConsent && (
            <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
              {validationErrors.informedConsent}
            </p>
          )}
        </div>

        {/* Section 1: Participant Demographics */}
        <div className="aero-glass rounded-3xl border border-white/90 dark:border-cyan-500/30 p-6 sm:p-7 space-y-5 shadow-md">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {language === 'en' ? 'Participant Identification' : 'Identificación del Participante'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'en'
                  ? 'Information used to contextualize responses within the degree program'
                  : 'Información sociodemográfica para contextualizar la muestra en la Licenciatura'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Participant Name */}
            <div id="field-participantName" className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Full Name *' : 'Nombre Completo *'}
              </label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => {
                  setParticipantName(e.target.value);
                  if (validationErrors.participantName) {
                    setValidationErrors((prev) => {
                      const c = { ...prev };
                      delete c.participantName;
                      return c;
                    });
                  }
                }}
                placeholder={language === 'en' ? 'Your full name' : 'Escribe tus nombres y apellidos'}
                className={`w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  validationErrors.participantName
                    ? 'border-red-400 dark:border-red-600'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {validationErrors.participantName && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                  {validationErrors.participantName}
                </p>
              )}
            </div>

            {/* Student Code (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Student ID / Code (Optional)' : 'Código Estudiantil (Opcional)'}
              </label>
              <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder={language === 'en' ? 'e.g. 1102839482' : 'ej. 1067894523'}
                className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Age */}
            <div id="field-age" className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Age *' : 'Edad *'}
              </label>
              <input
                type="number"
                min="15"
                max="99"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (validationErrors.age) {
                    setValidationErrors((prev) => {
                      const c = { ...prev };
                      delete c.age;
                      return c;
                    });
                  }
                }}
                placeholder="ej. 21"
                className={`w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  validationErrors.age
                    ? 'border-red-400 dark:border-red-600'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {validationErrors.age && (
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                  {validationErrors.age}
                </p>
              )}
            </div>

            {/* Sede / Campus */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Campus / Center *' : 'Sede o Centro de Tutoría *'}
              </label>
              <select
                value={centerLocation}
                onChange={(e) => setCenterLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Sede Central Montería">
                  {language === 'en' ? 'Montería Central Campus' : 'Sede Central Montería'}
                </option>
                <option value="Sede Berástegui (Ciénaga de Oro)">
                  {language === 'en' ? 'Berástegui Campus (Ciénaga de Oro)' : 'Sede Berástegui (Ciénaga de Oro)'}
                </option>
                <option value="Sede Lorica">
                  {language === 'en' ? 'Lorica Campus' : 'Sede Lorica'}
                </option>
                <option value="Sede Sahagún">
                  {language === 'en' ? 'Sahagún Campus' : 'Sede Sahagún'}
                </option>
                <option value="Sede Montelíbano">
                  {language === 'en' ? 'Montelíbano Campus' : 'Sede Montelíbano'}
                </option>
                <option value="Sede Planeta Rica">
                  {language === 'en' ? 'Planeta Rica Campus' : 'Sede Planeta Rica'}
                </option>
                <option value="Modalidad a Distancia / Otro">
                  {language === 'en' ? 'Distance Learning / Other' : 'Modalidad a Distancia / Otro'}
                </option>
              </select>
            </div>
          </div>

          {/* Semester Rating Scale (1 to 10) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Current Semester (1 to 10) *' : 'Semestre Actual en Curso (1 al 10) *'}
              </label>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {semester}° {language === 'en' ? 'Semester' : 'Semestre'}
              </span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => {
                const isSelected = Number(semester) === sem;
                return (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setSemester(sem)}
                    className={`py-2 rounded-2xl text-xs font-bold border transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'btn-aero-green text-white shadow-md'
                        : 'btn-aero-glass text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{sem}°</span>
                    <span className="text-[9px] opacity-75 font-normal">
                      {language === 'en' ? 'Sem' : 'Sem'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Questions List */}
        <div className="space-y-6">
          {instrument.questions
            // Filter out questions 1, 2, 3 if they correspond to demographics already captured in header
            .filter((q) => q.id !== 'q1_nombre' && q.id !== 'q2_edad' && q.id !== 'q3_semestre')
            .map((q, idx) => {
              const hasError = !!validationErrors[q.id];
              const value = answers[q.id];

              return (
                <div
                  key={q.id}
                  id={`field-${q.id}`}
                  className={`aero-glass rounded-3xl border p-6 sm:p-7 space-y-4 shadow-sm transition ${
                    hasError
                      ? 'border-red-400 dark:border-red-600 ring-2 ring-red-400/20'
                      : 'border-white/80 dark:border-cyan-500/20'
                  }`}
                >
                  {/* Category and Index Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 4}
                      </span>
                      {q.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {q.category}
                        </span>
                      )}
                      {q.subCategory && (
                        <span className="hidden md:inline-block text-[11px] text-slate-400 dark:text-slate-500">
                          • {q.subCategory}
                        </span>
                      )}
                    </div>
                    {q.required && (
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        * {language === 'en' ? 'Required' : 'Obligatorio'}
                      </span>
                    )}
                  </div>

                  {/* Question Title & Description */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {q.title}
                    </h4>
                    {q.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {q.description}
                      </p>
                    )}
                  </div>

                  {/* Render Question Input by Type */}
                  <div className="pt-1">
                    {/* PARAGRAPH / OPEN-ENDED */}
                    {q.type === 'paragraph' && (
                      <div className="space-y-1.5">
                        <textarea
                          rows={4}
                          value={value || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder={q.placeholder || (language === 'en' ? 'Write your reflection here...' : 'Escribe tu reflexión con tus propias palabras...')}
                          className={`w-full p-3.5 rounded-2xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white leading-relaxed resize-y transition focus:outline-none focus:ring-2 focus:ring-emerald-500 font-body ${
                            hasError
                              ? 'border-red-400 dark:border-red-600'
                              : 'border-slate-300 dark:border-slate-700'
                          }`}
                        />
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>
                            {value
                              ? `${value.trim().split(/\s+/).filter(Boolean).length} ${language === 'en' ? 'words' : 'palabras'}`
                              : `0 ${language === 'en' ? 'words' : 'palabras'}`}
                          </span>
                          <span>
                            {value
                              ? `${value.length} ${language === 'en' ? 'characters' : 'caracteres'}`
                              : `0 ${language === 'en' ? 'characters' : 'caracteres'}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SINGLE CHOICE (RADIO BUTTONS) */}
                    {q.type === 'single_choice' && (
                      <div className="space-y-2">
                        {q.options?.map((opt) => {
                          const isSelected = value === opt;
                          return (
                            <label
                              key={opt}
                              onClick={() => handleSingleChoiceChange(q.id, opt)}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                                  isSelected
                                    ? 'border-emerald-600 bg-emerald-600'
                                    : 'border-slate-400 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="leading-snug">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* MULTIPLE CHOICE (CHECKBOXES) */}
                    {q.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        {q.options?.map((opt) => {
                          const isChecked = Array.isArray(value) && value.includes(opt);
                          return (
                            <label
                              key={opt}
                              onClick={() => handleMultipleChoiceToggle(q.id, opt)}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
                                isChecked
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div
                                className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition ${
                                  isChecked
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-slate-400 dark:border-slate-600'
                                }`}
                              >
                                {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                              </div>
                              <span className="leading-snug">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* MATRIX GRID (ROWS X COLUMNS) */}
                    {q.type === 'matrix_grid' && (
                      <div className="space-y-4 pt-1">
                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
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
                                const selectedColId = value ? value[row.id] : undefined;
                                return (
                                  <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                    <td className="py-3.5 pr-4 font-medium text-slate-800 dark:text-slate-200">
                                      {row.label}
                                    </td>
                                    {q.matrixColumns?.map((col) => {
                                      const isCellSelected = selectedColId === col.id;
                                      return (
                                        <td
                                          key={col.id}
                                          onClick={() => handleMatrixChange(q.id, row.id, col.id)}
                                          className="py-3 px-3 text-center cursor-pointer"
                                        >
                                          <div className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                            <div
                                              className={`h-4 w-4 rounded-full border flex items-center justify-center transition ${
                                                isCellSelected
                                                  ? 'border-emerald-600 bg-emerald-600'
                                                  : 'border-slate-400 dark:border-slate-600'
                                              }`}
                                            >
                                              {isCellSelected && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                              )}
                                            </div>
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

                        {/* Mobile Stacked View */}
                        <div className="sm:hidden space-y-3">
                          {q.matrixRows?.map((row) => {
                            const selectedColId = value ? value[row.id] : undefined;
                            return (
                              <div
                                key={row.id}
                                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
                              >
                                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                                  {row.label}
                                </span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {q.matrixColumns?.map((col) => {
                                    const isCellSelected = selectedColId === col.id;
                                    return (
                                      <button
                                        key={col.id}
                                        type="button"
                                        onClick={() => handleMatrixChange(q.id, row.id, col.id)}
                                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition cursor-pointer text-center ${
                                          isCellSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                        }`}
                                      >
                                        {col.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* SINGLE LINE TEXT */}
                    {q.type === 'text' && (
                      <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        placeholder={q.placeholder || ''}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          hasError
                            ? 'border-red-400 dark:border-red-600'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                    )}

                    {/* NUMBER */}
                    {q.type === 'number' && (
                      <input
                        type="number"
                        value={value !== undefined ? value : ''}
                        onChange={(e) => handleTextChange(q.id, e.target.value)}
                        placeholder={q.placeholder || ''}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          hasError
                            ? 'border-red-400 dark:border-red-600'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                    )}

                    {/* RATING */}
                    {q.type === 'rating' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{q.ratingMinLabel || `${q.ratingMin || 1}`}</span>
                          <span>{q.ratingMaxLabel || `${q.ratingMax || 10}`}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            { length: (q.ratingMax || 10) - (q.ratingMin || 1) + 1 },
                            (_, i) => (q.ratingMin || 1) + i
                          ).map((num) => {
                            const isSelected = Number(value) === num;
                            return (
                              <button
                                key={num}
                                type="button"
                                onClick={() => handleTextChange(q.id, String(num))}
                                className={`h-10 w-10 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-[#059669] text-white border-emerald-600 shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question Error Message */}
                  {hasError && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold pt-1">
                      {validationErrors[q.id]}
                    </p>
                  )}
                </div>
              );
            })}
        </div>

        {/* Submit Actions Bar with Frutiger Aero Gloss */}
        <div className="aero-glass rounded-2xl sm:rounded-3xl border border-white/90 dark:border-cyan-500/30 p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-cyan-200/80">
            <Save className="h-4 w-4 text-emerald-600 dark:text-cyan-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              {language === 'en'
                ? 'Your responses will be securely stored in the research database.'
                : 'Tus respuestas se guardarán de forma permanente en el repositorio de investigación.'}
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClearDraft}
              className="btn-aero-glass px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs cursor-pointer text-center justify-center"
            >
              {language === 'en' ? 'Reset form' : 'Reiniciar formulario'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-aero-green inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl transition active:scale-95 disabled:opacity-50 cursor-pointer text-center"
            >
              <Send className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? language === 'en'
                    ? 'Submitting...'
                    : 'Enviando respuestas...'
                  : language === 'en'
                  ? 'Submit Questionnaire'
                  : 'Enviar Cuestionario Completo'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
