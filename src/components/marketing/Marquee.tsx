const ITEMS = [
  "FIND YOUR BEAT",
  "TRAIN TO THE RHYTHM",
  "LIVE COACHING",
  "KUWAIT · QATAR · MORBI",
  "WOMEN · TEENS · KIDS",
  "REAL TRAINERS",
  "REAL RESULTS",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-wrap relative z-10 overflow-hidden border-y border-white/10 bg-[#060e1a]/80 py-4 backdrop-blur-sm">
      <div className="marquee-track flex w-max gap-12">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-12 font-[family-name:var(--font-condensed)] text-2xl uppercase tracking-[0.12em] text-white/90 md:text-4xl"
          >
            {item}
            <span className="h-2 w-2 rounded-full bg-[#F5821F]" />
          </span>
        ))}
      </div>
    </div>
  );
}
