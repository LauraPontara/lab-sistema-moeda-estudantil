import Link from "next/link";

type ToonButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

const variantClasses: Record<NonNullable<ToonButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground border-border hover:brightness-95",
  secondary:
    "bg-secondary text-secondary-foreground border-border hover:brightness-95",
  outline:
    "bg-surface text-foreground border-border hover:bg-muted",
  dark:
    "bg-foreground text-surface border-foreground hover:brightness-110",
};

const sizeClasses: Record<NonNullable<ToonButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

export function ToonButton({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  onClick,
  type = "button",
}: ToonButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border-[3px] font-display font-extrabold tracking-wide shadow-[4px_4px_0_0_hsl(var(--border))] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none select-none";

  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
