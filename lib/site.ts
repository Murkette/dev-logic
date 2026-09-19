export const APP_NAME = 'Client-Speak Translator';
export const HERO_LINE = 'Paste what the client said. Get what they meant.';
// Raised as the library grows; must never exceed the real active phrase count.
export const LIBRARY_COUNT_LABEL = '120+';

// Baked in at build time (Docker build args) — the homepage stays statically rendered.
export const COMPANY_NAME = process.env.COMPANY_NAME ?? 'Your Company';
export const PAID_APP_URL = process.env.PAID_APP_URL ?? 'https://yourapp.example';
export const FOOTER_UTM = 'utm_source=client-speak-translator&utm_medium=footer&utm_campaign=lead-magnet';

export const EXAMPLE_PHRASES = [
  'Can you make it pop?',
  "I'll know it when I see it.",
  'Something feels off.',
  'Just a small change.',
  'Can we make the logo bigger?',
];
