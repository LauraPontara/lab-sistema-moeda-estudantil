"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  getInstitutions,
  updateMyProfile,
  deleteMyAccount,
  type Institution,
  type StudentProfile,
  type PartnerCompanyProfile,
} from "@/lib/api";

// ── Shared styles ─────────────────────────────────────────────────────────────

const field =
  "w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

const fieldDisabled =
  "w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 text-sm text-muted-foreground opacity-70 cursor-not-allowed";

const lbl =
  "block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1.5";

// ── Reusable field wrapper ────────────────────────────────────────────────────

function Field({
  name,
  error,
  children,
}: {
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={lbl}>{name}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`mt-4 rounded-xl border-2 px-4 py-3 text-sm font-semibold ${
        type === "success"
          ? "border-success/40 bg-success/10 text-success"
          : "border-destructive/40 bg-destructive/10 text-destructive"
      }`}
    >
      {msg}
    </div>
  );
}

// ── Save icon ─────────────────────────────────────────────────────────────────

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

// ── Trash icon ────────────────────────────────────────────────────────────────

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────

function SaveButton({ isSubmitting, isDirty }: { isSubmitting: boolean; isDirty: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || !isDirty}
      className="mt-2 flex items-center gap-2 rounded-full border-[3px] border-border bg-primary px-6 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <SaveIcon />
      {isSubmitting ? "Salvando..." : "Salvar Alterações"}
    </button>
  );
}

// ── Student Profile Form ──────────────────────────────────────────────────────

const studentSchema = z.object({
  displayName: z.string().min(2, "Nome obrigatório"),
  document: z
    .string()
    .regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
    .optional()
    .or(z.literal("")),
  rg: z.string().optional(),
  address: z.string().optional(),
  course: z.string().optional(),
  institutionId: z.string().optional().or(z.literal("")),
});

type StudentData = z.infer<typeof studentSchema>;

