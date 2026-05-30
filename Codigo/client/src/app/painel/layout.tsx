"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useEffect } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  User,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";

const studentNav = [
  { label: "Painel", href: "/painel", icon: LayoutDashboard },
  { label: "Trocar moedas", href: "/painel/trocar", icon: ArrowLeftRight },
  { label: "Extrato", href: "/painel/extrato", icon: FileText },
  { label: "Perfil", href: "/painel/perfil", icon: User },
];

const companyNav = [
  { label: "Painel", href: "/painel", icon: LayoutDashboard },
  { label: "Minhas vantagens", href: "/painel/vantagens", icon: ArrowLeftRight },
  { label: "Perfil", href: "/painel/perfil", icon: User },
];

const adminNav = [
  { label: "Painel", href: "/painel", icon: LayoutDashboard },
  { label: "Instituições", href: "/painel/instituicoes", icon: Building2 },
  { label: "Professores", href: "/painel/professores", icon: GraduationCap },
  { label: "Usuários", href: "/painel/usuarios", icon: Users },
];



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading, logout } = useAuth();
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
  const isAdmin = user.role === "ADMIN";
  const navItems = isAdmin
    ? adminNav
    : isStudent
    ? studentNav
    : isCompany
    ? companyNav
    : studentNav;

  const roleLabel = isAdmin
    ? "Administrador"
    : isStudent
    ? "Aluno"
    : isCompany
    ? "Empresa"
    : user.role;
  const displayName = (profile as { displayName?: string })?.displayName ?? user.email;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-52 shrink-0 flex-col border-r-[3px] border-border bg-surface">
        {/* Logo */}
        <div className="border-b-[3px] border-border px-5 py-4">
          <Link href="/" className="flex items-center gap-2 select-none">
            <BrandLogo imageClassName="h-11 w-auto" />
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
                <Icon className="h-4 w-4" />
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
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center rounded-xl border-[3px] border-border bg-surface px-3 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:bg-muted active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
