"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  getInstitutions,
  getProfessors,
  createProfessor,
  updateProfessor,
  deleteUser,
  type Institution,
  type ProfessorModel,
} from "@/lib/api";
import { maskCpf } from "@/lib/masks";

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  children,
  error,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-border bg-input px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60";

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteModal({
  professor,
  onConfirm,
  onClose,
  loading,
}: {
  professor: ProfessorModel;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Excluir professor"
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
        Tem certeza que deseja excluir o professor{" "}
        <strong>{professor.name}</strong>? Esta ação não pode ser desfeita.
      </p>
    </Modal>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────

interface ProfessorFormValues {
  name: string;
  email: string;
  cpf: string;
  department: string;
  institutionId: string;
}

function ProfessorFormModal({
  professor,
  institutions,
  onSuccess,
  onClose,
}: {
  professor?: ProfessorModel;
  institutions: Institution[];
  onSuccess: (p: ProfessorModel) => void;
  onClose: () => void;
}) {
  const isEdit = !!professor;
  const [form, setForm] = useState<ProfessorFormValues>({
    name: professor?.name ?? "",
    email: professor?.email ?? "",
    cpf: professor?.cpf ?? "",
    department: professor?.department ?? "",
    institutionId: professor?.institutionId ?? (institutions[0]?.id ?? ""),
  });
  const [errors, setErrors] = useState<Partial<ProfessorFormValues>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof ProfessorFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<ProfessorFormValues> = {};
    if (!form.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!isEdit && !form.email.trim()) newErrors.email = "E-mail é obrigatório.";
    if (!isEdit && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "E-mail inválido.";
    if (!isEdit && !form.cpf.trim()) newErrors.cpf = "CPF é obrigatório.";
    if (!form.department.trim()) newErrors.department = "Departamento é obrigatório.";
    if (!form.institutionId) newErrors.institutionId = "Selecione uma instituição.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setApiError("");
    setLoading(true);
    try {
      let result: ProfessorModel;
      if (isEdit) {
        result = await updateProfessor(professor!.id, {
          displayName: form.name.trim(),
          department: form.department.trim(),
          institutionId: form.institutionId,
        });
      } else {
        result = await createProfessor({
          name: form.name.trim(),
          email: form.email.trim(),
          cpf: form.cpf.replace(/\D/g, ""),
          department: form.department.trim(),
          institutionId: form.institutionId,
        });
      }
      onSuccess(result);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Ocorreu um erro. Tente novamente.";
      setApiError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? "Editar professor" : "Novo professor"}
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
            form="professor-form"
            disabled={loading}
            className="rounded-full border-2 border-border bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:opacity-90 disabled:opacity-50 active:shadow-none"
          >
            {loading ? "Salvando…" : isEdit ? "Salvar" : "Criar professor"}
          </button>
        </>
      }
    >
      <form id="professor-form" onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
            {apiError}
          </p>
        )}

        <Field id="prof-name" label="Nome completo" error={errors.name}>
          <input
            id="prof-name"
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex.: Ana Carolina Lima"
            className={inputClass}
          />
        </Field>

        {!isEdit && (
          <>
            <Field id="prof-email" label="E-mail" error={errors.email}>
              <input
                id="prof-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="professor@universidade.edu.br"
                className={inputClass}
              />
            </Field>
            <Field id="prof-cpf" label="CPF" error={errors.cpf}>
              <input
                id="prof-cpf"
                type="text"
                value={form.cpf}
                onChange={(e) => set("cpf", maskCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className={inputClass}
              />
            </Field>
          </>
        )}

        <Field id="prof-dept" label="Departamento" error={errors.department}>
          <input
            id="prof-dept"
            type="text"
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
            placeholder="Ex.: Ciência da Computação"
            className={inputClass}
          />
        </Field>

        <Field
          id="prof-inst"
          label="Instituição"
          error={errors.institutionId}
        >
          <select
            id="prof-inst"
            value={form.institutionId}
            onChange={(e) => set("institutionId", e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione…</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </Field>

        {!isEdit && (
          <p className="text-xs text-muted-foreground">
            Uma senha temporária será gerada automaticamente e enviada ao
            e-mail do professor com instruções para redefinição.
          </p>
        )}
      </form>
    </Modal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfessoresPage() {
  const [professors, setProfessors] = useState<ProfessorModel[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<ProfessorModel | null>(null);
  const [deleting, setDeleting] = useState<ProfessorModel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setApiError("");
        const [profs, insts] = await Promise.all([
          getProfessors(),
          getInstitutions(),
        ]);
        setProfessors(profs);
        setInstitutions(insts);
      } catch {
        setApiError("Não foi possível carregar os professores.");
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  function getInstitutionName(id: string) {
    return institutions.find((i) => i.id === id)?.name ?? "—";
  }

  function handleCreated(prof: ProfessorModel) {
    setProfessors((prev) => [prof, ...prev]);
    setShowCreate(false);
  }

  function handleUpdated(prof: ProfessorModel) {
    setProfessors((prev) => prev.map((p) => (p.id === prof.id ? prof : p)));
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteUser(deleting.id);
      setProfessors((prev) => prev.filter((p) => p.id !== deleting.id));
      setDeleting(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao excluir professor.";
      setDeleteError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  const filtered = professors.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()),
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
              Profes<span className="text-primary">sores</span>
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-2 flex items-center gap-2 rounded-full border-[3px] border-border bg-primary px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:opacity-90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="h-4 w-4" />
            Novo professor
          </button>
        </div>

        {/* Search */}
        <div className="mt-6">
          <input
            type="search"
            placeholder="Buscar por nome, e-mail ou departamento…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-xl border-2 border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Errors */}
        {(apiError || deleteError) && (
          <div className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {apiError || deleteError}
          </div>
        )}

        {/* Table */}
        <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface shadow-[4px_4px_0_0_hsl(var(--border))] overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 border-b-[3px] border-border bg-muted px-6 py-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
              Nome
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
              Departamento
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
              Instituição
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
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
                ? "Nenhum professor encontrado para essa busca."
                : "Nenhum professor cadastrado ainda."}
            </div>
          ) : (
            <ul>
              {filtered.map((prof, idx) => (
                <li
                  key={prof.id}
                  className={`flex flex-col gap-2 px-6 py-4 sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:gap-4 ${
                    idx < filtered.length - 1 ? "border-b-2 border-border" : ""
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">{prof.name}</p>
                    <p className="text-xs text-muted-foreground">{prof.email}</p>
                  </div>
                  <p className="text-sm text-foreground">{prof.department}</p>
                  <p className="text-sm text-foreground">
                    {getInstitutionName(prof.institutionId)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(prof)}
                      className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold transition-colors hover:bg-muted"
                      aria-label={`Editar ${prof.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError("");
                        setDeleting(prof);
                      }}
                      className="flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
                      aria-label={`Excluir ${prof.name}`}
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
          {filtered.length} professor{filtered.length !== 1 ? "es" : ""}{" "}
          {search ? "encontrado" : "cadastrado"}
          {filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Modals */}
      {showCreate && (
        <ProfessorFormModal
          institutions={institutions}
          onSuccess={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editing && (
        <ProfessorFormModal
          professor={editing}
          institutions={institutions}
          onSuccess={handleUpdated}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <DeleteModal
          professor={deleting}
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
