type StepCardProps = {
  iconColor: "red" | "yellow" | "blue";
  icon: React.ReactNode;
  title: string;
  description: string;
};

const iconBgClasses: Record<StepCardProps["iconColor"], string> = {
  red: "bg-toon-red",
  yellow: "bg-toon-yellow",
  blue: "bg-toon-blue",
};

const iconTextClasses: Record<StepCardProps["iconColor"], string> = {
  red: "text-white",
  yellow: "text-foreground",
  blue: "text-white",
};

export function StepCard({ iconColor, icon, title, description }: StepCardProps) {
  return (
    <article className="toon-card flex flex-col gap-4 p-6">
      <div
        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-[3px] border-foreground shadow-toon-sm ${iconBgClasses[iconColor]} ${iconTextClasses[iconColor]}`}
      >
        {icon}
      </div>
      <h3 className="font-display text-2xl leading-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </article>
  );
}
