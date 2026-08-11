import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="relative z-10 border-y border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
        <p className="font-[family-name:var(--font-space)] text-[11px] uppercase tracking-[0.28em] text-[#F5821F]">
          Ready to move?
        </p>
        <h2 className="section-heading mt-4">
          Train With Intent.
          <br />
          <span className="text-[#4FA3FF]">Find Your Beat.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[#8FA9C7]">
          Start with a free demo session — no payment, no pressure. Just you, a real trainer, and your first step.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="#book" size="lg" variant="gold">
            Book Free Demo
          </Button>
          <Button href="/sign-in" size="lg" variant="ghost">
            Member Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
