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
} from 'lucide-react';
import { InstrumentDefinition, InstrumentResponse } from '../../types/instruments';
import { DEFAULT_INSTRUMENTS } from '../../lib/defaultInstruments';
import { InstrumentForm } from './InstrumentForm';
import { InstrumentResponsesViewer } from './InstrumentResponsesViewer';
import { Language } from '../../lib/i18n';

interface InstrumentsViewProps {
  responses: InstrumentResponse[];
  language: Language;
  onOpenThesisModal?: () => void;
}

export const InstrumentsView: React.FC<InstrumentsViewProps> = ({
  responses,
  language,
  onOpenThesisModal,
}) => {
  const instruments = DEFAULT_INSTRUMENTS;
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(instruments[0].id);
  const [viewMode, setViewMode] = useState<'form' | 'analytics'>('form');

  const selectedInstrument = instruments.find((i) => i.id === selectedInstrumentId) || instruments[0];

  // Count responses per instrument
  const countResponses = (id: string) => {
    return responses.filter((r) => r.instrumentId === id).length;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b1120] min-h-screen py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Navigation / Switcher Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Instrument Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {instruments.map((inst) => {
              const isSelected = inst.id === selectedInstrumentId;
              const count = countResponses(inst.id);

              return (
                <button
                  key={inst.id}
                  onClick={() => setSelectedInstrumentId(inst.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="font-mono">{inst.code}</span>
                  <span className="hidden sm:inline">{inst.shortTitle}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mode Switcher: Form vs Analytics */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'form'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Fill Questionnaire' : 'Responder'}</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Responses & Charts' : 'Ver Respuestas'}</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {countResponses(selectedInstrument.id)}
              </span>
            </button>
          </div>
        </div>

        {/* View Body */}
        {viewMode === 'form' ? (
          <InstrumentForm
            instrument={selectedInstrument}
            onViewAnalytics={() => setViewMode('analytics')}
            language={language}
          />
        ) : (
          <InstrumentResponsesViewer
            instrument={selectedInstrument}
            responses={responses}
            onFillInstrument={() => setViewMode('form')}
            language={language}
          />
        )}
      </div>
    </div>
  );
};
