"use client";

import { AdvantageCard } from "@/components/ui/AdvantageCard";
import { Modal } from "@/components/ui/Modal";
import {
    ADVANTAGE_CATEGORIES,
    ADVANTAGE_ICONS,
    type AdvantageCategory,
    type AdvantageIcon,
} from "@/lib/advantages";
import {
    createAdvantage,
    deleteAdvantage,
    getMyAdvantages,
    type AdvantageCard as Advantage,
} from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function getApiMessage(err: unknown, fallback: string) {
  const message =
    (err as { response?: { data?: { message?: unknown } } })?.response?.data
      ?.message ?? fallback;
  return Array.isArray(message) ? message[0] : message;
}

function AdvantageFormModal({
  onSuccess,
  onClose,
}: {
  onSuccess: (advantage: Advantage) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AdvantageCategory>("ALIMENTACAO");
  const [icon, setIcon] = useState<AdvantageIcon>("utensils");
  const [costXp, setCostXp] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim().length < 3) {
      setError("O título deve ter pelo menos 3 caracteres.");
      return;
    }

    if (description.trim().length < 3) {
      setError("A descrição deve ter pelo menos 3 caracteres.");
      return;
    }

    if (!Number.isInteger(costXp) || costXp < 1) {
      setError("O custo em XP deve ser maior que zero.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const created = await createAdvantage({
        title: title.trim(),
        description: description.trim(),
        category,
        icon,
        costXp,
      });
      onSuccess(created);
    } catch (err: unknown) {
      setError(getApiMessage(err, "Não foi possível criar a vantagem."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Nova vantagem"
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
            form="advantage-form"
            disabled={loading}
            className="rounded-full border-2 border-border bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:opacity-90 disabled:opacity-50 active:shadow-none"
          >
            {loading ? "Criando…" : "Criar"}
          </button>
        </>
      }
    >
      <form id="advantage-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-bold text-foreground">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-input px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Ex.: 10% de desconto no R.U."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-foreground">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-28 w-full rounded-xl border-2 border-border bg-input px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Descreva o benefício da vantagem."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AdvantageCategory)}
              className="w-full rounded-xl border-2 border-border bg-input px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {ADVANTAGE_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-foreground">Custo em XP</label>
            <input
              type="number"
              min={1}
              max={100000}
              value={costXp}
              onChange={(e) => setCostXp(Number(e.target.value))}
              className="w-full rounded-xl border-2 border-border bg-input px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Ícone</label>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {Object.entries(ADVANTAGE_ICONS).map(([key, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key as AdvantageIcon)}
                className={`flex h-16 flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                  icon === key
                    ? "border-border bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {key}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm font-semibold text-destructive">{error}</p>
        )}
      </form>
    </Modal>
  );
}

function DeleteAdvantageModal({
  advantage,
  onConfirm,
  onClose,
  loading,
}: {
  advantage: Advantage;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Excluir vantagem"
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
            type="button"
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
        Tem certeza que deseja excluir a vantagem <strong>{advantage.title}</strong>?
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        A exclusão é suave: a vantagem some das listas, mas o histórico de resgates continua válido.
      </p>
    </Modal>
  );
}

export default function VantagensPage() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState<Advantage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setApiError("");
        const data = await getMyAdvantages();
        setAdvantages(data);
      } catch {
        setApiError("Não foi possível carregar as vantagens.");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const totalXp = useMemo(
    () => advantages.reduce((sum, advantage) => sum + advantage.costXp, 0),
    [advantages],
  );

  async function handleDelete() {
    if (!deleting) return;

    setDeleteLoading(true);
    setApiError("");

    try {
      await deleteAdvantage(deleting.id);
      setAdvantages((prev) => prev.filter((item) => item.id !== deleting.id));
      setDeleting(null);
    } catch (err: unknown) {
      setApiError(getApiMessage(err, "Não foi possível excluir a vantagem."));
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleCreated(advantage: Advantage) {
    setAdvantages((prev) => [advantage, ...prev]);
    setShowCreate(false);
  }

  return (
    <>
      <div className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Empresa
            </p>
            <h1 className="mt-1 font-display text-4xl font-extrabold">
              Minhas <span className="text-primary">Vantagens</span>
            </h1>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="mt-2 inline-flex items-center gap-2 rounded-full border-[3px] border-border bg-primary px-5 py-2.5 font-display text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))] transition-all hover:opacity-90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="h-4 w-4" />
            Nova vantagem
          </button>
        </div>

        {apiError && (
          <div className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {apiError}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border-[3px] border-border bg-surface p-5 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total de vantagens
            </p>
            <p className="mt-2 font-display text-5xl font-extrabold text-foreground">
              {advantages.length}
            </p>
          </div>

          <div className="rounded-2xl border-[3px] border-border bg-surface p-5 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              XP somado dos custos
            </p>
            <p className="mt-2 font-display text-5xl font-extrabold text-primary">
              {totalXp}
            </p>
          </div>

          <div className="rounded-2xl border-[3px] border-border bg-primary p-5 text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/90">
              Como funciona
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-primary-foreground/95">
              Cadastre, exiba e remova suas vantagens com exclusão suave. Os resgates antigos continuam válidos.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : advantages.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-sm text-muted-foreground">
              Nenhuma vantagem cadastrada ainda.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {advantages.map((advantage) => (
              <AdvantageCard
                key={advantage.id}
                advantage={advantage}
                actions={
                  <button
                    onClick={() => setDeleting(advantage)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface px-3 py-2 text-xs font-bold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <AdvantageFormModal
          onSuccess={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}

      {deleting && (
        <DeleteAdvantageModal
          advantage={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}
