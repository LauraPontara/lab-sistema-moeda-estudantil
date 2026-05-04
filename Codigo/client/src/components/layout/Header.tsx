"use client";

import Link from "next/link";
import { useState } from "react";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { ToonButton } from "@/components/ui/ToonButton";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Parceiros", href: "#parceiros" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-background/95 backdrop-blur-sm shadow-[0_2px_0_0_hsl(var(--border))]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <CoinIcon className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold leading-none">
            <span className="text-foreground">XP </span>
            <span className="text-primary">Estudantil</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Menu principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-bold text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/entrar"
            className="font-bold text-sm text-foreground transition-colors hover:text-primary"
          >
            Entrar
          </Link>
          <ToonButton variant="primary" size="sm" href="/cadastro">
            Cadastrar
          </ToonButton>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-[3px] border-border bg-surface shadow-toon-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none md:hidden"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t-[3px] border-border bg-background/98 md:hidden">
          <nav className="flex flex-col px-5 py-4" aria-label="Menu mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border/30 py-4 font-bold text-sm uppercase tracking-[0.12em] text-foreground transition-colors hover:text-primary last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 pb-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center justify-center rounded-full border-[3px] border-border bg-surface font-display text-base font-extrabold text-foreground shadow-toon transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Entrar
              </Link>
              <ToonButton variant="primary" size="md" href="/cadastro" className="h-12 w-full justify-center">
                Cadastrar
              </ToonButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
