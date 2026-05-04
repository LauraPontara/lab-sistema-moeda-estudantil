import Link from "next/link";

type Swatch = {
  name: string;
  tokenClass: string;
  textClass?: string;
};

const baseSwatches: Swatch[] = [
  { name: "background", tokenClass: "bg-background" },
  { name: "surface", tokenClass: "bg-surface" },
  { name: "elevated", tokenClass: "bg-elevated" },
  { name: "sunken", tokenClass: "bg-sunken" },
  { name: "primary", tokenClass: "bg-primary", textClass: "text-primary-foreground" },
  { name: "secondary", tokenClass: "bg-secondary", textClass: "text-secondary-foreground" },
  { name: "accent", tokenClass: "bg-accent", textClass: "text-accent-foreground" },
  { name: "muted", tokenClass: "bg-muted" },
  { name: "success", tokenClass: "bg-success", textClass: "text-surface" },
  { name: "warning", tokenClass: "bg-warning", textClass: "text-surface" },
  { name: "destructive", tokenClass: "bg-destructive", textClass: "text-destructive-foreground" },
  { name: "info", tokenClass: "bg-info", textClass: "text-surface" },
];

const toonSwatches: Swatch[] = [
  { name: "toon-blue", tokenClass: "bg-toon-blue", textClass: "text-white" },
  { name: "toon-red", tokenClass: "bg-toon-red", textClass: "text-white" },
  { name: "toon-yellow", tokenClass: "bg-toon-yellow" },
  { name: "toon-black", tokenClass: "bg-toon-black", textClass: "text-white" },
];

export default function DesignSystemPage() {
  return (
    <main className="paper-grain relative min-h-screen bg-background px-5 py-10 text-foreground md:px-10 md:py-12">
      <span className="deco-shape right-10 top-10 h-24 w-24 bg-toon-blue" />
      <span className="deco-shape bottom-14 left-6 h-20 w-20 bg-toon-red" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="toon-card-lg relative overflow-hidden p-6 md:p-8">
          <div className="relative z-10">
            <p className="font-toon text-xs uppercase tracking-[0.2em] text-muted-foreground">
              XP Estudantil
            </p>
            <h1 className="mt-2 text-4xl font-display tracking-tight md:text-6xl">
              Design System
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Referencia visual para cores, tipografia, componentes e utilitarios
              do frontend no estilo cartoon vintage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-2xl border-[3px] border-border bg-surface px-5 font-semibold shadow-toon transition-all hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Voltar para Home
              </Link>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-2xl border-[3px] border-border bg-accent px-5 font-toon text-xs uppercase tracking-wide text-accent-foreground shadow-toon transition-all hover:bg-accent-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Referencia tecnica
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="toon-card p-5">
            <h2 className="text-2xl font-display">Paleta semantica</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tokens globais usados em componentes e layouts.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {baseSwatches.map((swatch) => (
                <article
                  key={swatch.name}
                  className={`rounded-2xl border-[3px] border-border p-3 shadow-toon-sm ${swatch.tokenClass} ${swatch.textClass ?? "text-foreground"}`}
                >
                  <p className="font-toon text-[11px] uppercase tracking-widest">
                    {swatch.name}
                  </p>
                  <p className="mt-5 text-xs opacity-85">{swatch.tokenClass}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="toon-card p-5">
            <h2 className="text-2xl font-display">Cores de personagem</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Variacoes para cards decorativos e destaques visuais.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {toonSwatches.map((swatch) => (
                <article
                  key={swatch.name}
                  className={`rounded-2xl border-[3px] border-border p-3 shadow-toon-sm ${swatch.tokenClass} ${swatch.textClass ?? "text-foreground"}`}
                >
                  <p className="font-toon text-[11px] uppercase tracking-widest">
                    {swatch.name}
                  </p>
                  <p className="mt-5 text-xs opacity-85">{swatch.tokenClass}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="toon-card p-5">
            <h2 className="text-2xl font-display">Tipografia</h2>
            <div className="mt-5 space-y-4">
              <article>
                <p className="font-toon text-xs uppercase tracking-widest text-muted-foreground">
                  font-display
                </p>
                <p className="font-display text-4xl tracking-tight">
                  Moedas estudantis em destaque
                </p>
              </article>
              <article>
                <p className="font-toon text-xs uppercase tracking-widest text-muted-foreground">
                  font-toon
                </p>
                <p className="font-toon text-2xl">Labels, numeros e badges cartoon</p>
              </article>
              <article>
                <p className="font-toon text-xs uppercase tracking-widest text-muted-foreground">
                  font-body
                </p>
                <p className="text-base">
                  Nunito para leitura de paragrafo, interfaces e formularios com
                  ritmo visual consistente em desktop e mobile.
                </p>
              </article>
            </div>
          </div>

          <div className="toon-card p-5">
            <h2 className="text-2xl font-display">Sombras cartoon</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border-[3px] border-border bg-surface p-4 shadow-toon-sm">
                shadow-toon-sm
              </div>
              <div className="rounded-2xl border-[3px] border-border bg-surface p-4 shadow-toon">
                shadow-toon
              </div>
              <div className="rounded-2xl border-[3px] border-border bg-surface p-4 shadow-toon-lg">
                shadow-toon-lg
              </div>
              <div className="rounded-2xl border-[3px] border-border bg-surface p-4 shadow-toon-xl">
                shadow-toon-xl
              </div>
            </div>
          </div>
        </section>

        <section className="toon-card-lg p-5 md:p-6">
          <h2 className="text-2xl font-display">Componentes base</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Exemplos de estilos para botoes, card e input seguindo os tokens.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="font-toon text-xs uppercase tracking-widest text-muted-foreground">
                Botoes
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex h-11 items-center justify-center rounded-2xl border-[3px] border-border bg-primary px-5 font-toon text-xs uppercase tracking-wide text-primary-foreground shadow-toon transition-all hover:bg-primary-hover active:translate-x-0.5 active:translate-y-0.5 active:bg-primary-active active:shadow-none">
                  Primario
                </button>
                <button className="inline-flex h-11 items-center justify-center rounded-2xl border-[3px] border-border bg-secondary px-5 font-toon text-xs uppercase tracking-wide text-secondary-foreground shadow-toon transition-all hover:opacity-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                  Secundario
                </button>
                <button className="inline-flex h-11 items-center justify-center rounded-2xl border-[3px] border-border bg-surface px-5 font-semibold text-foreground shadow-toon transition-all hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                  Outline
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-toon text-xs uppercase tracking-widest text-muted-foreground">
                Input
              </p>
              <label className="block text-sm">
                Nome da instituicao
                <input
                  type="text"
                  placeholder="Ex.: Universidade XP"
                  className="mt-2 h-11 w-full rounded-2xl border-[3px] border-border bg-sunken px-3 text-sm shadow-toon-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
