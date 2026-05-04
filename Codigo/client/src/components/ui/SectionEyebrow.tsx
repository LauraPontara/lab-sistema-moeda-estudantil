type SectionEyebrowProps = {
  children: React.ReactNode;
  color?: "primary" | "foreground" | "white" | "muted";
  align?: "left" | "center";
};

const colorClasses: Record<
  NonNullable<SectionEyebrowProps["color"]>,
  string
> = {
  primary: "text-primary",
  foreground: "text-foreground",
  white: "text-white",
  muted: "text-muted-foreground",
};

export function SectionEyebrow({
  children,
  color = "primary",
  align = "left",
}: SectionEyebrowProps) {
  return (
    <p
      className={`font-bold text-xs uppercase tracking-[0.12em] ${colorClasses[color]} ${align === "center" ? "text-center" : "text-left"}`}
    >
      {children}
    </p>
  );
}
