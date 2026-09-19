import nodemailer, { type Transporter } from 'nodemailer';
import { env } from './env';
import { COMPANY_NAME } from './site';
import { signLibToken, signUnsubToken } from './tokens';

const g = globalThis as unknown as { __cstMailer?: Transporter };

export function isMailConfigured(): boolean {
  const e = env();
  return Boolean(e.SMTP_HOST && e.SMTP_PORT && e.SMTP_USER && e.SMTP_PASS && e.MAIL_FROM);
}

function transporter(): Transporter {
  if (!g.__cstMailer) {
    const e = env();
    const port = Number(e.SMTP_PORT);
    g.__cstMailer = nodemailer.createTransport({
      host: e.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: e.SMTP_USER, pass: e.SMTP_PASS },
    });
  }
  return g.__cstMailer;
}

export async function sendLibraryEmail({ leadId, email }: { leadId: number; email: string }): Promise<void> {
  if (!isMailConfigured()) return;
  try {
    const e = env();
    const siteHost = new URL(e.SITE_URL).host;
    const libToken = signLibToken(leadId);
    const unsubToken = signUnsubToken(leadId);

    const text = `Here's your link to the full library of decoded client phrases:

${e.SITE_URL}/library/unlock?token=${libToken}

It works on any device and stays unlocked for 90 days.

— ${COMPANY_NAME}

You're getting this because you asked for the library at ${siteHost}.
Unsubscribe: ${e.SITE_URL}/unsubscribe?token=${unsubToken}`;

    await transporter().sendMail({
      from: e.MAIL_FROM,
      to: email,
      subject: 'Your Client-Speak library link',
      text,
      headers: {
        'List-Unsubscribe': `<${e.SITE_URL}/api/unsubscribe?token=${unsubToken}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
  } catch (err) {
    console.error('[mailer] failed to send library email', err);
  }
}
