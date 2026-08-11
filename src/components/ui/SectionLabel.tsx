export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="section-label mb-4 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[0.22em] text-[#F5821F]">
      {children}
    </p>
  );
}
