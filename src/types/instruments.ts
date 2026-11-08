export type QuestionType =
  | 'text'
  | 'number'
  | 'paragraph'
  | 'single_choice'
  | 'multiple_choice'
  | 'rating'
  | 'matrix_grid'
  | 'dropdown';

export interface MatrixRow {
  id: string;
  label: string;
}

export interface MatrixColumn {
  id: string;
  label: string;
}

export interface InstrumentQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  category?: 'Inteligencia Artificial (IA)' | 'Formación Docente' | 'Efectos de la IA' | string;
  subCategory?: string;
  options?: string[];
  ratingMin?: number;
  ratingMax?: number;
  ratingMinLabel?: string;
  ratingMaxLabel?: string;
  matrixRows?: MatrixRow[];
  matrixColumns?: MatrixColumn[];
  placeholder?: string;
}

export interface InstrumentDefinition {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  phase: string;
  methodologicalObjective: string;
  questions: InstrumentQuestion[];
}

export interface InstrumentResponse {
  id: string;
  instrumentId: string;
  instrumentTitle: string;
  studentCode?: string;
  participantName: string;
  age?: string | number;
  semester: string | number;
  centerLocation?: string;
  answers: Record<string, any>;
  informedConsentAccepted: boolean;
  submittedAt: string;
  updatedAt: string;
}
