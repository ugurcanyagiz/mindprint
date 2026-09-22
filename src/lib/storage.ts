const STORAGE_PREFIX = "mindprint:";

export function readLocalValue<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeLocalValue<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value),
    );
  } catch {
    // Persistence is progressive enhancement.
  }
}

export function removeLocalValue(key: string): void {
  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Persistence is progressive enhancement.
  }
}
