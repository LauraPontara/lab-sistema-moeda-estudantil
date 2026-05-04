import Link from "next/link";

export default function Home() {
  return (
    <main className="paper-grain relative flex flex-1 items-center overflow-hidden px-6 py-14 md:px-10">
      <span className="deco-shape -left-16 -top-20 h-48 w-48 bg-toon-red" />
      <span className="deco-shape -right-12 top-32 h-32 w-32 bg-toon-blue" />

      <section className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-5">
          <p className="font-toon text-sm uppercase tracking-[0.18em] text-muted-foreground">
            XP Estudantil
          </p>

          <h1 className="text-4xl leading-none font-display tracking-tight md:text-7xl">
            Sistema de Moedas
            <br />
            <span className="ink-underline">Design consistente</span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Este frontend agora segue os tokens de cor e tipografia do design
            system. Use a pagina dedicada para consultar paleta, fontes,
            componentes e classes utilitarias em um unico lugar.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/design-system"
              className="inline-flex h-12 items-center justify-center rounded-2xl border-[3px] border-border bg-primary px-6 font-toon text-sm uppercase tracking-wide text-primary-foreground shadow-toon transition-all hover:bg-primary-hover active:translate-x-0.5 active:translate-y-0.5 active:bg-primary-active active:shadow-none"
            >
              Abrir Design System
            </Link>

            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-2xl border-[3px] border-border bg-surface px-6 font-semibold text-foreground shadow-toon transition-all hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Docs Next.js
            </a>
          </div>
        </div>

        <aside className="toon-card-lg animate-float-slow p-6 md:p-8">
          <p className="font-toon text-xs uppercase tracking-widest text-muted-foreground">
            Guia rapido
          </p>
          <h2 className="mt-2 text-3xl font-display">Visual cuphead</h2>
          <ul className="mt-5 space-y-3 text-sm text-foreground/90">
            <li>Contorno forte com border 3px.</li>
            <li>Sombras deslocadas no estilo cartoon.</li>
            <li>Paleta semantica em HSL para light e dark.</li>
            <li>Tipografia: display, toon e body separadas.</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
