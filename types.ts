export enum ViewState {
  SUBJECT_SELECTION = 'SUBJECT_SELECTION',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  LESSON = 'LESSON',
  STUDIO = 'STUDIO',
  ASK_TEACHER = 'ASK_TEACHER',
  GAME = 'GAME'
}

export interface Subject {
  id: string;
  title: string;
  icon: string;
  colorClass: string;
  headerColor: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  icon: string;
  promptContext: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface GameRound {
  question: string; // Text on the train wagon (e.g., "En Büyük Gezegen")
  correctAnswer: string; // The falling block (e.g., "Jüpiter")
  wrongAnswers: string[]; // Distractors (e.g., "Mars", "Venüs")
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}