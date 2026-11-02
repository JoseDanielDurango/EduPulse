import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  GraduationCap,
  Sparkle,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { InterviewGuide, InterviewSession, ChatMessage } from '../types';
import { saveSession } from '../lib/firebase';
import { Language, translations } from '../lib/i18n';

interface InterviewRoomProps {
  session: InterviewSession;
  guide: InterviewGuide;
  onUpdateSession: (updated: InterviewSession) => void;
  onFinishSession: (finalSession: InterviewSession) => void;
  language: Language;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  session,
  guide,
  onUpdateSession,
  onFinishSession,
  language,
}) => {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [autoSpeechSynthesis, setAutoSpeechSynthesis] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Participant exchanges count
  const participantTurns = session.messages.filter((m) => m.sender === 'participant').length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isAiResponding]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'en' ? 'en-US' : 'es-ES';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        setSpeechError(`${event.error}`);
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech:', err);
      }
    }
  };

  // Text-to-Speech synthesis
  const speakText = (text: string) => {
    if (!autoSpeechSynthesis || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Initial greeting if session has 0 messages
  useEffect(() => {
    if (session.messages.length === 0 && !isAiResponding) {
      triggerInitialGreeting();
    }
  }, [session.id]);

  const triggerInitialGreeting = async () => {
    setIsAiResponding(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guide,
          messages: [],
          currentQuestionIndex: 0,
          participantName: session.participantName || 'Amigo/a',
          participantRole: session.participantRole || 'Licenciatura en Informática',
          studentCode: session.studentCode || 'EST-01',
          semester: session.semester || '',
          centerLocation: session.centerLocation || 'Sede Central Montería',
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate initial greeting');
      }

      const data = await response.json();
      const initialMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toISOString(),
        questionIndex: 0,
        isClarifying: false,
        category: data.category || 'Inteligencia Artificial (IA)',
      };

      const updatedSession: InterviewSession = {
        ...session,
        messages: [initialMessage],
        currentDimension: data.currentDimension || 'Prácticas Cotidianas con IA',
        qualitativePhase: data.qualitativePhase || 'Exploración Inicial',
        status: 'active',
      };

      onUpdateSession(updatedSession);
      await saveSession(updatedSession);
      speakText(data.reply);
    } catch (err) {
      console.error('Initial greeting failed:', err);
      const fallbackText =
        language === 'en'
          ? `Hi ${session.participantName}! I'm Cereza. Welcome to this open space to chat about technology, AI, and your experiences in the Computer Science Education program. To start off, how have you been using tools like ChatGPT or other AI in your university classes or study routines?`
          : `¡Hola ${session.participantName}! Qué gusto saludarte. Soy Cereza. Te doy la bienvenida a este espacio tranquilo para reflexionar juntos sobre la tecnología, la IA y tu formación en la Licenciatura en Informática. Para comenzar, ¿de qué manera has venido usando herramientas de IA en tus clases o en tu preparación docente?`;

      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: fallbackText,
        timestamp: new Date().toISOString(),
        questionIndex: 0,
        isClarifying: false,
      };
      const updatedSession: InterviewSession = {
        ...session,
        messages: [fallbackMsg],
        currentDimension: 'Prácticas y Autoeficacia Didáctica',
        qualitativePhase: 'Exploración Inicial',
      };
      onUpdateSession(updatedSession);
      await saveSession(updatedSession);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || isAiResponding) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'participant',
      text: textToSend,
      timestamp: new Date().toISOString(),
      questionIndex: participantTurns,
      category: session.currentDimension || 'Inteligencia Artificial (IA)',
    };

    const newMessages = [...session.messages, userMessage];
    const interimSession: InterviewSession = {
      ...session,
      messages: newMessages,
    };

    setInputText('');
    onUpdateSession(interimSession);
    await saveSession(interimSession);

    // Call Maya
    setIsAiResponding(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guide,
          messages: newMessages,
          participantName: session.participantName || 'Amigo/a',
          participantRole: session.participantRole || 'Licenciatura en Informática',
          studentCode: session.studentCode || 'EST-01',
          semester: session.semester || '',
          centerLocation: session.centerLocation || 'Sede Central Montería',
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Interview engine error');
      }

      const data = await response.json();
      const isFinished = !!data.isInterviewFinished;

      const agentMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toISOString(),
        questionIndex: participantTurns + 1,
        isClarifying: false,
        category: data.category || 'Formación Docente',
      };

      const finalMessages = [...newMessages, agentMessage];
      const updatedSession: InterviewSession = {
        ...session,
        messages: finalMessages,
        currentDimension: data.currentDimension || session.currentDimension,
        qualitativePhase: data.qualitativePhase || session.qualitativePhase,
        status: isFinished ? 'completed' : 'active',
      };

      onUpdateSession(updatedSession);
      await saveSession(updatedSession);
      speakText(data.reply);

      if (isFinished) {
        handleTriggerFullSynthesis(updatedSession);
      }
    } catch (err) {
      console.error('Error in Maya turn:', err);
    } finally {
      setIsAiResponding(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleTriggerFullSynthesis = async (sessionToAnalyze = session) => {
    setIsAiResponding(true);
    try {
      const res = await fetch('/api/analyze-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: sessionToAnalyze.messages,
          participantName: sessionToAnalyze.participantName,
          participantRole: sessionToAnalyze.participantRole || 'Docente en Formación - Licenciatura en Informática',
          studentCode: sessionToAnalyze.studentCode || 'EST-01',
          semester: sessionToAnalyze.semester || '',
          centerLocation: sessionToAnalyze.centerLocation || 'Sede Central Montería',
          language,
        }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const data = await res.json();
      const finalizedSession: InterviewSession = {
        ...sessionToAnalyze,
        status: 'completed',
        summary: data.summary,
        structuredResponses: data.structuredResponses,
      };

      onUpdateSession(finalizedSession);
      await saveSession(finalizedSession);
      onFinishSession(finalizedSession);
    } catch (err) {
      console.error('Error in synthesis:', err);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const participantCode = session.studentCode || 'EST-01';

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 py-3 sm:py-4">
      {/* Stitch Design System: Methodological Phases Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 mb-3 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-body">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500 dark:text-slate-400">
              1
            </span>
            <span className="hidden sm:inline">Análisis Documental</span>
          </div>

          <div className="h-0.5 w-6 bg-emerald-200 dark:bg-emerald-800"></div>

          <div className="flex items-center gap-1.5 text-[#059669] dark:text-[#34d399] font-semibold">
            <span className="h-5 w-5 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[10px]">
              2
            </span>
            <span>Interacción Dialógica Mediada por IA (Activa)</span>
          </div>

          <div className="h-0.5 w-6 bg-slate-200 dark:bg-slate-800"></div>

          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500 dark:text-slate-400">
              3
            </span>
            <span className="hidden sm:inline">Codificación y Categorización</span>
          </div>
        </div>
      </div>

      {/* Header & Participant Badge (Fluid Qualitative Conversation) */}
      <div className="elevation-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src="/cereza-avatar.png"
              alt="Cereza Avatar"
              className="h-10 w-10 rounded-xl object-contain bg-[#0f172a] dark:bg-slate-800 p-1 border border-slate-700/60 shadow-xs shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-bold text-sm sm:text-base text-[#0f172a] dark:text-white">
                  Diálogo Reflexivo con Cereza
                </h1>
                {/* Stitch Participant Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] dark:bg-emerald-950/80 border border-[#a7f3d0] dark:border-emerald-800 text-[#065f46] dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                  {participantCode} • {session.semester || 'Licenciatura'}
                </span>
                {session.centerLocation && (
                  <span className="hidden md:inline-flex text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {session.centerLocation}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                Entrevistadora: <span className="font-semibold text-slate-700 dark:text-slate-200">Cereza</span> •
                Licenciatura en Informática (Universidad de Córdoba)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Audio Speech Toggle */}
            <button
              onClick={() => setAutoSpeechSynthesis(!autoSpeechSynthesis)}
              title={autoSpeechSynthesis ? t.voiceToggleOn : t.voiceToggleOff}
              className={`p-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                autoSpeechSynthesis
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {autoSpeechSynthesis ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Complete & View Analysis */}
            <button
              onClick={() => handleTriggerFullSynthesis(session)}
              disabled={isAiResponding || session.messages.length < 2}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#059669] hover:bg-emerald-700 text-white transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>{session.status === 'completed' ? t.viewSummary : t.finishChat}</span>
            </button>
          </div>
        </div>

        {/* Fluid Qualitative Tracker (No rigid question counters) */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-body">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dimensión Actual:</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {session.currentDimension || 'Prácticas y Autoeficacia Didáctica'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              Fase: {session.qualitativePhase || 'Exploración Inicial'}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              • {participantTurns} {participantTurns === 1 ? 'reflexión' : 'reflexiones'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area - Stitch Reflexive Dialogue Bubbles */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4 font-body">
        {session.messages.map((message) => {
          const isAgent = message.sender === 'agent';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <img
                  src="/cereza-avatar.png"
                  alt="Cereza"
                  className="h-8 w-8 rounded-lg object-contain bg-[#0f172a] dark:bg-slate-800 p-0.5 border border-slate-700/60 shadow-xs shrink-0"
                />
              )}

              {/* Message Content Container */}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-xl p-4 leading-relaxed text-sm ${
                  isAgent
                    ? 'bg-[#f1f5f9] dark:bg-slate-800/90 border border-[#e2e8f0] dark:border-slate-700 text-[#1e293b] dark:text-slate-100'
                    : 'bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 border-l-4 border-l-[#0284c7] text-[#0f172a] dark:text-slate-100 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs text-[#0f172a] dark:text-white">
                      {isAgent ? 'Cereza (Entrevistadora Cualitativa)' : `${session.participantName} [Cita Reflexiva]`}
                    </span>
                    {message.category && (
                      <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        {message.category}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={
                    isAgent
                      ? 'whitespace-pre-wrap text-slate-800 dark:text-slate-200'
                      : 'quote-reflexive whitespace-pre-wrap text-slate-900 dark:text-slate-100'
                  }
                >
                  {message.text}
                </div>
              </div>

              {!isAgent && (
                <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-800 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                  {(session.participantName || 'E')[0].toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isAiResponding && (
          <div className="flex items-start gap-3 justify-start">
            <img
              src="/cereza-avatar.png"
              alt="Cereza"
              className="h-8 w-8 rounded-lg object-contain bg-[#0f172a] dark:bg-slate-800 p-0.5 border border-slate-700/60 shadow-xs shrink-0"
            />
            <div className="bg-[#f1f5f9] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-xl p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] dark:text-[#34d399] mb-1">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>{t.mayaThinking}</span>
              </div>
              <div className="flex items-center gap-1.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-[#34d399] animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-[#34d399] animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] dark:bg-[#34d399] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {speechError && (
        <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 font-body">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Input Console */}
      <div className="mt-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2.5">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiResponding || session.status === 'completed'}
              placeholder={session.status === 'completed' ? t.inputCompleted : t.inputPlaceholder}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f8fafc] dark:bg-slate-800 px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-[#0284c7] focus:ring-3 focus:ring-sky-500/15 disabled:opacity-50 transition font-body"
            />
          </div>

          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  disabled={session.status === 'completed' || isAiResponding}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition border cursor-pointer ${
                    isListening
                      ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 ring-2 ring-rose-200 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5 text-rose-600" /> : <Mic className="h-3.5 w-3.5" />}
                  <span>{isListening ? t.listeningBtn : t.dictateBtn}</span>
                </button>
              )}
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-body">
                {t.tipMessage}
              </span>
            </div>

            {/* Primary Action Button (Stitch Deep Navy) */}
            <button
              type="submit"
              disabled={!inputText.trim() || isAiResponding || session.status === 'completed'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-xs active:scale-95 transition shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>{t.sendBtn}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
