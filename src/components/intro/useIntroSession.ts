const KEYS = {
  landing: "fitbeat-intro-landing",
  dashboard: "fitbeat-intro-dashboard",
} as const;

export type IntroKey = keyof typeof KEYS;

export function shouldShowIntro(key: IntroKey): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEYS[key]) !== "1";
}

export function markIntroSeen(key: IntroKey): void {
  sessionStorage.setItem(KEYS[key], "1");
}

export function resetDashboardIntro(): void {
  sessionStorage.removeItem(KEYS.dashboard);
}
