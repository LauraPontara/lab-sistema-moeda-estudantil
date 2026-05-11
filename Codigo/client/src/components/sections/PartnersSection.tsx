import Image from "next/image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ToonButton } from "@/components/ui/ToonButton";
import { DecorativeSymbols } from "@/components/ui/DecorativeSymbols";

export function PartnersSection() {
  return (
    <section
      id="parceiros"
      className="relative overflow-hidden border-y-[3px] border-border py-20 md:py-24"
      style={{ background: "#F6D046" }}
    >
      <DecorativeSymbols />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
        <div className="grid gap-12 md:grid-cols-[300px_1fr] md:items-center md:gap-16 lg:grid-cols-[360px_1fr]">
          <div className="flex justify-center md:justify-start">
            <div className="relative h-64 w-64 flex-shrink-0 drop-shadow-[0_20px_13px_rgba(0,0,0,0.08)] sm:h-72 sm:w-72">
              <Image
                src="/images/mascot-shop.png"
                alt="Mascote loja parceira"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SectionEyebrow color="foreground" align="left">
              Para empresas
            </SectionEyebrow>

            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              <span className="text-foreground">Vire </span>
              <span className="text-primary">parceiro</span>
              <span className="text-foreground"> e atraia o</span>
              <br />
              <span className="text-foreground">público estudantil.</span>
            </h2>

            <p className="mt-2 text-base text-foreground/80 dark:text-black/80 sm:text-lg leading-relaxed">
              Cadastre as vantagens que quer oferecer. Defina o custo em moedas.
              Receba os cupons gerados pelo sistema e confira a troca presencial.
            </p>

            <ToonButton
              variant="dark"
              size="md"
              href="/cadastro"
              className="mt-2 self-start"
            >
              Cadastrar empresa
            </ToonButton>
          </div>
        </div>
      </div>
    </section>
  );
}
