import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  MessageCircle,
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

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !autoSpeechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Start interview if brand new (0 messages)
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
        throw new Error('Greeting failed');
      }

      const data = await response.json();
      const initialMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: data.reply,
        timestamp: new Date().toISOString(),
        questionIndex: 0,
        isClarifying: false,
        category: currentQuestion?.category,
      };

      const updatedSession: InterviewSession = {
        ...session,
        messages: [initialMessage],
        currentQuestionIndex: 0,
        currentClarificationCount: 0,
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-3 sm:py-4">
      {/* Friendly Chat Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 mb-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900">
                  {t.chatWith}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {guide.title}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {t.chatSubtitle} • <span className="font-semibold text-slate-700">{session.participantName}</span>
                {session.semester && (
                  <span className="text-slate-400"> ({session.semester})</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Audio narration toggle */}
            <button
              onClick={() => setAutoSpeechSynthesis(!autoSpeechSynthesis)}
              title={autoSpeechSynthesis ? t.voiceToggleOn : t.voiceToggleOff}
              className={`p-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                autoSpeechSynthesis
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              {autoSpeechSynthesis ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Complete & View takeaways */}
            <button
              onClick={() => handleTriggerFullSynthesis(session)}
              disabled={isAiResponding || session.messages.length < 2}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-xs"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>{session.status === 'completed' ? t.viewSummary : t.finishChat}</span>
            </button>
          </div>
        </div>

        {/* Progress & Current Topic */}
        <div className="pt-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
            <span className="font-semibold text-slate-700">
              {currentQuestion?.topic || guide.title}
            </span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-3.5">
        {session.messages.map((message) => {
          const isAgent = message.sender === 'agent';
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xs text-xs font-bold">
                  M
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 leading-relaxed text-sm shadow-2xs ${
                  isAgent
                    ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                    : 'bg-emerald-600 text-white rounded-tr-xs shadow-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">
                      {isAgent ? 'Maya' : session.participantName}
                    </span>
                    {message.isClarifying && (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                        {t.clarifyingBadge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] ${isAgent ? 'text-slate-400' : 'text-emerald-200'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>

              {!isAgent && (
                <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                  {(session.participantName || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isAiResponding && (
          <div className="flex items-start gap-2.5 justify-start animate-fade-in">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xs text-xs font-bold">
              M
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                <Sparkles className="h-3 w-3 animate-spin" />
                <span>{t.mayaThinking}</span>
              </div>
              <div className="flex items-center gap-1 py-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {speechError && (
        <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg mb-2 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Input Bar */}
      <div className="mt-2 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiResponding || session.status === 'completed'}
              placeholder={session.status === 'completed' ? t.inputCompleted : t.inputPlaceholder}
              rows={2}
              className="w-full resize-none rounded-xl border-0 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  disabled={session.status === 'completed' || isAiResponding}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition border ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5 text-rose-600" /> : <Mic className="h-3.5 w-3.5" />}
                  <span>{isListening ? t.listeningBtn : t.dictateBtn}</span>
                </button>
              )}
              <span className="hidden sm:inline text-slate-400">
                {t.tipMessage}
              </span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isAiResponding || session.status === 'completed'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:scale-95 transition shadow-sm disabled:opacity-40 disabled:pointer-events-none"
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
