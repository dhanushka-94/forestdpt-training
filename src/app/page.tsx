import QuestionnaireForm from "@/components/QuestionnaireForm";

export default function HomePage() {
  return (
    <main className="screen-shell relative flex flex-1 flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
      <div className="glow-orb pointer-events-none absolute -top-16 right-[-4rem] h-56 w-56 rounded-full bg-amber/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 left-[-3rem] h-48 w-48 rounded-full bg-sky/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-40 w-40 rounded-full bg-violet/25 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col">
        <header className="animate-rise mb-5">
          <p className="text-[11px] font-bold tracking-[0.14em] text-amber uppercase sm:text-xs">
            වන සංරක්ෂණ දෙපාර්තමේන්තුව
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[1.7rem] leading-tight text-forest-deep sm:text-4xl">
            ඩිජිටල් සන්නිවේදනය සහ ඉදිරිපත් කිරීමේ කුසලතා
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-moss sm:text-base">
            නිලධාරීන් සඳහා සංවර්ධන වැඩසටහනේ ප්‍රශ්නාවලිය — මූලික සිට මධ්‍යම
            මට්ටම දක්වා ප්‍රශ්න 10ක්. එක වේලාවකට එක් ප්‍රශ්නයක්.
          </p>
        </header>

        <QuestionnaireForm />
      </div>
    </main>
  );
}
