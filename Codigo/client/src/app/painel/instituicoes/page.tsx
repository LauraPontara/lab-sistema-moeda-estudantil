"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  getInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  type Institution,
} from "@/lib/api";

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-border bg-input px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
      />
      {error && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({
  institution,
  onConfirm,
  onClose,
  loading,
}: {
  institution: Institution;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Excluir instituição"
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
        Tem certeza que deseja excluir a instituição{" "}
        <strong>{institution.name}</strong>? Esta ação não pode ser desfeita.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Não é possível excluir uma instituição que possui professores ou alunos
        vinculados.
      </p>
    </Modal>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────

function InstitutionFormModal({
  institution,
  onSuccess,
  onClose,
}: {
  institution?: Institution;
  onSuccess: (inst: Institution) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(institution?.name ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = institution
        ? await updateInstitution(institution.id, name.trim())
        : await createInstitution(name.trim());
      onSuccess(result);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Ocorreu um erro. Tente novamente.";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={institution ? "Editar instituição" : "Nova instituição"}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-2 border-border bg-surface px-5 py-2 text-sm font-bold transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="institution-form"
            disabled={loading}
            className="rounded-full border-2 border-border bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:opacity-90 disabled:opacity-50 active:shadow-none"
          >
            {loading ? "Salvando…" : institution ? "Salvar" : "Criar"}
          </button>
        </>
      }
    >
      <form id="institution-form" onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="inst-name"
          label="Nome da instituição"
          value={name}
          onChange={setName}
          placeholder="Ex.: Universidade Federal de Minas Gerais"
          error={error}
        />
      </form>
    </Modal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InstituicoesPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [deleting, setDeleting] = useState<Institution | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setApiError("");
        const data = await getInstitutions();
        setInstitutions(data);
      } catch {
        setApiError("Não foi possível carregar as instituições.");
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  function handleCreated(inst: Institution) {
    setInstitutions((prev) => [...prev, inst]);
    setShowCreate(false);
  }

  function handleUpdated(inst: Institution) {
    setInstitutions((prev) =>
      prev.map((i) => (i.id === inst.id ? inst : i)),
    );
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteInstitution(deleting.id);
      setInstitutions((prev) => prev.filter((i) => i.id !== deleting.id));
      setDeleting(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao excluir. Verifique se não há usuários vinculados.";
      setDeleteError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  const filtered = institutions.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Admin
            </p>
            <h1 className="mt-1 font-display text-4xl font-extrabold">
              Insti<span className="text-primary">tuições</span>
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-2 flex items-center gap-2 rounded-full border-[3px] border-border bg-primary px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:opacity-90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="h-4 w-4" />
            Nova instituição
          </button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <input
            type="search"
            placeholder="Buscar instituição…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-xl border-2 border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Error banner */}
        {(apiError || deleteError) && (
          <div className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {apiError || deleteError}
          </div>
        )}

        {/* Table card */}
        <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface shadow-[4px_4px_0_0_hsl(var(--border))] overflow-hidden">
          {/* Header row */}
          <div className="flex items-center border-b-[3px] border-border bg-muted px-6 py-3">
            <span className="flex-1 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
              Nome
            </span>
            <span className="w-32 text-right text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
              Ações
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Carregando…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search
                ? "Nenhuma instituição encontrada para essa busca."
                : "Nenhuma instituição cadastrada ainda."}
            </div>
          ) : (
            <ul>
              {filtered.map((inst, idx) => (
                <li
                  key={inst.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    idx < filtered.length - 1 ? "border-b-2 border-border" : ""
                  }`}
                >
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-xs font-extrabold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="truncate font-semibold text-foreground">
                      {inst.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditing(inst)}
                      className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold transition-colors hover:bg-muted"
                      aria-label={`Editar ${inst.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError("");
                        setDeleting(inst);
                      }}
                      className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
                      aria-label={`Excluir ${inst.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} instituição{filtered.length !== 1 ? "s" : ""}
          {search ? " encontrada" : " cadastrada"}
          {filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Modals */}
      {showCreate && (
        <InstitutionFormModal
          onSuccess={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editing && (
        <InstitutionFormModal
          institution={editing}
          onSuccess={handleUpdated}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <DeleteModal
          institution={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}
