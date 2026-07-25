interface Footnote {
  id: number;
  text: string;
}

const footnotes: Footnote[] = [
  {
    id: 1,
    text: "Baseline vs. latest assessment score, Term 2 2026 tutor-led cohort, n=134 students.",
  },
  {
    id: 2,
    text: "Based on verified parent reviews collected in-app, trailing 12 months.",
  },
];

export function Footnotes() {
  return (
    <div className="px-6 py-8" style={{ background: "var(--bg-surface)" }}>
      <ol className="mx-auto flex max-w-4xl flex-col gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
        {footnotes.map((footnote) => (
          <li key={footnote.id}>
            {footnote.id}. {footnote.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
