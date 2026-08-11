export function clsx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}
