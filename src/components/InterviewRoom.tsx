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

  const currentQIndex = session.currentQuestionIndex;
  const currentQuestion = guide.questions[currentQIndex] || null;
  const totalQuestions = guide.questions.length;
  const progressPercent = Math.min(100, Math.round(((currentQIndex) / totalQuestions) * 100));

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
          currentClarificationCount: 0,
          participantName: session.participantName || 'Amigo/a',
          participantRole: session.participantRole || '',
          studentCode: session.studentCode || '',
          semester: session.semester || '',
          centerLocation: session.centerLocation || '',
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
        category: guide.questions[0]?.category,
      };

      const updatedSession: InterviewSession = {
        ...session,
        messages: [initialMessage],
        status: 'active',
      };

      onUpdateSession(updatedSession);
      await saveSession(updatedSession);
      speakText(data.reply);
    } catch (err) {
      console.error('Initial greeting failed:', err);
      const fallbackText = language === 'en'
        ? `Hi ${session.participantName}! I'm Maya. Welcome to this open space to chat about technology, AI, and learning. To start off: ${guide.questions[0]?.question}`
        : `¡Hola ${session.participantName}! Qué gusto saludarte. Soy Maya. Te doy la bienvenida a este espacio tranquilo para charlar sobre tecnología, IA y aprendizaje. Para empezar: ${guide.questions[0]?.question}`;

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
      questionIndex: session.currentQuestionIndex,
      category: currentQuestion?.category,
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
          currentQuestionIndex: session.currentQuestionIndex,
          currentClarificationCount: session.currentClarificationCount,
          participantName: session.participantName || 'Amigo/a',
          participantRole: session.participantRole || '',
          studentCode: session.studentCode || '',
          semester: session.semester || '',
          centerLocation: session.centerLocation || '',
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Interview engine error');
      }

      const data = await response.json();
      const isClarifying = !!data.isClarifying;
      const advance = !!data.advanceToNextQuestion;
      const isFinished = !!data.isInterviewFinished;

      let nextQIndex = session.currentQuestionIndex;
      let nextClarificationCount = session.currentClarificationCount;

      if (isClarifying) {
        nextClarificationCount += 1;
      } else if (advance) {
        nextQIndex = Math.min(totalQuestions - 1, session.currentQuestionIndex + 1);
        nextClarificationCount = 0;
      }

      const agentMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toISOString(),
        questionIndex: nextQIndex,
        isClarifying: isClarifying,
        category: guide.questions[nextQIndex]?.category,
      };

      const finalMessages = [...newMessages, agentMessage];
      const updatedSession: InterviewSession = {
        ...session,
        messages: finalMessages,
        currentQuestionIndex: nextQIndex,
        currentClarificationCount: nextClarificationCount,
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
          guide,
          messages: sessionToAnalyze.messages,
          participantName: sessionToAnalyze.participantName,
          participantRole: sessionToAnalyze.participantRole || '',
          studentCode: sessionToAnalyze.studentCode || '',
          semester: sessionToAnalyze.semester || '',
          centerLocation: sessionToAnalyze.centerLocation || '',
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

  // Participant Pseudonym format for Stitch
  const participantCode = session.studentCode || `EST-${(session.participantName || '01').slice(0, 2).toUpperCase()}`;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 py-3 sm:py-4">
      {/* Stitch Design System: Methodological Phases Bar */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2.5 mb-3 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-body">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">1</span>
            <span className="hidden sm:inline">Preparación Contextual</span>
          </div>

          <div className="h-0.5 w-6 bg-emerald-200"></div>

          <div className="flex items-center gap-1.5 text-[#059669] font-semibold">
            <span className="h-5 w-5 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Entrevista Cualitativa (Activa)</span>
          </div>

          <div className="h-0.5 w-6 bg-slate-200"></div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">3</span>
            <span className="hidden sm:inline">Transcripción y Codificación</span>
          </div>
        </div>
      </div>

      {/* Header & Participant Badge (Stitch Academic Pulse) */}
      <div className="elevation-card rounded-xl p-4 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0f172a] flex items-center justify-center text-white shrink-0 shadow-xs">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-bold text-sm sm:text-base text-[#0f172a]">
                  Sala de Entrevista Reflexiva
                </h1>
                {/* Stitch Participant Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669]"></span>
                  {participantCode} • {session.semester || 'Licenciatura'}
                </span>
                {session.centerLocation && (
                  <span className="hidden md:inline-flex text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {session.centerLocation}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-body">
                Entrevistadora: <span className="font-semibold text-slate-700">Maya</span> • Universidad de Córdoba
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Audio Speech Toggle */}
            <button
              onClick={() => setAutoSpeechSynthesis(!autoSpeechSynthesis)}
              title={autoSpeechSynthesis ? t.voiceToggleOn : t.voiceToggleOff}
              className={`p-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                autoSpeechSynthesis
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-[#e2e8f0] text-slate-500 hover:text-slate-800'
              }`}
            >
              {autoSpeechSynthesis ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Complete & View Analysis */}
            <button
              onClick={() => handleTriggerFullSynthesis(session)}
              disabled={isAiResponding || session.messages.length < 2}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#059669] text-white hover:bg-[#047857] transition disabled:opacity-50 shadow-xs"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>{session.status === 'completed' ? t.viewSummary : t.finishChat}</span>
            </button>
          </div>
        </div>

        {/* Qualitative Topic Card & Step Progress */}
        <div className="pt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-body">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0f172a]">
                Tópico: {currentQuestion?.topic || guide.title}
              </span>
              {currentQuestion?.category && (
                <span className="hidden sm:inline-flex px-2 py-0.2 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                  {currentQuestion.category}
                </span>
              )}
            </div>
            <span className="font-semibold text-slate-600">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#059669] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
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
                <div className="h-8 w-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  M
                </div>
              )}

              {/* Message Content Container */}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-xl p-4 leading-relaxed text-sm ${
                  isAgent
                    ? 'bg-[#f1f5f9] border border-[#e2e8f0] text-[#1e293b]'
                    : 'bg-white border border-[#e2e8f0] border-l-4 border-l-[#0284c7] text-[#0f172a] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs text-[#0f172a]">
                      {isAgent ? 'Maya (Entrevistadora)' : `${session.participantName} [Cita Textual]`}
                    </span>
                    {message.isClarifying && (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {t.clarifyingBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className={isAgent ? 'whitespace-pre-wrap text-slate-800' : 'quote-reflexive whitespace-pre-wrap'}>
                  {message.text}
                </div>
              </div>

              {!isAgent && (
                <div className="h-8 w-8 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                  {(session.participantName || 'E')[0].toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isAiResponding && (
          <div className="flex items-start gap-3 justify-start">
            <div className="h-8 w-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
              M
            </div>
            <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] mb-1">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>{t.mayaThinking}</span>
              </div>
              <div className="flex items-center gap-1.5 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {speechError && (
        <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 font-body">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Input Console (Stitch Academic Pulse Input Styling) */}
      <div className="mt-2 bg-white border border-[#cbd5e1] rounded-xl p-3 shadow-xs">
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
              className="w-full resize-none rounded-lg border border-slate-200 bg-[#f8fafc] px-3.5 py-2.5 text-sm text-[#0f172a] placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#0284c7] focus:ring-3 focus:ring-sky-500/15 disabled:opacity-50 transition font-body"
            />
          </div>

          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  disabled={session.status === 'completed' || isAiResponding}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition border cursor-pointer ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-200 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5 text-rose-600" /> : <Mic className="h-3.5 w-3.5" />}
                  <span>{isListening ? t.listeningBtn : t.dictateBtn}</span>
                </button>
              )}
              <span className="hidden sm:inline text-slate-400 font-body">
                {t.tipMessage}
              </span>
            </div>

            {/* Primary Action Button (Stitch Deep Navy) */}
            <button
              type="submit"
              disabled={!inputText.trim() || isAiResponding || session.status === 'completed'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f172a] text-white font-semibold text-xs hover:bg-[#1e293b] active:scale-95 transition shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
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
