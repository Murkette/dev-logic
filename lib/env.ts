const REQUIRED_IN_PRODUCTION = ['DATABASE_URL', 'COOKIE_SECRET', 'IP_HASH_SECRET', 'SITE_URL'] as const;
const MIN_SECRET_LENGTH = 32;

let validated = false;

function validate() {
  if (validated || process.env.NODE_ENV !== 'production') {
    validated = true;
    return;
  }
  for (const key of REQUIRED_IN_PRODUCTION) {
    if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
  }
  for (const key of ['COOKIE_SECRET', 'IP_HASH_SECRET'] as const) {
    const value = process.env[key]!;
    if (value.length < MIN_SECRET_LENGTH) {
      throw new Error(`${key} must be at least ${MIN_SECRET_LENGTH} characters`);
    }
  }
  validated = true;
}

export function env() {
  validate();
  return {
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    COOKIE_SECRET: process.env.COOKIE_SECRET ?? '',
    IP_HASH_SECRET: process.env.IP_HASH_SECRET ?? '',
    SITE_URL: process.env.SITE_URL ?? 'http://localhost:3000',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? '',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    MAIL_FROM: process.env.MAIL_FROM,
  };
}