function StudentForm({
  profile,
  institutions,
  onSaved,
}: {
  profile: StudentProfile;
  institutions: Institution[];
  onSaved: () => void;
}) {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      document: profile.document ?? "",
      rg: profile.rg ?? "",
      address: profile.address ?? "",
      course: profile.course ?? "",
      institutionId: profile.institutionId ?? "",
    },
  });

  const onSubmit = async (data: StudentData) => {
    setToast(null);
    try {
      await updateMyProfile({
        displayName: data.displayName,
        document: data.document || undefined,
        rg: data.rg || undefined,
        address: data.address || undefined,
        course: data.course || undefined,
        institutionId: data.institutionId || undefined,
      });
      setToast({ msg: "Perfil atualizado com sucesso!", type: "success" });
      onSaved();
    } catch (err: unknown) {
      const raw = (
        err as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      setToast({
        msg: Array.isArray(raw) ? raw.join(", ") : (raw ?? "Erro ao salvar."),
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field name="Nome" error={errors.displayName?.message}>
        <input
          {...register("displayName")}
          className={field}
          placeholder="Seu nome completo"
        />
      </Field>

      <Field name="Email">
        <input value={profile.email} disabled className={fieldDisabled} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field name="CPF" error={errors.document?.message}>
          <input
            {...register("document")}
            className={field}
            placeholder="000.000.000-00"
          />
        </Field>
        <Field name="RG">
          <input {...register("rg")} className={field} placeholder="RG" />
        </Field>
      </div>

      <Field name="Endereço">
        <input
          {...register("address")}
          className={field}
          placeholder="Rua, número, cidade"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field name="Instituição">
          <select {...register("institutionId")} className={field}>
            <option value="">Selecione...</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </Field>
        <Field name="Curso">
          <input
            {...register("course")}
            className={field}
            placeholder="Ex: Eng. de Software"
          />
        </Field>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SaveButton isSubmitting={isSubmitting} isDirty={isDirty} />
    </form>
  );
}

// ── Company Profile Form ──────────────────────────────────────────────────────

const companySchema = z.object({
  displayName: z.string().min(1, "Nome obrigatório"),
  document: z
    .string()
    .regex(/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
});

type CompanyData = z.infer<typeof companySchema>;

function CompanyForm({
  profile,
  onSaved,
}: {
  profile: PartnerCompanyProfile;
  onSaved: () => void;
}) {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CompanyData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      displayName: profile.displayName ?? "",
      document: profile.document ?? "",
      address: profile.address ?? "",
      contactPhone: profile.contactPhone ?? "",
    },
  });

  const onSubmit = async (data: CompanyData) => {
    setToast(null);
    try {
      await updateMyProfile({
        displayName: data.displayName,
        document: data.document || undefined,
        address: data.address || undefined,
        contactPhone: data.contactPhone || undefined,
      });
      setToast({ msg: "Perfil atualizado com sucesso!", type: "success" });
      onSaved();
    } catch (err: unknown) {
      const raw = (
        err as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      setToast({
        msg: Array.isArray(raw) ? raw.join(", ") : (raw ?? "Erro ao salvar."),
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field name="Nome da Empresa" error={errors.displayName?.message}>
        <input
          {...register("displayName")}
          className={field}
          placeholder="Nome fantasia / razão social"
        />
      </Field>

      <Field name="Email">
        <input value={profile.email} disabled className={fieldDisabled} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field name="CNPJ" error={errors.document?.message}>
          <input
            {...register("document")}
            className={field}
            placeholder="00.000.000/0000-00"
          />
        </Field>
        <Field name="Telefone">
          <input
            {...register("contactPhone")}
            className={field}
            placeholder="(00) 00000-0000"
          />
        </Field>
      </div>

      <Field name="Endereço">
        <input
          {...register("address")}
          className={field}
          placeholder="Rua, número, cidade"
        />
      </Field>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <SaveButton isSubmitting={isSubmitting} isDirty={isDirty} />
    </form>
  );
}

// ── Danger Zone ───────────────────────────────────────────────────────────────

function DangerZone() {
  const { logout } = useAuth();
  const [step, setStep] = useState<"idle" | "confirm">("idle");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await deleteMyAccount();
      logout();
    } catch {
      setError("Erro ao excluir conta. Tente novamente.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border-[3px] border-destructive bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--destructive))]">
      <h2 className="font-display text-xl font-extrabold text-destructive">
        Zona de Perigo
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Excluir sua conta é permanente. Suas moedas e histórico serão perdidos.
      </p>

      {error && (
        <p className="mt-3 rounded-xl border-2 border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {step === "idle" ? (
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="mt-4 flex items-center gap-2 rounded-full border-[3px] border-border bg-destructive px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-destructive-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <TrashIcon />
          Excluir Minha Conta
        </button>
      ) : (
        <div className="mt-4">
          <p className="mb-3 text-sm font-semibold text-destructive">
            Tem certeza? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full border-[3px] border-border bg-destructive px-5 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-destructive-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:shadow-none disabled:opacity-60"
            >
              {isDeleting ? "Excluindo..." : "Sim, excluir"}
            </button>
            <button
              type="button"
              onClick={() => setStep("idle")}
              className="rounded-full border-[3px] border-border bg-surface px-5 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:bg-muted active:shadow-none"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    getInstitutions().then(setInstitutions).catch(console.error);
  }, []);

  const isStudent = user?.role === "STUDENT";
  const isCompany = user?.role === "PARTNER_COMPANY";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _institutionName = useMemo(() => {
    if (!isStudent || !profile || !("institutionId" in profile)) return "";
    return (
      institutions.find((i) => i.id === (profile as StudentProfile).institutionId)?.name ?? ""
    );
  }, [institutions, profile, isStudent]);

  return (
    <div className="min-h-full px-8 py-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Conta
      </p>
      <h1 className="mt-0.5 font-display text-4xl font-extrabold leading-none tracking-tight">
        Meu <span className="text-primary">Perfil</span>
      </h1>

      {/* Form card */}
      <div className="mt-6 max-w-2xl rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[6px_6px_0_0_hsl(var(--border))]">
        {!profile && (
          <p className="text-sm text-muted-foreground">Carregando perfil...</p>
        )}

        {profile && isStudent && (
          <StudentForm
            profile={profile as StudentProfile}
            institutions={institutions}
            onSaved={refreshProfile}
          />
        )}

        {profile && isCompany && (
          <CompanyForm
            profile={profile as PartnerCompanyProfile}
            onSaved={refreshProfile}
          />
        )}
      </div>

      {/* Danger zone */}
      <div className="max-w-2xl">
        <DangerZone />
      </div>
    </div>
  );
}

