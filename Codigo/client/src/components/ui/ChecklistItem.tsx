export function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-foreground">
        <svg
          viewBox="0 0 12 10"
          fill="none"
          className="h-3 w-3"
          aria-hidden="true"
        >
          <path
            d="M1 5l3.5 3.5L11 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-bold text-base text-foreground leading-snug">
        {children}
      </span>
    </li>
  );
}
