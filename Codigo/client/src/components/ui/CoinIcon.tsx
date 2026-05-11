export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#F9D94E"
        stroke="#0A0A0A"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="7" fill="#F6D046" stroke="#0A0A0A" strokeWidth="1.5" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="#0A0A0A"
        fontFamily="Alegreya Sans SC, serif"
      >
        $
      </text>
    </svg>
  );
}
