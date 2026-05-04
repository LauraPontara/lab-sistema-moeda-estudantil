import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { StepCard } from "@/components/ui/StepCard";

function ProfessorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 3L1 9l11 6 11-6-11-6z" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
    </svg>
  );
}

function CoinIcon2() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M12 7v10M9.5 9.5C9.5 8.67 10.17 8 11 8h2a1.5 1.5 0 010 3H11a1.5 1.5 0 000 3h2a1.5 1.5 0 010 3h-2a1.5 1.5 0 01-1.5-1.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="white" />
    </svg>
  );
}

const steps = [
  {
    iconColor: "red" as const,
    icon: <ProfessorIcon />,
    title: "Professores reconhecem",
    description:
      "Cada professor recebe 1.000 moedas por semestre para distribuir aos alunos por mérito.",
  },
  {
    iconColor: "yellow" as const,
    icon: <CoinIcon2 />,
    title: "Alunos acumulam",
    description:
      "Receba moedas pelo seu esforço. Cada uma vem com uma mensagem do professor.",
  },
  {
    iconColor: "blue" as const,
    icon: <TagIcon />,
    title: "Trocam por vantagens",
    description:
      "Use suas moedas em descontos de R.U., mensalidade, livros e parceiros locais.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="border-y-[3px] border-border bg-accent py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <SectionEyebrow color="white" align="center">
            Como funciona
          </SectionEyebrow>
          <h2 className="font-display text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl">
            Três passos. Zero confusão.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
