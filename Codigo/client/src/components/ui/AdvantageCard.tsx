import { ADVANTAGE_CATEGORY_LABELS, ADVANTAGE_ICONS } from "@/lib/advantages";
import { AdvantageCard as AdvantageCardType } from "@/lib/api";

export function AdvantageCard({
  advantage,
  actions,
}: {
  advantage: AdvantageCardType;
  actions?: React.ReactNode;
}) {
  const Icon = ADVANTAGE_ICONS[advantage.icon];

  return (
    <article className="flex h-full flex-col rounded-2xl border-[3px] border-border bg-surface p-5 shadow-[4px_4px_0_0_hsl(var(--border))]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-border bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--border))]">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {advantage.companyName}
          </p>
          <h3 className="mt-1 truncate font-display text-2xl font-extrabold text-foreground">
            {advantage.title}
          </h3>
          <div className="mt-2 inline-flex rounded-full border-2 border-border bg-muted px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-foreground">
            {ADVANTAGE_CATEGORY_LABELS[advantage.category]}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {advantage.description}
      </p>

      <div className="mt-5 flex items-end justify-between gap-4 border-t-2 border-border pt-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Custo
          </p>
          <p className="font-display text-3xl font-extrabold text-primary">
            {advantage.costXp}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">XP</p>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </article>
  );
}
