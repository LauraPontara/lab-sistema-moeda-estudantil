"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
  role: z.enum(["student", "partner_company", "professor", "admin"]),
});

type FormData = z.infer<typeof schema>;

const roleLabels = [
  { value: "student", label: "Aluno" },
  { value: "partner_company", label: "Empresa" },
  { value: "professor", label: "Professor" },
  { value: "admin", label: "Admin" },
] as const;

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      await login(data.email, data.password);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Email ou senha inválidos.";
      setServerError(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-[3px] border-border bg-background px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 select-none w-fit">
          <BrandLogo imageClassName="h-12 w-auto" />
        </Link>
      </header>

      {/* Body */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border-[3px] border-border bg-surface p-8 shadow-[6px_6px_0_0_hsl(var(--border))]">
            <h1 className="font-display text-3xl font-extrabold">Entrar</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesse seu painel e suas moedas.
            </p>

            {/* Role selector */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Eu sou
              </p>
              <div className="flex rounded-full border-[2px] border-border bg-muted p-1 gap-1">
                {roleLabels.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setValue("role", r.value)}
                    className={`flex-1 rounded-full py-1.5 text-xs font-bold uppercase tracking-wide transition-all ${
                      selectedRole === r.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
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

              {selectedRole !== "admin" && (
                <div className="text-right">
                  <Link
                    href="/esqueci-senha"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link
                href="/cadastro"
                className="font-semibold text-primary hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


