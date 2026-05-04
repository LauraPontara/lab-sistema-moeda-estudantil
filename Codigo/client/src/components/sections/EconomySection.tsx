import Image from "next/image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ChecklistItem } from "@/components/ui/ChecklistItem";

const checkItems = [
  "Saldo acumula entre semestres",
  "Mensagem obrigatória do professor",
  "Notificação por email para o aluno",
  "Cupom único na troca presencial",
];

export function EconomySection() {
  return (
    <section id="economia" className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="flex flex-col gap-4">
            <SectionEyebrow color="primary" align="left">
              A economia da moeda
            </SectionEyebrow>

            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              <span className="text-foreground">Cada semestre, </span>
              <span className="text-primary">1.000</span>
              <br />
              <span className="text-foreground">moedas por professor.</span>
            </h2>

            <p className="mt-2 text-base text-muted-foreground sm:text-lg leading-relaxed">
              Saldo acumulável. Toda transação registrada. Email automático ao
              aluno quando recebe e cupom único quando troca por uma vantagem.
            </p>

            <ul className="mt-2 space-y-3">
              {checkItems.map((item) => (
                <ChecklistItem key={item}>{item}</ChecklistItem>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-sm aspect-square md:max-w-full md:aspect-[4/3] drop-shadow-[0_20px_13px_rgba(0,0,0,0.03)]">
              <Image
                src="/images/mascot-professor.png"
                alt="Professor mascote distribuindo moedas"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
