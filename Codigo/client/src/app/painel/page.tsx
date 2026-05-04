"use client";

import { useAuth } from "@/context/AuthContext";
import { CoinIcon } from "@/components/ui/CoinIcon";

export default function PainelPage() {
  const { user, profile } = useAuth();

  const isStudent = user?.role === "STUDENT";
  const isCompany = user?.role === "PARTNER_COMPANY";

  const displayName =
    (profile as { displayName?: string })?.displayName ?? user?.email ?? "";

  return (
    <div className="p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Painel
      </p>
      <h1 className="mt-1 font-display text-4xl font-extrabold">
        Olá,{" "}
        <span className="text-primary">{displayName.split(" ")[0]}</span>!
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Balance card */}
        <div className="rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <CoinIcon className="h-8 w-8" />
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
              Saldo de moedas
            </p>
          </div>
          <p className="mt-3 font-display text-5xl font-extrabold text-foreground">
            {user?.coinBalance ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">moedas disponíveis</p>
        </div>

        {isCompany && (
          <div className="rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
              Minha empresa
            </p>
            <p className="mt-3 text-sm text-foreground">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
