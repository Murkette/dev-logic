type Area = 'local' | 'session';

function area(kind: Area): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function safeGet(kind: Area, key: string): string | null {
  try {
    return area(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeSet(kind: Area, key: string, value: string): void {
  try {
    area(kind)?.setItem(key, value);
  } catch {
    // storage unavailable (private mode, blocked, quota) — caller just sees it not persist
  }
}

export function safeRemove(kind: Area, key: string): void {
  try {
    area(kind)?.removeItem(key);
  } catch {
    // ignore
  }
}
