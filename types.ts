export enum ViewState {
  HOME = 'HOME',
  LESSON = 'LESSON',
  STUDIO = 'STUDIO',
  QUIZ = 'QUIZ'
}

export interface Topic {
  id: string;
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

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
