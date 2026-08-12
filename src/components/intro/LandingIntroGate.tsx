"use client";

import { useEffect, useState } from "react";
import { IntroSplash } from "./IntroSplash";
import { markIntroSeen, shouldShowIntro } from "./useIntroSession";

export function LandingIntroGate({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);

  useEffect(() => {
    setShowIntro(shouldShowIntro("landing"));
  }, []);

  function handleComplete() {
    markIntroSeen("landing");
    setShowIntro(false);
  }

  if (showIntro === null) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <>
      {showIntro && <IntroSplash onComplete={handleComplete} />}
      <div className={showIntro ? "invisible" : undefined}>{children}</div>
    </>
  );
}
