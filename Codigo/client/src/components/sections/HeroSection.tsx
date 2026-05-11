import Image from "next/image";
import { ToonButton } from "@/components/ui/ToonButton";
import { DecorativeSymbols } from "@/components/ui/DecorativeSymbols";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 lg:min-h-[600px] lg:flex lg:items-center">
      <DecorativeSymbols />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center rounded-full border-[3px] border-foreground bg-foreground px-4 py-1 shadow-toon-sm">
            <span className="font-bold text-[11px] uppercase tracking-[0.12em] text-surface">
              Release 1 · 1930s rubber hose vibes
            </span>
          </span>

          <h1 className="font-display font-extrabold leading-none tracking-tight text-5xl sm:text-6xl md:text-7xl">
            <span className="text-primary">A moeda</span>
            <br />
            <span className="text-foreground">do </span>
            <span className="ink-underline text-foreground">mérito</span>
            <br />
            <span className="text-accent">estudantil</span>
          </h1>

          <p className="max-w-xl text-base text-foreground/80 sm:text-lg md:text-xl">
            Professores reconhecem. Alunos acumulam. Empresas premiam. Tudo
            num universo vintage que dá gosto de jogar.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <ToonButton variant="primary" size="lg" href="/cadastro">
              Começar agora
            </ToonButton>
            <ToonButton variant="outline" size="lg" href="/entrar">
              Já tenho conta
            </ToonButton>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 lg:hidden">
          <div className="relative h-40 w-40 sm:h-52 sm:w-52">
            <Image
              src="/images/mascot-red.png"
              alt="Mascote vermelho"
              fill
              className="object-contain animate-float-slow"
            />
          </div>
          <div className="relative h-40 w-40 sm:h-52 sm:w-52">
            <Image
              src="/images/mascot-blue.png"
              alt="Mascote azul"
              fill
              className="object-contain animate-float-slow [animation-delay:1.2s]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
