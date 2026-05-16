"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  getStudents,
  getProfessors,
  getPartnerCompanies,
  deleteUser,
  type StudentModel,
  type ProfessorModel,
  type PartnerCompanyModel,
} from "@/lib/api";

type Tab = "alunos" | "professores" | "empresas";

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteModal({
  name,
  onConfirm,
  onClose,
  loading,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Excluir usuário"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-full border-2 border-border bg-surface px-5 py-2 text-sm font-bold transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full border-2 border-border bg-destructive px-5 py-2 text-sm font-bold text-white shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:opacity-90 disabled:opacity-50 active:shadow-none"
          >
            {loading ? "Excluindo…" : "Excluir"}
          </button>
        </>
      }
    >
      <p className="text-sm text-foreground">
        Tem certeza que deseja excluir <strong>{name}</strong>? Esta ação não
        pode ser desfeita.
      </p>
    </Modal>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))]"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
            active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

const TH = "px-4 py-3 text-left text-xs font-extrabold uppercase tracking-widest text-muted-foreground whitespace-nowrap";
const TD = "px-4 py-4 text-sm text-foreground whitespace-nowrap";

function EmptyRow({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={99} className="py-12 text-center text-sm text-muted-foreground">
        {message}
      </td>
    </tr>
  );
}

function DeleteBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Excluir
    </button>
  );
}

// ── Alunos table ─────────────────────────────────────────────────────────────

