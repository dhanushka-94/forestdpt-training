import QuestionnaireForm from "@/components/QuestionnaireForm";
import { TRAINING_ORG } from "@/lib/trainers";

export default function HomePage() {
  return (
    <main className="screen-shell relative flex flex-1 flex-col overflow-x-hidden px-4 py-4 sm:px-6 sm:py-8">
      <div className="glow-orb pointer-events-none absolute -top-16 right-[-4rem] h-56 w-56 rounded-full bg-amber/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 left-[-3rem] h-48 w-48 rounded-full bg-sky/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-40 w-40 rounded-full bg-violet/25 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col">
        <header className="animate-rise mb-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-white">
              {TRAINING_ORG.partnerSi}
            </span>
            <span className="rounded-full bg-sky/15 px-3 py-1 text-[11px] font-bold text-sky">
              {TRAINING_ORG.shortName} · {TRAINING_ORG.locationSi}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[1.65rem] leading-tight text-forest-deep sm:text-4xl">
            ඩිජිටල් සන්නිවේදනය සහ ඉදිරිපත් කිරීමේ කුසලතා
          </h1>
        </header>

        <QuestionnaireForm />
      </div>
    </main>
  );
}
