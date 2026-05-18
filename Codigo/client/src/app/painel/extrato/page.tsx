"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getMyCoinStatement, type CoinStatement } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

export default function ExtratoPage() {
  const { user } = useAuth();
  const [statement, setStatement] = useState<CoinStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStatement() {
      try {
        const data = await getMyCoinStatement();
        setStatement(data);
      } catch (err) {
        console.error(err);
        setError("Nao foi possivel carregar o extrato.");
      } finally {
        setLoading(false);
      }
    }
    void loadStatement();
  }, []);

  const professorEntries = useMemo(
    () => (statement?.entries ?? []).filter((entry) => entry.direction === "OUT"),
    [statement],
  );

  const studentEntries = useMemo(
    () => (statement?.entries ?? []).filter((entry) => entry.direction === "IN"),
    [statement],
  );

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Carregando extrato...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border-[3px] border-border bg-primary/15 px-4 py-3 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">Extrato indisponivel.</p>
      </div>
    );
  }

  const isProfessor = user?.role === "PROFESSOR";
  const isStudent = user?.role === "STUDENT";
  const visibleEntries = isProfessor ? professorEntries : isStudent ? studentEntries : [];
  const titleHighlight = isProfessor ? "Envios" : "Extrato";
  const balanceLabel = isProfessor ? "Saldo disponivel" : "Saldo de moedas";
  const emptyMessage = isProfessor
    ? "Voce ainda nao enviou moedas para alunos."
    : "Voce ainda nao recebeu moedas de professores.";

  return (
    <div className="p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Historico
      </p>
      <h1 className="mt-1 font-display text-4xl font-extrabold">
        Meu <span className="text-primary">{titleHighlight}</span>
      </h1>

      <div className="mt-6 max-w-xs rounded-2xl border-[3px] border-border bg-surface p-5 shadow-[4px_4px_0_0_hsl(var(--border))]">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {balanceLabel}
        </p>
        <p className="mt-2 font-display text-5xl font-extrabold text-foreground">
          {statement.balance}
        </p>
        <p className="text-sm font-semibold text-muted-foreground">XP</p>
      </div>

      <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
        {visibleEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="divide-y-2 divide-border">
            {visibleEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-border ${
                      isProfessor
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {isProfessor ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-display text-2xl font-extrabold text-foreground">
                      {isProfessor ? "Para " : "Recebido de Prof. "}
                      <span className="text-primary">{entry.counterpartName}</span>
                    </p>
                    <p className="text-sm text-foreground">{entry.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-display text-4xl font-extrabold ${
                    isProfessor ? "text-primary" : "text-[#57be63]"
                  }`}
                >
                  {isProfessor ? "-" : "+"}
                  {entry.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

