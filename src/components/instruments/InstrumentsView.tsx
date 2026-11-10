import React, { useState } from 'react';
import {
  FileText,
  BarChart3,
  Sparkles,
  GraduationCap,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { InstrumentDefinition, InstrumentResponse } from '../../types/instruments';
import { getInstruments } from '../../lib/defaultInstruments';
import { InstrumentForm } from './InstrumentForm';
import { InstrumentResponsesViewer } from './InstrumentResponsesViewer';
import { Language } from '../../lib/i18n';

interface InstrumentsViewProps {
  responses: InstrumentResponse[];
  language: Language;
  onOpenThesisModal?: () => void;
  isAdmin?: boolean;
  onBack?: () => void;
}

export const InstrumentsView: React.FC<InstrumentsViewProps> = ({
  responses,
  language,
  onOpenThesisModal,
  isAdmin = false,
  onBack,
}) => {
  const instruments = getInstruments(language);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(instruments[0].id);
  const [viewMode, setViewMode] = useState<'form' | 'analytics'>('form');

  const selectedInstrument = instruments.find((i) => i.id === selectedInstrumentId) || instruments[0];

  // Count responses per instrument
  const countResponses = (id: string) => {
    return responses.filter((r) => r.instrumentId === id).length;
  };

  return (
    <div className="w-full min-h-screen py-4 sm:py-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Navigation / Switcher Bar in Aero Glass */}
        <div className="aero-glass rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Instrument Selector Pills (Horizontally scrollable on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap w-full sm:w-auto">
            {onBack && (
              <button
                onClick={onBack}
                title={language === 'en' ? 'Back to home' : 'Volver al inicio'}
                className="btn-aero-glass h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-cyan-300 transition shrink-0 cursor-pointer shadow-xs active:scale-95 mr-1"
                aria-label={language === 'en' ? 'Back to home' : 'Volver al inicio'}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            {instruments.map((inst) => {
              const isSelected = inst.id === selectedInstrumentId;
              const count = countResponses(inst.id);

              return (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstrumentId(inst.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'btn-aero-green shadow-md'
                      : 'btn-aero-glass text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="font-mono">{inst.code}</span>
                  <span className="hidden xs:inline sm:inline">{inst.shortTitle}</span>
                  {isAdmin && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? 'bg-white/30 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mode Switcher: Form vs Analytics (Strictly Restricted to Authorized Researchers) */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-cyan-500/20">
              <button
                onClick={() => setViewMode('form')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === 'form'
                    ? 'btn-aero-cyan text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{language === 'en' ? 'Fill Questionnaire' : 'Responder'}</span>
              </button>

              <button
                onClick={() => setViewMode('analytics')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === 'analytics'
                    ? 'btn-aero-cyan text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>{language === 'en' ? 'Responses & Charts' : 'Ver Respuestas'}</span>
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-white/30 text-white">
                  {countResponses(selectedInstrument.id)}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
              <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {language === 'en'
                  ? 'Confidential Research Instrument'
                  : 'Instrumento de Investigación Confidencial'}
              </span>
            </div>
          )}
        </div>

        {/* View Body */}
        {viewMode === 'analytics' && isAdmin ? (
          <InstrumentResponsesViewer
            instrument={selectedInstrument}
            responses={responses}
            onFillInstrument={() => setViewMode('form')}
            language={language}
          />
        ) : (
          <InstrumentForm
            instrument={selectedInstrument}
            onViewAnalytics={isAdmin ? () => setViewMode('analytics') : undefined}
            language={language}
          />
        )}
      </div>
    </div>
  );
};
