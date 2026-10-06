export interface InterviewQuestion {
  id: string;
  category: 'Inteligencia Artificial (IA)' | 'Formación Docente' | 'Efectos de la IA' | string;
  subCategory: string;
  topic: string;
  question: string;
  probingTips: string;
  objectiveLink?: string;
}

export interface InterviewGuide {
  id: string;
  title: string;
  description: string;
  targetPersona: string;
  researchGoals: string[];
  institutionalContext?: string;
  questions: InterviewQuestion[];
  isTemplate?: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'participant';
  text: string;
  timestamp: string;
  questionIndex: number;
  isClarifying?: boolean;
  category?: string;
}

export interface StructuredResponseItem {
  topicIndex: number;
  category: string;
  subCategory: string;
  topic: string;
  coreQuestion: string;
  participantAnswerSummary: string;
  clarifyingNotes: string[];
  painPointsOrNeeds: string[];
  directQuotes: string[];
  sentiment: 'positivo' | 'neutral' | 'negativo' | 'mixto' | string;
}

export interface InterviewSummary {
  overview: string;
  keyThemes: string[];
  actionableInsights: string[];
  overallSentiment: 'positivo' | 'mayoritariamente positivo' | 'neutral / mixto' | 'frustrado' | 'crítico' | string;
  participantPersonaInsight?: string;
  categoriesAnalysis?: {
    iaPracticasYEtica: string;
    formacionDocenteYSaberes: string;
    efectosYLimitaciones: string;
  };
}

export interface InterviewSession {
  id: string;
  studentCode?: string; // e.g. E01, E02 (Anonymized qualitative participant code)
  title: string;
  guideId: string;
  guideTitle: string;
  researcherId: string;
  researcherEmail?: string;
  participantName: string;
  participantRole: string; // e.g. "Docente en Formación"
  semester: string; // e.g. "8° Semestre"
  centerLocation: string; // e.g. "Montería", "Lorica", "Planeta Rica", "Sahagún"
  priorAiExperience?: string;
  status: 'active' | 'completed' | 'paused';
  currentQuestionIndex: number;
  totalQuestions: number;
  currentClarificationCount: number;
  messages: ChatMessage[];
  structuredResponses?: StructuredResponseItem[];
  summary?: InterviewSummary;
  exportedSheetUrl?: string;
  exportedSheetId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThesisProjectInfo {
  title: string;
  authors: string[];
  institution: string;
  faculty: string;
  program: string;
  location: string;
  year: string;
  generalObjective: string;
  specificObjectives: string[];
  problemFormulation: string;
  assumption: string;
  researchLine: string;
  subLine: string;
  populationAndSample: string;
}
