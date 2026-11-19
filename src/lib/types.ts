export type Submission = {
  id: string;
  name: string;
  age: number;
  whatsapp: string;
  answers: Record<string, number>;
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
};
