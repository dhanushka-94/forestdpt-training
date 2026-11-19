import { NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/questions";
import { addSubmission, clearSubmissions, getSubmissions } from "@/lib/store";
import type { Submission } from "@/lib/types";

function scoreAnswers(answers: Record<string, number>) {
  let score = 0;
  for (const question of QUESTIONS) {
    if (answers[question.id] === question.correctIndex) {
      score += 1;
    }
  }
  return score;
}

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json({ submissions });
}

export async function DELETE() {
  try {
    await clearSubmissions();
    return NextResponse.json({ ok: true, submissions: [] });
  } catch {
    return NextResponse.json(
      { error: "ප්‍රතිඵල යළි සැකසීමට නොහැකි විය." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const age = Number(body.age);
    const whatsapp = String(body.whatsapp ?? "").trim();
    const answers = (body.answers ?? {}) as Record<string, number>;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "කරුණාකර නිවැරදි නමක් ඇතුළත් කරන්න." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(age) || age < 18 || age > 70) {
      return NextResponse.json(
        { error: "කරුණාකර වයස 18 සහ 70 අතර ඇතුළත් කරන්න." },
        { status: 400 },
      );
    }

    const cleanWhatsapp = whatsapp.replace(/[\s-]/g, "");
    if (!/^\+?\d{9,15}$/.test(cleanWhatsapp)) {
      return NextResponse.json(
        { error: "කරුණාකර වලංගු WhatsApp අංකයක් ඇතුළත් කරන්න." },
        { status: 400 },
      );
    }

    for (const question of QUESTIONS) {
      const value = answers[question.id];
      if (
        typeof value !== "number" ||
        value < 0 ||
        value >= question.options.length
      ) {
        return NextResponse.json(
          { error: "කරුණාකර සියලු ප්‍රශ්නවලට පිළිතුරු දෙන්න." },
          { status: 400 },
        );
      }
    }

    const score = scoreAnswers(answers);
    const total = QUESTIONS.length;
    const submission: Submission = {
      id: crypto.randomUUID(),
      name,
      age,
      whatsapp: cleanWhatsapp,
      answers,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      submittedAt: new Date().toISOString(),
    };

    await addSubmission(submission);

    return NextResponse.json({ submission }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "ප්‍රතිචාරය සුරැකීමට නොහැකි විය." },
      { status: 500 },
    );
  }
}
