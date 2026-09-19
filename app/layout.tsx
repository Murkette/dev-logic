import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client-Speak Translator',
  description: 'Paste what the client said. Get what they meant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
