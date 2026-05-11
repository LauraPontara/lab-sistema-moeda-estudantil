type DecoSymbol = {
  char: string;
  size: string;
  rotate: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

const symbols: DecoSymbol[] = [
  { char: "✕", top: "9%", left: "6%", size: "text-4xl", rotate: "rotate-0" },
  { char: "+", top: "18%", right: "18%", size: "text-5xl", rotate: "rotate-12" },
  { char: "▲", bottom: "24%", left: "4%", size: "text-3xl", rotate: "-rotate-6" },
  { char: "○", top: "75%", right: "6%", size: "text-4xl", rotate: "rotate-0" },
  { char: "✕", top: "50%", right: "2%", size: "text-2xl", rotate: "rotate-6" },
  { char: "+", bottom: "10%", left: "32%", size: "text-4xl", rotate: "-rotate-12" },
  { char: "○", top: "30%", left: "2%", size: "text-3xl", rotate: "rotate-0" },
  { char: "▲", top: "6%", right: "38%", size: "text-2xl", rotate: "rotate-45" },
];

export function DecorativeSymbols() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {symbols.map((s, i) => (
        <span
          key={i}
          className={`absolute font-display font-extrabold text-foreground/10 select-none ${s.size} ${s.rotate}`}
          style={{
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
