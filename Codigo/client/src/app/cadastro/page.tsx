"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CoinIcon } from "@/components/ui/CoinIcon";
import {
  getInstitutions,
  createStudent,
  createPartnerCompany,
  type Institution,
} from "@/lib/api";

// ── Schemas ───────────────────────────────────────────────────────────────────

const studentSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  cpf: z
    .string()
    .regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  rg: z.string().min(1, "RG obrigatório"),
  address: z.string().min(1, "Endereço obrigatório"),
  institutionId: z.string().uuid("Selecione uma instituição"),
  course: z.string().min(1, "Curso obrigatório"),
});

const companySchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  cnpj: z
    .string()
    .regex(
      /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ inválido"
    ),
  tradeName: z.string().min(1, "Nome da empresa obrigatório"),
  address: z.string().min(1, "Endereço obrigatório"),
  contactPhone: z.string().optional(),
});

type StudentData = z.infer<typeof studentSchema>;
type CompanyData = z.infer<typeof companySchema>;

// ── Shared input style ────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

const labelClass =
  "block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1";

// ── Student Form ──────────────────────────────────────────────────────────────

function StudentForm({
  institutions,
  onSuccess,
}: {
  institutions: Institution[];
  onSuccess: () => void;
}) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentData>({ resolver: zodResolver(studentSchema) });

  const onSubmit = async (data: StudentData) => {
    setServerError("");
    try {
      await createStudent(data);
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message ?? "Erro ao criar conta.";
      setServerError(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Nome Completo</label>
        <input
          {...register("name")}
          className={inputClass}
          placeholder="Seu nome completo"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input
            {...register("email")}
            type="email"
            className={inputClass}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>CPF</label>
          <input
            {...register("cpf")}
            className={inputClass}
            placeholder="000.000.000-00"
          />
          {errors.cpf && (
            <p className="mt-1 text-xs text-destructive">
              {errors.cpf.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>RG</label>
          <input {...register("rg")} className={inputClass} placeholder="RG" />
          {errors.rg && (
            <p className="mt-1 text-xs text-destructive">{errors.rg.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Endereço</label>
          <input
            {...register("address")}
            className={inputClass}
            placeholder="Rua, número, cidade"
          />
          {errors.address && (
            <p className="mt-1 text-xs text-destructive">
              {errors.address.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Instituição</label>
          <select {...register("institutionId")} className={inputClass}>
            <option value="">Selecione...</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          {errors.institutionId && (
            <p className="mt-1 text-xs text-destructive">
              {errors.institutionId.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Curso</label>
          <input
            {...register("course")}
            className={inputClass}
            placeholder="Ex: Engenharia de Software"
          />
          {errors.course && (
            <p className="mt-1 text-xs text-destructive">
              {errors.course.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Senha</label>
        <input
          {...register("password")}
          type="password"
          className={inputClass}
          placeholder="Mínimo 6 caracteres"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60"
      >
        {isSubmitting ? "Criando..." : "Criar Conta"}
      </button>
    </form>
  );
}

// ── Company Form ──────────────────────────────────────────────────────────────

function CompanyForm({ onSuccess }: { onSuccess: () => void }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyData>({ resolver: zodResolver(companySchema) });

  const onSubmit = async (data: CompanyData) => {
    setServerError("");
    try {
      await createPartnerCompany(data);
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message ?? "Erro ao criar conta.";
      setServerError(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Nome da Empresa</label>
        <input
          {...register("tradeName")}
          className={inputClass}
          placeholder="Razão social / nome fantasia"
        />
        {errors.tradeName && (
          <p className="mt-1 text-xs text-destructive">
            {errors.tradeName.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email</label>
          <input
            {...register("email")}
            type="email"
            className={inputClass}
            placeholder="contato@empresa.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>CNPJ</label>
          <input
            {...register("cnpj")}
            className={inputClass}
            placeholder="00.000.000/0000-00"
          />
          {errors.cnpj && (
            <p className="mt-1 text-xs text-destructive">
              {errors.cnpj.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Endereço</label>
          <input
            {...register("address")}
            className={inputClass}
            placeholder="Rua, número, cidade"
          />
          {errors.address && (
            <p className="mt-1 text-xs text-destructive">
              {errors.address.message}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Telefone (opcional)</label>
          <input
            {...register("contactPhone")}
            className={inputClass}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Senha</label>
        <input
          {...register("password")}
          type="password"
          className={inputClass}
          placeholder="Mínimo 6 caracteres"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60"
      >
        {isSubmitting ? "Criando..." : "Criar Conta"}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CadastroPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"student" | "company">("student");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getInstitutions().then(setInstitutions).catch(console.error);
  }, []);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => router.push("/entrar"), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-[3px] border-border bg-background px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 select-none w-fit">
          <CoinIcon className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold leading-none">
            <span className="text-foreground">XP </span>
            <span className="text-primary">Estudantil</span>
          </span>
        </Link>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center px-4 py-12">
        <h1 className="font-display text-4xl font-extrabold text-center">
          Crie sua conta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">
          Professores são pré-cadastrados pela instituição.
        </p>

        {/* Type selector */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => setTab("student")}
            className={`w-48 rounded-2xl border-[3px] border-border px-5 py-4 text-left shadow-[4px_4px_0_0_hsl(var(--border))] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              tab === "student"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground hover:bg-muted"
            }`}
          >
            <p className="font-display text-lg font-extrabold">Aluno</p>
            <p className="mt-0.5 text-xs opacity-80">
              Receba moedas e troque por vantagens
            </p>
          </button>
          <button
            type="button"
            onClick={() => setTab("company")}
            className={`w-48 rounded-2xl border-[3px] border-border px-5 py-4 text-left shadow-[4px_4px_0_0_hsl(var(--border))] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              tab === "company"
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground hover:bg-muted"
            }`}
          >
            <p className="font-display text-lg font-extrabold">Empresa</p>
            <p className="mt-0.5 text-xs opacity-80">
              Ofereça vantagens para os alunos
            </p>
          </button>
        </div>

        {success ? (
          <div className="mt-10 rounded-2xl border-[3px] border-border bg-surface px-8 py-10 text-center shadow-[6px_6px_0_0_hsl(var(--border))]">
            <p className="text-4xl">🎉</p>
            <p className="mt-3 font-display text-2xl font-extrabold">
              Conta criada!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Redirecionando para o login...
            </p>
          </div>
        ) : (
          <div className="mt-8 w-full max-w-xl rounded-2xl border-[3px] border-border bg-surface p-8 shadow-[6px_6px_0_0_hsl(var(--border))]">
            {tab === "student" ? (
              <StudentForm
                institutions={institutions}
                onSuccess={handleSuccess}
              />
            ) : (
              <CompanyForm onSuccess={handleSuccess} />
            )}

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link
                href="/entrar"
                className="font-semibold text-primary hover:underline"
              >
                Entrar
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
