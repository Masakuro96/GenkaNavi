
export interface Standard {
  id: string;
  title: string;
  importance: 'A' | 'B' | 'C';
  content: string;
  commentary: string;
  category?: string; // Optional category for better organization
}

export interface Keyword {
  id: string;
  term: string;
  explanation: string;
}

export interface QuizMarubatsuItem {
  id: string;
  standardId: string; // Relates to a Standard's id
  question: string;
  answer: boolean; // true for ○, false for ×
  explanation: string;
}

export interface QuizFillInItem {
  id: string;
  standardId: string; // Relates to a Standard's id
  question: string; // e.g., "The capital of Japan is [ ]."
  options: string[]; // e.g., ["Tokyo", "Osaka", "Kyoto"]
  answerIndex: number; // 0-based index of the correct option in the options array
  explanation: string;
}

export interface Kaisetsu { // AI-generated explanation
  standardId: string;      // Which standard this explanation refers to
  title?: string;          // Optional title for the explanation
  content: string;         // Markdown content of the explanation
}
