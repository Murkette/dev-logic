import { safeGet, safeSet } from './storage';

const SESSION_ID_KEY = 'cst_session_id';
const TX_COUNT_KEY = 'cst_tx_count';

export function getSessionId(): string {
  const existing = safeGet('session', SESSION_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  safeSet('session', SESSION_ID_KEY, id);
  return id;
}

export function incrementTranslationCount(): number {
  const next = (Number(safeGet('session', TX_COUNT_KEY)) || 0) + 1;
  safeSet('session', TX_COUNT_KEY, String(next));
  return next;
}

export function getTranslationCount(): number {
  return Number(safeGet('session', TX_COUNT_KEY)) || 0;
}
