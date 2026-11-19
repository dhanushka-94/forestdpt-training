import { QUESTIONS } from "./questions";
import type { Submission } from "./types";

export type ScoreBucket = {
  label: string;
  min: number;
  max: number;
  count: number;
  color: string;
};

export type QuestionInsight = {
  id: string;
  index: number;
  prompt: string;
  levelSi: string;
  correctCount: number;
  total: number;
  accuracy: number;
};

export type ResultsInsights = {
  total: number;
  average: number;
  highest: number;
  lowest: number;
  median: number;
  passCount: number;
  passRate: number;
  averageAge: number;
  youngest: number;
  oldest: number;
  buckets: ScoreBucket[];
  questionInsights: QuestionInsight[];
  hardestQuestion: QuestionInsight | null;
  easiestQuestion: QuestionInsight | null;
  topPerformers: Submission[];
};

function medianOf(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

export function buildInsights(submissions: Submission[]): ResultsInsights {
  const total = submissions.length;
  const percentages = submissions.map((item) => item.percentage);
  const ages = submissions.map((item) => item.age);

  const average =
    total === 0
      ? 0
      : Math.round(percentages.reduce((sum, value) => sum + value, 0) / total);
  const highest = total === 0 ? 0 : Math.max(...percentages);
  const lowest = total === 0 ? 0 : Math.min(...percentages);
  const median = medianOf(percentages);
  const passCount = submissions.filter((item) => item.percentage >= 75).length;
  const passRate = total === 0 ? 0 : Math.round((passCount / total) * 100);
  const averageAge =
    total === 0
      ? 0
      : Math.round(ages.reduce((sum, value) => sum + value, 0) / total);
  const youngest = total === 0 ? 0 : Math.min(...ages);
  const oldest = total === 0 ? 0 : Math.max(...ages);

  const bucketDefs = [
    { label: "0–49%", min: 0, max: 49, color: "bg-coral" },
    { label: "50–74%", min: 50, max: 74, color: "bg-amber" },
    { label: "75–89%", min: 75, max: 89, color: "bg-sky" },
    { label: "90–100%", min: 90, max: 100, color: "bg-leaf" },
  ];

  const buckets: ScoreBucket[] = bucketDefs.map((bucket) => ({
    ...bucket,
    count: submissions.filter(
      (item) => item.percentage >= bucket.min && item.percentage <= bucket.max,
    ).length,
  }));

  const questionInsights: QuestionInsight[] = QUESTIONS.map((question, index) => {
    const answered = submissions.filter(
      (item) => typeof item.answers?.[question.id] === "number",
    );
    const correctCount = answered.filter(
      (item) => item.answers[question.id] === question.correctIndex,
    ).length;
    const answeredTotal = answered.length;
    return {
      id: question.id,
      index: index + 1,
      prompt: question.prompt,
      levelSi: question.levelSi,
      correctCount,
      total: answeredTotal,
      accuracy:
        answeredTotal === 0
          ? 0
          : Math.round((correctCount / answeredTotal) * 100),
    };
  });

  const rankedByHardness = [...questionInsights].sort(
    (a, b) => a.accuracy - b.accuracy,
  );

  const topPerformers = [...submissions]
    .sort((a, b) => b.percentage - a.percentage || a.name.localeCompare(b.name))
    .slice(0, 5);

  return {
    total,
    average,
    highest,
    lowest,
    median,
    passCount,
    passRate,
    averageAge,
    youngest,
    oldest,
    buckets,
    questionInsights,
    hardestQuestion: rankedByHardness[0] ?? null,
    easiestQuestion: rankedByHardness[rankedByHardness.length - 1] ?? null,
    topPerformers,
  };
}
