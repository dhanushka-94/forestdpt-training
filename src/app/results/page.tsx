import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import ResetResultsButton from "@/components/ResetResultsButton";
import { buildInsights } from "@/lib/insights";
import { QUESTIONS } from "@/lib/questions";
import { getSubmissions } from "@/lib/store";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("si-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function scoreTone(percentage: number) {
  if (percentage >= 90) return "from-leaf/25 to-mist text-forest";
  if (percentage >= 75) return "from-sky/25 to-sky-soft text-sky";
  if (percentage >= 50) return "from-amber/25 to-[#fff3db] text-amber";
  return "from-coral/20 to-[#ffe8e1] text-coral";
}

async function ResultsContent() {
  await connection();
  const submissions = await getSubmissions();
  const insights = buildInsights(submissions);
  const maxBucket = Math.max(...insights.buckets.map((item) => item.count), 1);

  return (
    <>
      <header className="animate-rise mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-amber uppercase">
            ප්‍රතිඵල වාර්තාව
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-forest-deep sm:text-5xl">
            පුහුණුවීම් ප්‍රතිචාර
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-moss sm:text-base">
            නම, වයස, WhatsApp සහ ලකුණු සමඟ විස්තරාත්මක විශ්ලේෂණය.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ResetResultsButton disabled={submissions.length === 0} />
          <Link
            href="/"
            className="inline-flex min-h-12 justify-center rounded-2xl bg-gradient-to-r from-forest to-sky px-5 py-3 text-sm font-bold text-white"
          >
            ප්‍රශ්නාවලියට ආපසු
          </Link>
        </div>
      </header>

      <section className="animate-rise mb-6 grid gap-3 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-gradient-to-br from-leaf/20 to-mist p-5 shadow-sm">
          <p className="text-sm text-moss">මුළු ප්‍රතිචාර</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
            {insights.total}
          </p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-sky/20 to-sky-soft p-5 shadow-sm">
          <p className="text-sm text-moss">සාමාන්‍ය ලකුණු</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
            {insights.average}%
          </p>
          <p className="mt-1 text-xs text-moss">මධ්‍යස්ථය: {insights.median}%</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-violet/15 to-amber/15 p-5 shadow-sm">
          <p className="text-sm text-moss">සාර්ථක අනුපාතය (≥75%)</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
            {insights.passRate}%
          </p>
          <p className="mt-1 text-xs text-moss">
            {insights.passCount}/{insights.total} දෙනෙක්
          </p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-amber/20 to-[#fff3db] p-5 shadow-sm">
          <p className="text-sm text-moss">වයස් පරාසය</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
            {insights.total === 0
              ? "—"
              : `${insights.youngest}–${insights.oldest}`}
          </p>
          <p className="mt-1 text-xs text-moss">
            සාමාන්‍ය වයස: {insights.averageAge || "—"}
          </p>
        </div>
      </section>

      {insights.total > 0 && (
        <>
          <section className="animate-rise mb-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_14px_30px_rgba(18,48,36,0.08)] sm:p-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-forest-deep">
                ලකුණු ව්‍යාප්තිය
              </h2>
              <p className="mt-1 text-sm text-moss">
                ඉහළම {insights.highest}% · අඩුම {insights.lowest}%
              </p>
              <div className="mt-5 space-y-3">
                {insights.buckets.map((bucket) => (
                  <div key={bucket.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-forest-deep">
                        {bucket.label}
                      </span>
                      <span className="text-moss">{bucket.count}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-mist/80">
                      <div
                        className={`h-full rounded-full ${bucket.color} transition-all`}
                        style={{
                          width: `${Math.max(
                            (bucket.count / maxBucket) * 100,
                            bucket.count > 0 ? 8 : 0,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_14px_30px_rgba(18,48,36,0.08)] sm:p-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-forest-deep">
                ඉහළම ලකුණු
              </h2>
              <p className="mt-1 text-sm text-moss">ප්‍රමුඛ පුහුණුවන්නන් 5 දෙනා</p>
              <div className="mt-4 space-y-3">
                {insights.topPerformers.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-mist/70 to-sky-soft/60 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-forest-deep">
                        {index + 1}. {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-moss">
                        වයස {item.age} · {item.whatsapp}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-forest">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="animate-rise mb-6 rounded-3xl border border-white/80 bg-white/90 p-5 shadow-[0_14px_30px_rgba(18,48,36,0.08)] sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-forest-deep">
                  ප්‍රශ්න විශ්ලේෂණය
                </h2>
                <p className="mt-1 text-sm text-moss">
                  සෑම ප්‍රශ්නයකම නිවැරදි ප්‍රතිශතය · මුළු ප්‍රශ්න{" "}
                  {QUESTIONS.length}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {insights.hardestQuestion && (
                  <span className="rounded-full bg-coral/15 px-3 py-1 text-coral">
                    අපහසුම: ප්‍රශ්නය {insights.hardestQuestion.index} (
                    {insights.hardestQuestion.accuracy}%)
                  </span>
                )}
                {insights.easiestQuestion && (
                  <span className="rounded-full bg-leaf/15 px-3 py-1 text-forest">
                    පහසුම: ප්‍රශ්නය {insights.easiestQuestion.index} (
                    {insights.easiestQuestion.accuracy}%)
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {insights.questionInsights.map((question) => (
                <div key={question.id}>
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-forest-deep">
                      ප්‍රශ්නය {question.index}{" "}
                      <span className="font-medium text-moss">
                        · {question.levelSi}
                      </span>
                    </p>
                    <p className="text-sm font-bold text-forest">
                      {question.accuracy}% ({question.correctCount}/
                      {question.total})
                    </p>
                  </div>
                  <p className="mb-2 line-clamp-2 text-xs text-moss sm:text-sm">
                    {question.prompt}
                  </p>
                  <div className="h-2.5 overflow-hidden rounded-full bg-mist/80">
                    <div
                      className={`h-full rounded-full ${
                        question.accuracy >= 75
                          ? "bg-leaf"
                          : question.accuracy >= 50
                            ? "bg-amber"
                            : "bg-coral"
                      }`}
                      style={{ width: `${question.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="animate-rise-delay">
        <div className="mb-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-forest-deep sm:text-3xl">
            සියලු පුහුණුවන්නන්
          </h2>
          <p className="mt-1 text-sm text-moss">
            නම · වයස · WhatsApp අංකය · ලකුණු
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-3xl border border-white/80 bg-white/90 p-8 text-center shadow-[0_18px_40px_rgba(18,48,36,0.1)] sm:p-10">
            <p className="font-[family-name:var(--font-display)] text-2xl text-forest-deep">
              තවම ප්‍රතිචාර නැත
            </p>
            <p className="mt-2 text-sm text-moss">
              සම්පූර්ණ කළ ප්‍රශ්නාවලි මෙහි ස්වයංක්‍රීයව පෙනේ.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {submissions.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-3xl bg-gradient-to-br p-5 shadow-sm ${scoreTone(item.percentage)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-wide uppercase opacity-70">
                        නම
                      </p>
                      <h3 className="mt-1 truncate text-lg font-bold text-forest-deep">
                        {item.name}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-sm font-black text-forest-deep">
                      {item.percentage}%
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 px-3 py-2">
                      <dt className="font-semibold text-moss">වයස</dt>
                      <dd className="font-bold text-forest-deep">{item.age}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 px-3 py-2">
                      <dt className="font-semibold text-moss">WhatsApp</dt>
                      <dd className="font-bold break-all text-forest-deep">
                        <a
                          href={`https://wa.me/${item.whatsapp.replace(/^\+/, "").replace(/^0/, "94")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline-offset-2 hover:underline"
                        >
                          {item.whatsapp}
                        </a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 px-3 py-2">
                      <dt className="font-semibold text-moss">ලකුණු</dt>
                      <dd className="font-bold text-forest-deep">
                        {item.score}/{item.total}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 px-3 py-2">
                      <dt className="font-semibold text-moss">දිනය</dt>
                      <dd className="text-right text-xs font-semibold text-forest-deep">
                        {formatDate(item.submittedAt)}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-white/55 px-3 py-2">
                      <dt className="font-semibold text-moss">
                        දින 2 වැඩමුළුවෙන් ඉගෙන ගැනීමට අවශ්‍ය දේ
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed font-medium text-forest-deep">
                        {item.learningGoals?.trim() || "—"}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_18px_40px_rgba(18,48,36,0.1)]">
              <div className="border-b border-forest/10 px-4 py-3">
                <h3 className="text-sm font-bold text-forest-deep">
                  වගු දසුන (නම · වයස · WhatsApp)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gradient-to-r from-forest to-sky text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">නම</th>
                      <th className="px-4 py-3 font-semibold">වයස</th>
                      <th className="px-4 py-3 font-semibold">WhatsApp</th>
                      <th className="px-4 py-3 font-semibold">ඉගෙනුම් අපේක්ෂාව</th>
                      <th className="px-4 py-3 font-semibold">ලකුණු</th>
                      <th className="px-4 py-3 font-semibold">%</th>
                      <th className="px-4 py-3 font-semibold">දිනය</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((item, index) => (
                      <tr
                        key={item.id}
                        className={
                          index % 2 === 0 ? "bg-mist/50" : "bg-sky-soft/40"
                        }
                      >
                        <td className="px-4 py-3 text-moss">{index + 1}</td>
                        <td className="px-4 py-3 font-semibold text-forest-deep">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 font-medium">{item.age}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {item.whatsapp}
                        </td>
                        <td className="max-w-xs px-4 py-3 text-sm leading-relaxed text-forest-deep">
                          {item.learningGoals?.trim() || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {item.score}/{item.total}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-forest/10 px-3 py-1 font-semibold text-forest">
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-moss">
                          {formatDate(item.submittedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default function ResultsPage() {
  return (
    <main className="screen-shell relative flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -top-10 right-0 h-48 w-48 rounded-full bg-coral/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Suspense
          fallback={
            <div className="rounded-3xl bg-white/80 p-8 text-center text-moss">
              ප්‍රතිඵල පූරණය වෙමින්...
            </div>
          }
        >
          <ResultsContent />
        </Suspense>
      </div>
    </main>
  );
}
