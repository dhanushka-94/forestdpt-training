"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/questions";

type Status = "idle" | "saving" | "done" | "error";
type Step = "details" | number | "learning" | "done";

const OPTION_STYLES = ["option-a", "option-b", "option-c", "option-d"] as const;
const OPTION_LETTERS = ["අ", "ආ", "ඇ", "ඈ"];

export default function QuestionnaireForm() {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [learningGoals, setLearningGoals] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  const questionIndex = typeof step === "number" ? step : -1;
  const question = questionIndex >= 0 ? QUESTIONS[questionIndex] : null;

  const progress =
    step === "details"
      ? 0
      : step === "learning"
        ? 92
        : step === "done"
          ? 100
          : Math.round(((questionIndex + 1) / QUESTIONS.length) * 85);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function goNextFromDetails() {
    if (name.trim().length < 2) {
      setMessage("කරුණාකර නිවැරදි නමක් ඇතුළත් කරන්න.");
      return;
    }
    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 70) {
      setMessage("කරුණාකර වයස 18 සහ 70 අතර ඇතුළත් කරන්න.");
      return;
    }
    const cleanWhatsapp = whatsapp.replace(/[\s-]/g, "");
    if (!/^\+?\d{9,15}$/.test(cleanWhatsapp)) {
      setMessage("කරුණාකර වලංගු WhatsApp අංකයක් ඇතුළත් කරන්න.");
      return;
    }
    setMessage("");
    setStep(0);
  }

  function selectAnswer(optionIndex: number) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    setMessage("");
  }

  function goNextQuestion() {
    if (!question) return;
    if (typeof answers[question.id] !== "number") {
      setMessage("ඉදිරියට යාමට පිළිතුරක් තෝරන්න.");
      return;
    }
    setMessage("");
    if (questionIndex < QUESTIONS.length - 1) {
      setStep(questionIndex + 1);
      return;
    }
    setStep("learning");
  }

  function goNextFromLearning() {
    if (learningGoals.trim().length < 5) {
      setMessage(
        "කරුණාකර මෙම දින 2 වැඩමුළුවෙන් ඉගෙන ගැනීමට අවශ්‍ය දේ ලියන්න.",
      );
      return;
    }
    setMessage("");
    void submitAnswers();
  }

  function goPrev() {
    setMessage("");
    if (step === "learning") {
      setStep(QUESTIONS.length - 1);
      return;
    }
    if (step === 0) {
      setStep("details");
      return;
    }
    if (typeof step === "number" && step > 0) {
      setStep(step - 1);
    }
  }

  async function submitAnswers() {
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: Number(age),
          whatsapp,
          answers,
          learningGoals: learningGoals.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "යම් දෝෂයක් සිදු විය.");
        return;
      }
      setStatus("done");
      setStep("done");
    } catch {
      setStatus("error");
      setMessage("සේවාදායකය වෙත සම්බන්ධ විය නොහැක. නැවත උත්සාහ කරන්න.");
    }
  }

  return (
    <div ref={topRef} className="mx-auto flex w-full max-w-lg flex-col pb-2">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-moss sm:text-sm">
          <span className="truncate">
            {step === "details"
              ? "පුද්ගලික තොරතුරු"
              : step === "learning"
                ? "ඉගෙනුම් අපේක්ෂාව"
                : step === "done"
                  ? "අවසන්"
                  : `ප්‍රශ්නය ${questionIndex + 1} / ${QUESTIONS.length}`}
          </span>
          <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-forest">
            {progress}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/80 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf via-sky to-violet transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {typeof step === "number" && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {QUESTIONS.map((item, index) => (
              <span
                key={item.id}
                className={`progress-dot ${
                  index === step ? "is-active" : index < step ? "is-done" : ""
                }`}
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>

      {step === "details" && (
        <section className="animate-rise rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-white via-sky-soft/60 to-mist p-5 shadow-[0_18px_40px_rgba(18,48,36,0.12)] sm:p-7">
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-snug text-forest-deep sm:text-3xl">
            ඔබේ විස්තර ඇතුළත් කරන්න
          </h2>
          <p className="mt-2 text-sm text-moss">
            ප්‍රශ්නාවලියට පෙර නම, වයස සහ WhatsApp අංකය අවශ්‍ය වේ.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-forest">
                සම්පූර්ණ නම
              </span>
              <input
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="උදා: කමල් පෙරේරා"
                className="min-h-14 w-full rounded-2xl border-2 border-leaf/25 bg-white px-4 py-3.5 outline-none transition focus:border-forest focus:ring-4 focus:ring-leaf/25"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-forest">
                වයස
              </span>
              <input
                type="number"
                inputMode="numeric"
                autoComplete="off"
                min={18}
                max={70}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="උදා: 34"
                className="min-h-14 w-full rounded-2xl border-2 border-sky/25 bg-white px-4 py-3.5 outline-none transition focus:border-sky focus:ring-4 focus:ring-sky/25"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-forest">
                WhatsApp අංකය
              </span>
              <input
                inputMode="tel"
                autoComplete="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="උදා: 0771234567"
                className="min-h-14 w-full rounded-2xl border-2 border-violet/25 bg-white px-4 py-3.5 outline-none transition focus:border-violet focus:ring-4 focus:ring-violet/25"
              />
            </label>
          </div>

          {message && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm font-medium text-coral"
            >
              {message}
            </p>
          )}

          <div className="sticky-actions pt-4">
            <button
              type="button"
              onClick={goNextFromDetails}
              className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-forest to-sky px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-forest/25 transition active:scale-[0.98]"
            >
              ඉදිරියට
            </button>
          </div>
        </section>
      )}

      {question && (
        <section
          key={question.id}
          className="animate-rise rounded-[1.75rem] border border-white/80 bg-white/95 p-5 shadow-[0_18px_40px_rgba(18,48,36,0.12)] sm:p-7"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-leaf to-sky px-3 py-1 text-xs font-bold text-white">
              ප්‍රශ්නය {questionIndex + 1}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                question.level === "beginner"
                  ? "bg-amber/20 text-amber"
                  : "bg-violet/15 text-violet"
              }`}
            >
              {question.levelSi}
            </span>
          </div>

          <h2 className="mt-4 text-[1.15rem] leading-relaxed font-bold text-forest-deep sm:text-2xl">
            {question.prompt}
          </h2>

          <div className="mt-5 space-y-3" role="radiogroup" aria-label="පිළිතුරු">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectAnswer(optionIndex)}
                  className={`${OPTION_STYLES[optionIndex]} flex min-h-14 w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.99] ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--soft)] shadow-md"
                      : "border-transparent bg-[var(--soft)]/55"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      selected ? "bg-[var(--accent)]" : "bg-[var(--accent)]/70"
                    }`}
                  >
                    {OPTION_LETTERS[optionIndex]}
                  </span>
                  <span className="pt-1.5 text-[15px] leading-relaxed text-foreground sm:text-base">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {message && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm font-medium text-coral"
            >
              {message}
            </p>
          )}

          <div className="sticky-actions grid grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={goPrev}
              className="min-h-14 rounded-2xl border-2 border-moss/20 bg-mist px-4 py-3.5 text-sm font-bold text-forest transition active:scale-[0.98]"
            >
              ආපසු
            </button>
            <button
              type="button"
              onClick={goNextQuestion}
              className="min-h-14 rounded-2xl bg-gradient-to-r from-coral to-amber px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-coral/25 transition active:scale-[0.98]"
            >
              {questionIndex === QUESTIONS.length - 1
                ? "ඊළඟ පියවර"
                : "ඊළඟ ප්‍රශ්නය"}
            </button>
          </div>
        </section>
      )}

      {step === "learning" && (
        <section className="animate-rise rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-white via-[#fff6e8] to-sky-soft p-5 shadow-[0_18px_40px_rgba(18,48,36,0.12)] sm:p-7">
          <p className="inline-flex rounded-full bg-amber/20 px-3 py-1 text-xs font-bold text-amber">
            අවසන් පියවර
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl leading-snug text-forest-deep sm:text-3xl">
            මෙම දින 2 වැඩමුළුවෙන් ඔබට ඉගෙන ගැනීමට අවශ්‍ය කුමක්ද?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-moss">
            ඩිජිටල් සන්නිවේදනය, PowerPoint, WhatsApp, AI හෝ වෙනත් කුසලතා ගැන
            ඔබේ අපේක්ෂාව කෙටියෙන් ලියන්න.
          </p>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-forest">
              ඉගෙනුම් අපේක්ෂාව
            </span>
            <textarea
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="උදා: PowerPoint ස්ලයිඩ් හොඳින් සෑදීමට සහ ChatGPT භාවිතයෙන් ලිපි ලිවීමට ඉගෙන ගැනීමට අවශ්‍යයි."
              className="w-full resize-y rounded-2xl border-2 border-amber/30 bg-white px-4 py-3.5 text-base leading-relaxed outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/25"
            />
            <span className="mt-2 block text-right text-xs text-moss">
              {learningGoals.trim().length}/1000
            </span>
          </label>

          {message && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm font-medium text-coral"
            >
              {message}
            </p>
          )}

          <div className="sticky-actions grid grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={goPrev}
              className="min-h-14 rounded-2xl border-2 border-moss/20 bg-mist px-4 py-3.5 text-sm font-bold text-forest transition active:scale-[0.98]"
            >
              ආපසු
            </button>
            <button
              type="button"
              onClick={goNextFromLearning}
              disabled={status === "saving"}
              className="min-h-14 rounded-2xl bg-gradient-to-r from-forest to-sky px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-forest/25 transition active:scale-[0.98] disabled:opacity-60"
            >
              {status === "saving" ? "යවමින්..." : "ඉදිරිපත් කරන්න"}
            </button>
          </div>
        </section>
      )}

      {step === "done" && (
        <section className="animate-rise rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-mist via-white to-sky-soft p-6 text-center shadow-[0_18px_40px_rgba(18,48,36,0.12)] sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-leaf to-sky text-2xl text-white shadow-lg">
            ✓
          </div>
          <p className="mt-4 inline-flex rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white">
            සාර්ථකයි
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-forest-deep">
            ස්තූතියි, {name}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-moss">
            ඔබේ ප්‍රතිචාරය සාර්ථකව ලැබුණි. පුහුණු වැඩසටහනට සහභාගී වීම ගැන
            ස්තූතියි.
          </p>
        </section>
      )}
    </div>
  );
}
