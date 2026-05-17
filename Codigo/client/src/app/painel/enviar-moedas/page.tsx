"use client";

import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { getMyCoinStatement, getStudents, sendCoins, type StudentModel } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const quickValues = [10, 20, 50, 100];

export default function EnviarMoedasPage() {
  const { refreshUser, profile } = useAuth();
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState<number>(20);
  const [reason, setReason] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [studentList, statement] = await Promise.all([
          getStudents(),
          getMyCoinStatement(),
        ]);
        setStudents(studentList);
        setBalance(statement.balance);
      } catch (err) {
        console.error(err);
        setError("Nao foi possivel carregar os dados para envio de moedas.");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const visibleStudents = useMemo(() => {
    const institutionId = (profile as { institutionId?: string } | null)
      ?.institutionId;
    if (!institutionId) {
      return students;
    }
    return students.filter((student) => student.institutionId === institutionId);
  }, [profile, students]);

  useEffect(() => {
    if (visibleStudents.length > 0) {
      setStudentId((current) => {
        if (current && visibleStudents.some((s) => s.id === current)) {
          return current;
        }
        return visibleStudents[0].id;
      });
    } else {
      setStudentId("");
    }
  }, [visibleStudents]);

  const selectedStudent = useMemo(
    () => visibleStudents.find((s) => s.id === studentId),
    [studentId, visibleStudents],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId) {
      setError("Selecione um aluno.");
      return;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Informe uma quantidade valida.");
      return;
    }
    if (reason.trim().length < 3) {
      setError("Informe o motivo com pelo menos 3 caracteres.");
      return;
    }
    if (reason.length > 500) {
      setError("O motivo deve ter no maximo 500 caracteres.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendCoins({
        studentId,
        amount,
        message: reason.trim(),
      });
      setBalance(response.balance);
      setReason("");
      setSuccess("Moedas enviadas com sucesso.");
      await refreshUser();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response
          ?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data
              .message
          : "Nao foi possivel enviar moedas.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Reconhecimento
      </p>
      <h1 className="mt-1 font-display text-4xl font-extrabold">
        Enviar <span className="text-primary">Moedas</span>
      </h1>

      {loading ? (
        <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]"
          >
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Aluno
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-2 h-12 w-full rounded-xl border-[3px] border-border bg-muted px-3 font-semibold outline-none ring-0"
            >
              {visibleStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - {student.email}
                </option>
              ))}
            </select>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Quantidade (XP)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    className={`h-11 min-w-12 rounded-full border-[3px] px-4 text-sm font-extrabold transition-all ${
                      amount === value
                        ? "border-border bg-primary text-primary-foreground"
                        : "border-border bg-surface text-foreground hover:bg-muted"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-3 h-12 w-full rounded-xl border-[3px] border-border bg-muted px-3 font-semibold outline-none ring-0"
              />
            </div>

            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Motivo do reconhecimento
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                placeholder="Ex.: Excelente apresentacao do trabalho final."
                className="mt-2 min-h-36 w-full rounded-xl border-[3px] border-border bg-muted px-3 py-2 font-medium outline-none ring-0"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                O aluno recebera esta mensagem por email.
              </p>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border-2 border-border bg-primary/15 px-3 py-2 text-sm text-foreground">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border-2 border-border bg-[#d4f8d4] px-3 py-2 text-sm text-foreground">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || visibleStudents.length === 0}
              className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border-[3px] border-border bg-primary px-6 font-display text-lg font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Send className="h-5 w-5" />
              {submitting ? "Enviando..." : "Enviar moedas"}
            </button>

            {selectedStudent ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Destinatario: <strong>{selectedStudent.name}</strong>
              </p>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Nenhum aluno disponivel na sua instituicao.
              </p>
            )}
          </form>

          <div className="space-y-4">
            <div className="rounded-2xl border-[3px] border-border bg-surface p-5 shadow-[4px_4px_0_0_hsl(var(--border))]">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Saldo disponivel
              </p>
              <p className="mt-2 font-display text-5xl font-extrabold text-foreground">
                {balance}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">XP</p>
            </div>

            <div className="rounded-2xl border-[3px] border-border bg-[#4c97c6] p-5 text-white shadow-[4px_4px_0_0_hsl(var(--border))]">
              <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                Como funciona
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Voce recebe 1.000 moedas por semestre</li>
                <li>O saldo do professor e acumulavel</li>
                <li>A mensagem do reconhecimento e obrigatoria</li>
                <li>Aluno e professor recebem confirmacao por email</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
