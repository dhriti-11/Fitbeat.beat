export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="section-label mb-4 font-[family-name:var(--font-space)] text-[11px] font-medium uppercase tracking-[0.28em] text-[#F5821F]">
      {children}
    </p>
  );
}
