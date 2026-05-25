"use client";

import { AdvantageCard } from "@/components/ui/AdvantageCard";
import { Modal } from "@/components/ui/Modal";
import {
    ADVANTAGE_CATEGORIES,
    ADVANTAGE_CATEGORY_LABELS,
    type AdvantageCategory,
} from "@/lib/advantages";
import {
    getAdvantages,
    getMyCoinStatement,
    redeemAdvantage,
    type AdvantageCard as Advantage,
} from "@/lib/api";
import { Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FilterValue = "TODAS" | AdvantageCategory;

function getApiMessage(err: unknown, fallback: string) {
  const message =
    (err as { response?: { data?: { message?: unknown } } })?.response?.data
      ?.message ?? fallback;
  return Array.isArray(message) ? message[0] : message;
}

function RedeemConfirmModal({
  advantage,
  balance,
  onConfirm,
  onClose,
  loading,
}: {
  advantage: Advantage;
  balance: number;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const remaining = balance - advantage.costXp;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Confirmar resgate"
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
            className="rounded-full border-2 border-border bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:opacity-90 disabled:opacity-50 active:shadow-none"
          >
            {loading ? "Resgatando…" : "Confirmar"}
          </button>
        </>
      }
    >
      <p className="text-sm text-foreground">
        Você está prestes a resgatar <strong>{advantage.title}</strong> por <strong>{advantage.costXp} XP</strong>.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Seu saldo atual é <strong>{balance} XP</strong> e ficará com <strong>{remaining} XP</strong> após o resgate.
      </p>
    </Modal>
  );
}

function RedeemSuccessModal({
  couponCode,
  onClose,
}: {
  couponCode: string;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Resgate concluído"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border-2 border-border bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))] transition-all hover:opacity-90 active:shadow-none"
        >
          Fechar
        </button>
      }
    >
      <p className="text-sm text-foreground">
        Seu cupom foi gerado e enviado para seu e-mail.
      </p>
      <div className="mt-4 rounded-xl border-2 border-border bg-muted px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Código do cupom
        </p>
        <p className="mt-1 font-display text-2xl font-extrabold text-primary">
          {couponCode}
        </p>
      </div>
    </Modal>
  );
}

export default function TrocarPage() {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FilterValue>("TODAS");
  const [apiError, setApiError] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [selectedAdvantage, setSelectedAdvantage] = useState<Advantage | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemedCoupon, setRedeemedCoupon] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setApiError("");
        const [catalog, statement] = await Promise.all([
          getAdvantages(),
          getMyCoinStatement(),
        ]);
        setAdvantages(catalog);
        setBalance(statement.balance);
      } catch {
        setApiError("Não foi possível carregar o catálogo de vantagens.");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const filteredAdvantages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return advantages.filter((advantage) => {
      const matchesCategory =
        category === "TODAS" || advantage.category === category;
      const matchesSearch =
        query.length === 0 ||
        advantage.title.toLowerCase().includes(query) ||
        advantage.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [advantages, category, search]);

  async function handleRedeem() {
    if (!selectedAdvantage) return;

    setRedeemLoading(true);
    setRedeemError("");

    try {
      const result = await redeemAdvantage(selectedAdvantage.id);
      setBalance(result.balance);
      setRedeemedCoupon(result.couponCode);
      setSelectedAdvantage(null);
    } catch (err: unknown) {
      setRedeemError(getApiMessage(err, "Não foi possível resgatar a vantagem."));
    } finally {
      setRedeemLoading(false);
    }
  }

  return (
    <>
      <div className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Vantagens
            </p>
            <h1 className="mt-1 font-display text-4xl font-extrabold">
              Trocar <span className="text-primary">Moedas</span>
            </h1>
          </div>

          <div className="rounded-2xl border-[3px] border-border bg-primary px-5 py-4 text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary-foreground/90">
              Seu saldo
            </p>
            <p className="mt-1 font-display text-4xl font-extrabold">{balance}</p>
            <p className="text-xs font-semibold text-primary-foreground/90">XP</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border-[3px] border-border bg-surface p-4 shadow-[4px_4px_0_0_hsl(var(--border))]">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border-2 border-border bg-input px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou descrição"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["TODAS", ...ADVANTAGE_CATEGORIES.map((item) => item.value)] as const).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border-2 border-border px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition-all ${
                    category === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-foreground hover:bg-muted"
                  }`}
                >
                  {item === "TODAS" ? "Todas" : ADVANTAGE_CATEGORY_LABELS[item]}
                </button>
              ),
            )}
          </div>
        </div>

        {(apiError || redeemError) && (
          <div className="mt-4 rounded-xl border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {apiError || redeemError}
          </div>
        )}

        {loading ? (
          <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : filteredAdvantages.length === 0 ? (
          <div className="mt-6 rounded-2xl border-[3px] border-border bg-surface p-6 shadow-[4px_4px_0_0_hsl(var(--border))]">
            <p className="text-sm text-muted-foreground">
              Nenhuma vantagem encontrada para os filtros atuais.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredAdvantages.map((advantage) => {
              const canRedeem = balance >= advantage.costXp;
              const deficit = Math.max(advantage.costXp - balance, 0);

              return (
                <AdvantageCard
                  key={advantage.id}
                  advantage={advantage}
                  actions={
                    <button
                      type="button"
                      onClick={() => setSelectedAdvantage(advantage)}
                      disabled={!canRedeem}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-border px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        backgroundColor: canRedeem ? "hsl(var(--primary))" : "hsl(var(--muted))",
                        color: canRedeem ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {canRedeem ? "Resgatar" : `Faltam ${deficit} XP`}
                    </button>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedAdvantage && (
        <RedeemConfirmModal
          advantage={selectedAdvantage}
          balance={balance}
          onConfirm={handleRedeem}
          onClose={() => setSelectedAdvantage(null)}
          loading={redeemLoading}
        />
      )}

      {redeemedCoupon && (
        <RedeemSuccessModal
          couponCode={redeemedCoupon}
          onClose={() => setRedeemedCoupon("")}
        />
      )}
    </>
  );
}
