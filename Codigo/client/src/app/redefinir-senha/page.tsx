"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { resetPassword } from "@/lib/api";

const requirements = [
  { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
  {
    label: "Pelo menos uma letra maiúscula",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    label: "Pelo menos uma letra minúscula",
    test: (p: string) => /[a-z]/.test(p),
  },
  { label: "Pelo menos um número", test: (p: string) => /\d/.test(p) },
  {
    label: "Pelo menos um símbolo (!@#$%&*)",
    test: (p: string) => /[!@#$%&*]/.test(p),
  },
];

function RedefinirSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/entrar");
    }
  }, [token, router]);

  const meetsAll = requirements.every((r) => r.test(newPassword));
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = meetsAll && passwordsMatch && !isSubmitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !canSubmit) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao redefinir senha.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) return null;

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
            {success ? (
              /* Success state */
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-border bg-primary">
                  <svg
                    className="h-7 w-7 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="font-display text-2xl font-extrabold">
                  Senha redefinida!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sua senha foi atualizada com sucesso. Agora você pode entrar
                  com a nova senha.
                </p>
                <Link
                  href="/entrar"
                  className="mt-6 inline-block w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center"
                >
                  Ir para o login
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <h1 className="font-display text-3xl font-extrabold">
                  Redefinir senha
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha uma nova senha para acessar o sistema.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        aria-label={showNew ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password requirements checklist */}
                  {newPassword.length > 0 && (
                    <ul className="space-y-1.5 rounded-xl border-[2px] border-border-on-surface bg-muted px-4 py-3">
                      {requirements.map((r) => {
                        const ok = r.test(newPassword);
                        return (
                          <li
                            key={r.label}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[2px] transition-colors ${
                                ok
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border-on-surface bg-transparent text-transparent"
                              }`}
                            >
                              <svg
                                viewBox="0 0 12 12"
                                className="h-2.5 w-2.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2 6l3 3 5-5"
                                />
                              </svg>
                            </span>
                            <span
                              className={
                                ok
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {r.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Confirmar nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="mt-1 text-xs text-destructive">
                        As senhas não coincidem.
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      <p className="font-semibold">Erro ao redefinir senha</p>
                      <p className="mt-0.5">{serverError}</p>
                      <p className="mt-1 text-xs opacity-80">
                        O link pode ter expirado. Solicite um novo cadastro ao
                        administrador.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-2 w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_0_hsl(var(--border))]"
                  >
                    {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  Lembrou a senha?{" "}
                  <Link
                    href="/entrar"
                    className="font-semibold text-primary hover:underline"
                  >
                    Entrar
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  );
}


