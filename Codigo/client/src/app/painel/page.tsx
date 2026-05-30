"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { StatCard } from "@/components/ui/StatCard";
import Link from "next/link";
import { Building2, GraduationCap, Users } from "lucide-react";
import {
  getInstitutions,
  getProfessors,
  getStudents,
  type Institution,
  type ProfessorModel,
  type StudentModel,
} from "@/lib/api";

// ── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [professors, setProfessors] = useState<ProfessorModel[]>([]);
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [inst, prof, stud] = await Promise.all([
          getInstitutions(),
          getProfessors(),
          getStudents(),
        ]);
        setInstitutions(inst);
        setProfessors(prof);
        setStudents(stud);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  const totalCoins =
    professors.reduce((s, p) => s + (p.coinBalance ?? 0), 0) +
    students.reduce((s, st) => s + (st.coinBalance ?? 0), 0);

  return (
    <div className="p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Painel
      </p>
      <h1 className="mt-1 font-display text-4xl font-extrabold">
        Admin <span className="text-primary">Central</span>
      </h1>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Instituições"
          value={loading ? "—" : institutions.length}
          variant="blue"
          icon={<Building2 className="h-8 w-8" />}
        />
        <StatCard
          label="Professores"
          value={loading ? "—" : professors.length}
          variant="red"
          icon={<GraduationCap className="h-8 w-8" />}
        />
        <StatCard
          label="Alunos"
          value={loading ? "—" : students.length}
          variant="yellow"
          icon={<Users className="h-8 w-8" />}
        />
        <StatCard
          label="Moedas em circulação"
          value={loading ? "—" : totalCoins.toLocaleString("pt-BR")}
          variant="black"
          icon={<CoinIcon className="h-8 w-8" />}
        />
      </div>

      {/* Institutions list */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">
            Instituições parceiras
          </h2>
          <Link
            href="/painel/instituicoes"
            className="rounded-full border-2 border-border bg-surface px-4 py-1.5 text-sm font-bold shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:bg-muted active:shadow-none"
          >
            Ver todas
          </Link>
        </div>

        <div className="rounded-2xl border-[3px] border-border bg-surface shadow-[4px_4px_0_0_hsl(var(--border))] overflow-hidden">
          {loading ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              Carregando…
            </div>
          ) : institutions.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              Nenhuma instituição cadastrada.
            </div>
          ) : (
            <ul>
              {institutions.slice(0, 10).map((inst, idx) => (
                <li
                  key={inst.id}
                  className={`flex items-center justify-between px-6 py-4 ${
                    idx < institutions.length - 1 && idx < 9
                      ? "border-b-2 border-border"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border bg-muted text-xs font-extrabold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-foreground">
                      {inst.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Student / Company Dashboard (unchanged) ───────────────────────────────────

function UserDashboard() {
  const { user, profile } = useAuth();

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PainelPage() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") return <AdminDashboard />;
  return <UserDashboard />;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  );
}
function ProfIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function StudentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

