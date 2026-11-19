import Link from "next/link";
import { connection } from "next/server";
import { QUESTIONS } from "@/lib/questions";
import { getSubmissions } from "@/lib/store";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("si-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ResultsPage() {
  await connection();
  const submissions = await getSubmissions();
  const average =
    submissions.length === 0
      ? 0
      : Math.round(
          submissions.reduce((sum, item) => sum + item.percentage, 0) /
            submissions.length,
        );

  return (
    <main className="screen-shell relative flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -top-10 right-0 h-48 w-48 rounded-full bg-coral/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="animate-rise mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber uppercase">
              ප්‍රතිඵල වාර්තාව
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-forest-deep sm:text-5xl">
              පුහුණුවීම් ප්‍රතිචාර
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-moss sm:text-base">
              ඩිජිටල් සන්නිවේදනය සහ ඉදිරිපත් කිරීමේ කුසලතා සංවර්ධන වැඩසටහනේ
              ප්‍රතිඵල.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex justify-center rounded-2xl bg-gradient-to-r from-forest to-sky px-5 py-3 text-sm font-bold text-white"
          >
            ප්‍රශ්නාවලියට ආපසු
          </Link>
        </header>

        <section className="animate-rise mb-6 grid gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-3xl bg-gradient-to-br from-leaf/20 to-mist p-5 shadow-sm">
            <p className="text-sm text-moss">මුළු ප්‍රතිචාර</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
              {submissions.length}
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-sky/20 to-sky-soft p-5 shadow-sm">
            <p className="text-sm text-moss">සාමාන්‍ය ලකුණු</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
              {average}%
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-violet/15 to-amber/15 p-5 shadow-sm">
            <p className="text-sm text-moss">ප්‍රශ්න ගණන</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-forest-deep">
              {QUESTIONS.length}
            </p>
          </div>
        </section>

        <section className="animate-rise-delay overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_18px_40px_rgba(18,48,36,0.1)]">
          {submissions.length === 0 ? (
            <div className="p-8 text-center sm:p-10">
              <p className="font-[family-name:var(--font-display)] text-2xl text-forest-deep">
                තවම ප්‍රතිචාර නැත
              </p>
              <p className="mt-2 text-sm text-moss">
                සම්පූර්ණ කළ ප්‍රශ්නාවලි මෙහි ස්වයංක්‍රීයව පෙනේ.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gradient-to-r from-forest to-sky text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">නම</th>
                    <th className="px-4 py-3 font-semibold">වයස</th>
                    <th className="px-4 py-3 font-semibold">WhatsApp</th>
                    <th className="px-4 py-3 font-semibold">ලකුණු</th>
                    <th className="px-4 py-3 font-semibold">ඉදිරිපත් කළ දිනය</th>
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
                      <td className="px-4 py-3 font-medium text-forest-deep">
                        {item.name}
                      </td>
                      <td className="px-4 py-3">{item.age}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.whatsapp}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gradient-to-r from-leaf/20 to-violet/20 px-3 py-1 font-semibold text-forest">
                          {item.score}/{item.total} ({item.percentage}%)
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
          )}
        </section>
      </div>
    </main>
  );
}
