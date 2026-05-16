interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant: "blue" | "red" | "yellow" | "black";
}

const variantClasses: Record<StatCardProps["variant"], string> = {
  blue: "bg-toon-blue text-white border-border shadow-[4px_4px_0_0_hsl(var(--border))]",
  red: "bg-toon-red text-white border-border shadow-[4px_4px_0_0_hsl(var(--border))]",
  yellow: "bg-toon-yellow text-foreground border-border shadow-[4px_4px_0_0_hsl(var(--border))]",
  black: "bg-toon-black text-white border-border shadow-[4px_4px_0_0_hsl(var(--border))]",
};

export function StatCard({ label, value, icon, variant }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border-[3px] px-6 py-5 ${variantClasses[variant]}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold opacity-80 uppercase tracking-wide leading-none mb-1">
          {label}
        </p>
        <p className="font-display text-3xl font-extrabold leading-none">
          {value}
        </p>
      </div>
      <div className="shrink-0 opacity-90">{icon}</div>
    </div>
  );
}
