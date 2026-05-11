"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useEffect } from "react";

const studentNav = [
  { label: "Painel", href: "/painel", icon: PainelIcon },
  { label: "Trocar moedas", href: "/painel/trocar", icon: TrocarIcon },
  { label: "Extrato", href: "/painel/extrato", icon: ExtratoIcon },
  { label: "Perfil", href: "/painel/perfil", icon: PerfilIcon },
];

const companyNav = [
  { label: "Painel", href: "/painel", icon: PainelIcon },
  { label: "Minhas vantagens", href: "/painel/vantagens", icon: TrocarIcon },
  { label: "Perfil", href: "/painel/perfil", icon: PerfilIcon },
];

function PainelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function TrocarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" />
      <path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}
function ExtratoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function PerfilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/entrar");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <CoinIcon className="h-10 w-10 animate-pulse" />
      </div>
    );
  }

  const isStudent = user.role === "STUDENT";
  const isCompany = user.role === "PARTNER_COMPANY";
  const navItems = isStudent ? studentNav : isCompany ? companyNav : studentNav;

  const roleLabel = isStudent ? "Aluno" : isCompany ? "Empresa" : user.role;
  const displayName = (profile as { displayName?: string })?.displayName ?? user.email;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col border-r-[3px] border-border bg-surface">
        {/* Logo */}
        <div className="border-b-[3px] border-border px-5 py-4">
          <Link href="/" className="flex items-center gap-2 select-none">
            <CoinIcon className="h-7 w-7" />
            <span className="font-display text-lg font-extrabold leading-none">
              <span className="text-foreground">XP </span>
              <span className="text-primary">Estudantil</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))]"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t-[3px] border-border px-4 py-4 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {roleLabel}
            </p>
            <p className="mt-0.5 truncate text-sm font-bold uppercase text-foreground">
              {displayName}
            </p>
          </div>
          <AnimatedThemeToggler
            variant="circle"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
