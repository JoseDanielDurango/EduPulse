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
  const [chatError, setChatError] = useState<string | null>(null);
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
    setChatError(null);
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
    } catch (err: any) {
      console.error('Error in Cereza turn:', err);
      setChatError(
        language === 'en'
          ? 'Cereza had a connection issue. Please send your message again.'
          : 'Cereza tuvo un pequeño problema de conexión. Por favor envía tu mensaje de nuevo.'
      );
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
    <div className="flex flex-col h-[calc(100dvh-7.5rem)] md:h-[calc(100vh-4rem)] max-w-5xl mx-auto px-2.5 sm:px-4 py-2 sm:py-4">
      {/* Stitch Design System: Methodological Phases Bar (Desktop/Tablet only) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 mb-3 shadow-xs">
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

      {/* Mobile-Only Sleek Compact App Bar (< 640px) */}
      <div className="sm:hidden aero-glass rounded-2xl p-2.5 mb-2 shadow-md border border-white/90 dark:border-cyan-500/30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400/40 via-white/80 to-emerald-400/40 shadow-sm ring-1 ring-white/90 dark:ring-cyan-400/60 shrink-0 flex items-center justify-center">
            <img
              src="/cereza-avatar.png"
              alt="Cereza Avatar"
              className="h-full w-full object-contain rounded-full drop-shadow-xs"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xs text-slate-900 dark:text-white truncate">
                Cereza
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/70 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {participantCode}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-cyan-200/70 truncate">
              {session.currentDimension || 'Diálogo Reflexivo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setAutoSpeechSynthesis(!autoSpeechSynthesis)}
            title={autoSpeechSynthesis ? t.voiceToggleOn : t.voiceToggleOff}
            className={`p-1.5 rounded-full text-xs transition flex items-center justify-center cursor-pointer ${
              autoSpeechSynthesis
                ? 'btn-aero-green text-white'
                : 'btn-aero-glass text-slate-600 dark:text-slate-300'
            }`}
          >
            {autoSpeechSynthesis ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => handleTriggerFullSynthesis(session)}
            disabled={isAiResponding || session.messages.length < 2}
            className="btn-aero-green inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition disabled:opacity-50 shadow-xs cursor-pointer"
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>{session.status === 'completed' ? t.viewSummary : t.finishChat}</span>
          </button>
        </div>
      </div>

      {/* Desktop/Tablet Header Card (hidden on mobile to save vertical space) */}
      <div className="hidden sm:block aero-glass rounded-3xl p-4 sm:p-5 mb-4 shadow-lg border border-white/90 dark:border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-cyan-800/40">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400/40 via-white/80 to-emerald-400/40 shadow-lg ring-2 ring-white/90 dark:ring-cyan-400/60 shrink-0 relative flex items-center justify-center">
              <img
                src="/cereza-avatar.png"
                alt="Cereza Avatar"
                className="h-full w-full object-contain rounded-full drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Diálogo Reflexivo con Cereza
                </h1>
                {/* Participant Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/70 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm"></span>
                  {participantCode} • {session.semester || 'Licenciatura'}
                </span>
                {session.centerLocation && (
                  <span className="hidden md:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-900 dark:text-cyan-200 font-semibold border border-cyan-200/60 dark:border-cyan-800/60">
                    {session.centerLocation}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-cyan-200/70 font-body">
                Entrevistadora: <span className="font-bold text-slate-700 dark:text-slate-200">Cereza</span> •
                Licenciatura en Informática (Universidad de Córdoba)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Audio Speech Toggle */}
            <button
              onClick={() => setAutoSpeechSynthesis(!autoSpeechSynthesis)}
              title={autoSpeechSynthesis ? t.voiceToggleOn : t.voiceToggleOff}
              className={`p-2 rounded-full text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                autoSpeechSynthesis
                  ? 'btn-aero-green text-white'
                  : 'btn-aero-glass text-slate-600 dark:text-slate-300'
              }`}
            >
              {autoSpeechSynthesis ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Complete & View Analysis */}
            <button
              onClick={() => handleTriggerFullSynthesis(session)}
              disabled={isAiResponding || session.messages.length < 2}
              className="btn-aero-green inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition disabled:opacity-50 shadow-md cursor-pointer"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>{session.status === 'completed' ? t.viewSummary : t.finishChat}</span>
            </button>
          </div>
        </div>

        {/* Fluid Qualitative Tracker */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-body">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-cyan-400" />
              <span>Dimensión Actual:</span>
            </span>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
              {session.currentDimension || 'Prácticas y Autoeficacia Didáctica'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-cyan-200/70">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700/60">
              Fase: {session.qualitativePhase || 'Exploración Inicial'}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              • {participantTurns} {participantTurns === 1 ? 'reflexión' : 'reflexiones'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area - Stitch Reflexive Dialogue Bubbles with Frutiger Aero Styling */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4 font-body">
        {session.messages.map((message) => {
          const isAgent = message.sender === 'agent';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <div className="h-9 w-9 rounded-full ring-2 ring-white/90 dark:ring-cyan-400/60 shadow-md shrink-0 flex items-center justify-center bg-cyan-50/50 dark:bg-cyan-950/50 p-0.5">
                  <img
                    src="/cereza-avatar.png"
                    alt="Cereza"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
              )}

              {/* Message Content Container */}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 leading-relaxed text-sm ${
                  isAgent
                    ? 'aero-glass border border-emerald-200/60 dark:border-cyan-500/30 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'aero-card border-l-4 border-l-cyan-500 border-white/90 dark:border-cyan-500/40 text-slate-900 dark:text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-200/50 dark:border-cyan-800/40">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs text-slate-900 dark:text-cyan-200">
                      {isAgent ? 'Cereza (Entrevistadora Cualitativa)' : `${session.participantName} [Cita Reflexiva]`}
                    </span>
                    {message.category && (
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100/70 dark:bg-cyan-950/70 text-cyan-900 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
                        {message.category}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-cyan-300/60 font-mono">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={
                    isAgent
                      ? 'whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed'
                      : 'quote-reflexive whitespace-pre-wrap text-slate-900 dark:text-slate-100 leading-relaxed font-medium'
                  }
                >
                  {message.text}
                </div>
              </div>

              {!isAgent && (
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-700 text-white border border-white/80 shadow-md flex items-center justify-center shrink-0 font-extrabold text-xs relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                  <span className="relative z-10">{(session.participantName || 'E')[0].toUpperCase()}</span>
                </div>
              )}
            </div>
          );
        })}

        {isAiResponding && (
          <div className="flex items-start gap-3 justify-start">
            <div className="h-9 w-9 rounded-full ring-2 ring-white/90 dark:ring-cyan-400/60 shadow-md shrink-0 flex items-center justify-center bg-cyan-50/50 dark:bg-cyan-950/50 p-0.5">
              <img
                src="/cereza-avatar.png"
                alt="Cereza"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="aero-glass rounded-3xl p-4 shadow-sm border border-emerald-200/60 dark:border-cyan-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-500" />
                <span>{t.mayaThinking}</span>
              </div>
              <div className="flex items-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-gradient-to-b from-emerald-400 to-teal-600 shadow-xs animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-xs animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 rounded-full bg-gradient-to-b from-teal-400 to-emerald-600 shadow-xs animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {chatError && (
        <div className="text-xs text-rose-800 dark:text-rose-200 bg-rose-50/90 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-3.5 py-2.5 rounded-2xl mb-2 flex items-center justify-between gap-2 font-body shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{chatError}</span>
          </div>
          <button
            type="button"
            onClick={() => setChatError(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {speechError && (
        <div className="text-xs text-rose-800 dark:text-rose-200 bg-rose-50/90 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-3.5 py-2 rounded-2xl mb-2 flex items-center gap-2 font-body shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Input Console - Aero Glass Container with Glossy Controls */}
      <div className="mt-1.5 sm:mt-2 aero-glass rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-xl border border-white/90 dark:border-cyan-500/30">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2 sm:gap-2.5">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiResponding || session.status === 'completed'}
              placeholder={session.status === 'completed' ? t.inputCompleted : t.inputPlaceholder}
              rows={2}
              className="w-full resize-none rounded-xl sm:rounded-2xl border border-cyan-200/80 dark:border-cyan-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-cyan-200/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-cyan-500 focus:ring-4 focus:ring-cyan-400/20 disabled:opacity-50 transition font-body shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between px-0.5 sm:px-1">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  disabled={session.status === 'completed' || isAiResponding}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition border cursor-pointer shadow-xs ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-300 animate-pulse'
                      : 'btn-aero-glass text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5 text-white" /> : <Mic className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />}
                  <span className="hidden xs:inline">{isListening ? t.listeningBtn : t.dictateBtn}</span>
                </button>
              )}
              <span className="hidden sm:inline text-slate-500 dark:text-cyan-200/60 font-body text-[11px]">
                {t.tipMessage}
              </span>
            </div>

            {/* Primary Action Button (Glossy Cyan Frutiger Aero) */}
            <button
              type="submit"
              disabled={!inputText.trim() || isAiResponding || session.status === 'completed'}
              className="btn-aero-cyan inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-extrabold text-xs active:scale-95 transition shadow-md disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
