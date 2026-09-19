import type { Category, Risk } from '@/lib/phrase-validate';

export type SeedPhrase = {
  slug: string;
  triggers: string[];
  keywords: string[];
  category: Category;
  meaning: string;
  question: string;
  reply: string;
  risk: Risk;
};
