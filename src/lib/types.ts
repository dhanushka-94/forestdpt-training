export type Submission = {
  id: string;
  name: string;
  age: number;
  whatsapp: string;
  answers: Record<string, number>;
  learningGoals: string;
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
};
