export const FILLERS = ['kind of', 'sort of', 'um', 'uh', 'just', 'like', 'maybe', 'please'];

export function normalise(raw: string): string {
  let s = raw.toLowerCase().normalize('NFKC');
  s = s.replace(/[’'`]/g, '');
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  for (const f of FILLERS) s = s.replace(new RegExp(`\\b${f}\\b`, 'g'), ' ');
  return s.replace(/\s+/g, ' ').trim();
}
