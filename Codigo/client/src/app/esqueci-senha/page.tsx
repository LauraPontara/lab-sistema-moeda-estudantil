"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { forgotPassword } from "@/lib/api";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao enviar email.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
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
            {submitted ? (
              /* Success state */
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-border bg-accent">
                  <svg
                    className="h-7 w-7 text-accent-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h1 className="font-display text-2xl font-extrabold">
                  Email enviado!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Se este endereço estiver cadastrado no sistema, você receberá
                  um link para redefinir sua senha em breve. Verifique também a
                  caixa de spam.
                </p>
                <Link
                  href="/entrar"
                  className="mt-6 inline-block w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center"
                >
                  Voltar para o login
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="mb-6">
                  <h1 className="font-display text-3xl font-extrabold">
                    Esqueceu a senha?
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Informe seu email e enviaremos um link para criar uma nova
                    senha.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full rounded-xl border-[2px] border-border-on-surface bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!email || isSubmitting}
                    className="mt-2 w-full rounded-full border-[3px] border-border bg-primary py-3 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_0_hsl(var(--border))]"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar link"}
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
