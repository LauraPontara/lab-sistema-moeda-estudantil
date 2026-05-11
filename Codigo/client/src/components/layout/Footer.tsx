import Link from "next/link";

const systemLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para professores", href: "#economia" },
  { label: "Para alunos", href: "#como-funciona" },
  { label: "Para empresas", href: "#parceiros" },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-border bg-foreground">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-16 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto] md:gap-16">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-white">
              XP Estudantil
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
              A moeda do mérito. Reconheça, conquiste, troque.
            </p>
          </div>

          <div>
            <h4 className="font-display text-base font-extrabold text-white">
              Sistema
            </h4>
            <ul className="mt-3 space-y-2">
              {systemLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-extrabold text-white">
              Contato
            </h4>
            <p className="mt-3 text-sm text-white/80">
              contato@xp-estudantil.app
            </p>
            <p className="mt-8 text-xs text-white/60">
              © 2025 XP Estudantil — Projeto experimental
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
