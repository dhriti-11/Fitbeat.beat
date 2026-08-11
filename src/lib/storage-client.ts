export async function storageGet<T>(key: string): Promise<T | null> {
  try {
    const r = await fetch(`/api/storage?key=${encodeURIComponent(key)}`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}

export async function storageSet<T>(key: string, value: T): Promise<boolean> {
  try {
    const r = await fetch("/api/storage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function storageGetPublic<T>(key: string): Promise<T | null> {
  try {
    const r = await fetch(`/api/public/${encodeURIComponent(key)}`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.value ?? null;
  } catch {
    return null;
  }
}
