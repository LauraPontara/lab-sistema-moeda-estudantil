import Image from "next/image";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ToonButton } from "@/components/ui/ToonButton";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-36 md:py-44">
      <Image
        src="/images/bg-forest.png"
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(249,217,78,0.35) 0%, transparent 40%, transparent 60%, rgba(249,217,78,0.35) 100%)",
        }}
      />

      <div className="relative z-20 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16">
        <div
          className="mx-auto max-w-2xl rounded-3xl border-[3px] border-border p-10 text-center shadow-toon-lg backdrop-blur-md md:p-14"
          style={{ background: "rgba(249, 217, 78, 0.85)" }}
        >
          <SectionEyebrow color="primary" align="center">
            Sua aventura começa aqui
          </SectionEyebrow>

          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            <span className="text-foreground">Pronto pra começar a </span>
            <span className="text-primary">jogada</span>
            <span className="text-foreground">?</span>
          </h2>

          <p className="mt-4 text-base text-foreground/80 sm:text-lg">
            Cadastre-se em menos de um minuto. Sem cartão, sem custo.
          </p>

          <ToonButton
            variant="primary"
            size="lg"
            href="/cadastro"
            className="mt-8"
          >
            Criar minha conta
          </ToonButton>
        </div>
      </div>
    </section>
  );
}