function AlunosTable({
  students,
  search,
  onDelete,
}: {
  students: StudentModel[];
  search: string;
  onDelete: (s: StudentModel) => void;
}) {
  const q = search.toLowerCase();
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q) ||
      s.cpf.includes(q),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-[3px] border-border bg-muted">
            <th className={TH}>Nome</th>
            <th className={TH}>Email</th>
            <th className={TH}>CPF</th>
            <th className={TH}>RG</th>
            <th className={TH}>Curso</th>
            <th className={TH}>CEP</th>
            <th className={TH}>Endereço</th>
            <th className={TH}>Saldo</th>
            <th className={TH}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <EmptyRow message={search ? "Nenhum aluno encontrado." : "Nenhum aluno cadastrado."} />
          ) : (
            filtered.map((s, idx) => (
              <tr
                key={s.id}
                className={idx < filtered.length - 1 ? "border-b-2 border-border" : ""}
              >
                <td className={`${TD} font-semibold`}>{s.name}</td>
                <td className={TD}>{s.email}</td>
                <td className={`${TD} font-mono`}>{s.cpf}</td>
                <td className={`${TD} font-mono`}>{s.rg || "—"}</td>
                <td className={TD}>{s.course}</td>
                <td className={`${TD} font-mono`}>{s.cep || "—"}</td>
                <td className={TD} style={{ maxWidth: 200 }}>
                  <span className="block truncate">{s.address || "—"}</span>
                </td>
                <td className={TD}>
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-xs font-extrabold">
                    {s.coinBalance.toLocaleString("pt-BR")} moedas
                  </span>
                </td>
                <td className={TD}>
                  <DeleteBtn onClick={() => onDelete(s)} label={`Excluir ${s.name}`} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Professores table ─────────────────────────────────────────────────────────

function ProfessoresTable({
  professors,
  search,
  onDelete,
}: {
  professors: ProfessorModel[];
  search: string;
  onDelete: (p: ProfessorModel) => void;
}) {
  const q = search.toLowerCase();
  const filtered = professors.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.cpf.includes(q),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-[3px] border-border bg-muted">
            <th className={TH}>Nome</th>
            <th className={TH}>Email</th>
            <th className={TH}>CPF</th>
            <th className={TH}>Departamento</th>
            <th className={TH}>Saldo</th>
            <th className={TH}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <EmptyRow message={search ? "Nenhum professor encontrado." : "Nenhum professor cadastrado."} />
          ) : (
            filtered.map((p, idx) => (
              <tr
                key={p.id}
                className={idx < filtered.length - 1 ? "border-b-2 border-border" : ""}
              >
                <td className={`${TD} font-semibold`}>{p.name}</td>
                <td className={TD}>{p.email}</td>
                <td className={`${TD} font-mono`}>{p.cpf}</td>
                <td className={TD}>{p.department}</td>
                <td className={TD}>
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-xs font-extrabold">
                    {p.coinBalance.toLocaleString("pt-BR")} moedas
                  </span>
                </td>
                <td className={TD}>
                  <DeleteBtn onClick={() => onDelete(p)} label={`Excluir ${p.name}`} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Empresas table ────────────────────────────────────────────────────────────

function EmpresasTable({
  companies,
  search,
  onDelete,
}: {
  companies: PartnerCompanyModel[];
  search: string;
  onDelete: (c: PartnerCompanyModel) => void;
}) {
  const q = search.toLowerCase();
  const filtered = companies.filter(
    (c) =>
      c.tradeName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.cnpj.includes(q),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-[3px] border-border bg-muted">
            <th className={TH}>Nome fantasia</th>
            <th className={TH}>CNPJ</th>
            <th className={TH}>Email</th>
            <th className={TH}>Endereço</th>
            <th className={TH}>Telefone</th>
            <th className={TH}>Saldo</th>
            <th className={TH}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <EmptyRow message={search ? "Nenhuma empresa encontrada." : "Nenhuma empresa cadastrada."} />
          ) : (
            filtered.map((c, idx) => (
              <tr
                key={c.id}
                className={idx < filtered.length - 1 ? "border-b-2 border-border" : ""}
              >
                <td className={`${TD} font-semibold`}>{c.tradeName}</td>
                <td className={`${TD} font-mono`}>{c.cnpj}</td>
                <td className={TD}>{c.email}</td>
                <td className={TD} style={{ maxWidth: 200 }}>
                  <span className="block truncate">{c.address || "—"}</span>
                </td>
                <td className={TD}>{c.contactPhone ?? "—"}</td>
                <td className={TD}>
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-xs font-extrabold">
                    {c.coinBalance.toLocaleString("pt-BR")} moedas
                  </span>
                </td>
                <td className={TD}>
                  <DeleteBtn onClick={() => onDelete(c)} label={`Excluir ${c.tradeName}`} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsuariosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("alunos");
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [professors, setProfessors] = useState<ProfessorModel[]>([]);
  const [companies, setCompanies] = useState<PartnerCompanyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");

  const [deleting, setDeleting] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setApiError("");
        const [studs, profs, comps] = await Promise.all([
          getStudents(),
          getProfessors(),
          getPartnerCompanies(),
        ]);
        setStudents(studs);
        setProfessors(profs);
        setCompanies(comps);
      } catch {
        setApiError("Não foi possível carregar os usuários.");
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteUser(deleting.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleting.id));
      setProfessors((prev) => prev.filter((p) => p.id !== deleting.id));
      setCompanies((prev) => prev.filter((c) => c.id !== deleting.id));
      setDeleting(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao excluir usuário.";
      setDeleteError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-1 font-display text-4xl font-extrabold">
            Usuá<span className="text-primary">rios</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "alunos"}
            onClick={() => { setActiveTab("alunos"); setSearch(""); }}
            count={students.length}
          >
            Alunos
          </TabButton>
          <TabButton
            active={activeTab === "professores"}
            onClick={() => { setActiveTab("professores"); setSearch(""); }}
            count={professors.length}
          >
            Professores
          </TabButton>
          <TabButton
            active={activeTab === "empresas"}
            onClick={() => { setActiveTab("empresas"); setSearch(""); }}
            count={companies.length}
          >
            Empresas parceiras
          </TabButton>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="search"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-xl border-2 border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Error */}
        {(apiError || deleteError) && (
          <div className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {apiError || deleteError}
          </div>
        )}

        {/* Table card */}
        <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface shadow-[4px_4px_0_0_hsl(var(--border))] overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Carregando…
            </div>
          ) : (
            <>
              {activeTab === "alunos" && (
                <AlunosTable
                  students={students}
                  search={search}
                  onDelete={(s) => setDeleting({ id: s.id, name: s.name })}
                />
              )}
              {activeTab === "professores" && (
                <ProfessoresTable
                  professors={professors}
                  search={search}
                  onDelete={(p) => setDeleting({ id: p.id, name: p.name })}
                />
              )}
              {activeTab === "empresas" && (
                <EmpresasTable
                  companies={companies}
                  search={search}
                  onDelete={(c) =>
                    setDeleting({ id: c.id, name: c.tradeName })
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      {deleting && (
        <DeleteModal
          name={deleting.name}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}

// ── Icon ──────────────────────────────────────────────────────────────────────

