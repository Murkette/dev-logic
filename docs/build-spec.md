# Client-Speak Translator — Development Build Spec

Version 1.0 · Repo: `github.com/Murkette/dev-logic`

This document is the single source of truth for the build. It expands the original product brief into file-level instructions. Where the brief was silent or contradicted itself, a decision has been made here and listed in §2 so the product owner can veto it. If something is not covered, pick the simplest option that satisfies §20 (acceptance) and note it in the PR.

**How to read this:** §1–3 are context and ground rules. §4 is the map of the repo (where everything goes). §5–17 specify each subsystem. §18 is the order of work with "done when" checks. §19–21 are testing, acceptance, and open questions for the owner.

---

## 1. Product summary

A single-page web app for web designers. The designer pastes vague client feedback ("can you make it pop?") and gets back:

1. **What they probably mean** — plain-English decode
2. **Ask them this** — one clarifying question
3. **Copy-paste reply** — a professional message to send as-is
4. **Risk level** — Low / Medium / High likelihood of scope creep or unpaid revisions

It is a free lead magnet. Business goal: capture designer emails and quietly point at a paid product (SEO, uptime-monitoring, CRM app for web designers). It must feel like a gift, not an ad. The paid product is mentioned in exactly one place: the footer line.

**Hard constraints (non-negotiable)**

- No paid third-party APIs. No LLM calls. Matching is a curated phrase library + fuzzy matching, all local.
- Runs on one DigitalOcean droplet (1 GB RAM). No per-request cost.
- The homepage is a single unscrollable viewport on desktop. One text box, one button, one result. A toy, not a SaaS.
- No cookies except two functional ones (library unlock, admin session). No analytics scripts.

---

## 2. Decisions that deviate from or extend the original brief

Owner: skim this list. Everything else in the doc follows the brief.

| # | Decision | Why |
|---|---|---|
| D1 | `phrases` gets a `slug text unique not null` column | The brief requires an idempotent seed but gives no natural key. Slug also gives stable test references and `/library#slug` anchors. |
| D2 | `/api/translate` response adds `translationId`; `/api/feedback` takes `{ translationId, vote, sessionId }` | The brief says feedback posts "phrase id + raw input" but the schema keys feedback on `translation_id`. The schema wins. |
| D3 | Unlock cookie signs **lead id + timestamp**, not email + timestamp | Keeps PII out of the cookie. Same security properties. |
| D4 | Extra routes: `/admin/login`, `/admin/leads/export`, `/library/unlock`, `/unsubscribe`, `/api/unsubscribe` | Needed to make login, CSV export, cross-device unlock from the email link, and safe unsubscribe work. |
| D5 | Migrations and seed run in a `tools` compose service (built from the Docker `builder` stage), not inside the `app` container | The Next.js standalone image does not contain `drizzle-kit`, `tsx`, or the seed files. |
| D6 | Extra env vars: `DOMAIN`, `POSTGRES_PASSWORD`, `COMPANY_NAME` | Caddy needs a bare hostname; Postgres needs a password; the footer needs a name. |
| D7 | `SITE_URL`, `PAID_APP_URL`, `COMPANY_NAME` are passed as Docker **build args** | The homepage is statically rendered at build time, when runtime env is not available. Changing them requires a rebuild. |
| D8 | Matching pipeline has three stages: exact trigger → keyword vote → single-query Fuse fallback (triggers only) | Fuse alone performs badly when a long sentence is searched against short triggers, and searching many sliding word-windows and keeping the best score (the original plan) amplifies noise rather than filtering it — see the note at the top of §8.2 for the empirical reasoning. |
| D9 | No Next.js middleware. Admin auth is checked in the protected layout **and** in every server action / route handler | Avoids version-specific middleware behaviour; layouts alone do not protect actions. |
| D10 | `translations` rows older than 12 months are purged nightly | The privacy policy needs a truthful retention statement. |
| D11 | Admin "top matched / unmatched" tables use a 30-day window; an extra "most down-voted phrases" table is added | Otherwise feedback votes are collected and never surfaced. |
| D12 | Email-bar copy says "120+" (constant `LIBRARY_COUNT_LABEL`), not "150+" | The brief promises 150+ but requires only 120 entries. The label must never exceed the real active count. Raise it when the library grows. |
| D13 | The no-scroll lock applies at `min-width:1024px AND min-height:680px`. Shorter desktop windows scroll normally | Prevents clipped, unreachable content on very short windows. Both acceptance viewports are covered. |
| D14 | Real product names (Wix, Squarespace, WordPress…) are allowed in `triggers`/`keywords` only, never in `meaning`/`question`/`reply` | Clients say these names, so matching needs them; the brief's own example 7 uses them. |
| D15 | Validation is hand-written (no zod); tests use Node's built-in runner via `tsx --test` | Keeps the dependency list at the brief's minimum. |

---

## 3. Stack, versions, and the complete dependency list

| Thing | Choice |
|---|---|
| Runtime | Node.js 22 LTS |
| Framework | Next.js, latest stable (15 or newer), App Router, TypeScript `strict`, `output: 'standalone'` |
| Styling | Tailwind CSS v4 (CSS-first config, `@tailwindcss/postcss`) |
| DB | PostgreSQL 16 |
| ORM | Drizzle ORM + drizzle-kit, `postgres` (postgres.js) driver |
| Fuzzy | Fuse.js v7, **server-side only** |
| Email | Nodemailer over SMTP, optional |
| Image share | `html-to-image`, lazy-imported on click |
| Deploy | Docker Compose: `app`, `db`, `caddy` (+ `tools` profile) |

**Allowed dependencies — this is the whole list. Ask the owner before adding anything else.**

```
dependencies:    next react react-dom drizzle-orm postgres fuse.js nodemailer html-to-image
devDependencies: typescript @types/node @types/react @types/react-dom @types/nodemailer
                 tailwindcss @tailwindcss/postcss drizzle-kit tsx eslint eslint-config-next
```

Explicitly **not** allowed: auth libraries, state management, component kits, zod/yup, dotenv, date libraries, analytics, test frameworks, Google Fonts at runtime.

**Framework rules that will bite you if ignored**

1. `cookies()`, `headers()`, `params`, `searchParams` are **async**. Always `await` them.
2. Nothing may touch the database or validate env **at import time**. `next build` runs inside Docker with no DB and no runtime env. All DB/env access is lazy (inside functions). Every page or route that queries the DB exports `export const dynamic = 'force-dynamic'`.
3. Module-level singletons (DB client, phrase cache, rate limiter, mail transport) **must live on `globalThis`**. Next.js bundles route handlers and server actions into separate module graphs, so a plain `let cache` can exist twice and admin edits would never invalidate the API's copy.
4. Never use `NEXT_PUBLIC_*` variables. Nothing on the client needs env.
5. The homepage (`/`) must stay statically rendered. Do not read cookies/headers in it.

---

## 4. Repository map

Every file the project needs, and what belongs in it. Do not add directories beyond this without a reason.

```
.
├── app/
│   ├── layout.tsx                  Root layout: <html lang="en">, fonts, metadata, globals.css. NO overflow rules here.
│   ├── globals.css                 Tailwind import, design tokens, dark mode vars, `desk` variant, animations.
│   ├── page.tsx                    Homepage shell (server, static). Renders SiteHeader, <Translator/>, SiteFooter.
│   ├── fonts/                      Self-hosted font files (woff2 for web, one ttf for /og).
│   ├── library/
│   │   ├── page.tsx                Server, dynamic. Reads unlock cookie, queries phrases, renders LibraryBrowser.
│   │   └── unlock/route.ts         GET ?token= → verify, set unlock cookie, redirect to /library.
│   ├── unsubscribe/page.tsx        Confirm page with a button (server action). Never mutates on GET.
│   ├── terms/page.tsx              Static legal draft.
│   ├── privacy/page.tsx            Static legal draft.
│   ├── admin/
│   │   ├── login/page.tsx          Login form + server action. Outside the protected group.
│   │   ├── actions.ts              ALL admin server actions. Each starts with `await requireAdmin()`.
│   │   └── (protected)/
│   │       ├── layout.tsx          `await requireAdmin()`; tab nav; logout button.
│   │       ├── page.tsx            Overview tab.
│   │       ├── phrases/page.tsx    Phrases tab.
│   │       ├── suggestions/page.tsx
│   │       └── leads/
│   │           ├── page.tsx
│   │           └── export/route.ts CSV download. Calls requireAdmin() itself.
│   ├── api/
│   │   ├── translate/route.ts
│   │   ├── lead/route.ts
│   │   ├── feedback/route.ts
│   │   ├── suggest/route.ts
│   │   ├── unsubscribe/route.ts    POST, RFC 8058 one-click target.
│   │   └── health/route.ts
│   ├── og/route.tsx                next/og ImageResponse, 1200×630.
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── SiteHeader.tsx              Server. App name + Library · Terms · Privacy.
│   ├── SiteFooter.tsx              Server. The one paid-product line.
│   ├── Translator.tsx              Client. Owns all homepage state (§6.2).
│   ├── ResultCard.tsx              Client. Card body + action row.
│   ├── RiskBadge.tsx               Shared. Low/Medium/High/Unknown.
│   ├── ShareCard.tsx               Client. Fixed 1200×675 off-screen node rendered to PNG.
│   ├── EmailBar.tsx                Client. One-line capture bar.
│   ├── EmailForm.tsx               Client. The ONLY email form; used by EmailBar and the library wall.
│   ├── SuggestForm.tsx             Client. Inline no-match suggestion form.
│   └── LibraryBrowser.tsx          Client. Search + grouped <details> list + wall.
├── lib/
│   ├── site.ts                     Constants: APP_NAME, LIBRARY_COUNT_LABEL, CATEGORIES, UTM string, example phrases.
│   ├── env.ts                      Lazy env reader/validator. `env()` throws on first use if required vars are missing.
│   ├── db.ts                       Lazy postgres.js + drizzle singleton on globalThis.
│   ├── validate.ts                 isEmail, isUuid, cleanText. Hand-written.
│   ├── phrase-validate.ts          validatePhrase() — shared by seed check and admin forms.
│   ├── rate-limit.ts               In-memory sliding window on globalThis.
│   ├── ip.ts                       getClientIp(req), hashIp(ip).
│   ├── tokens.ts                   HMAC sign/verify for unlock cookie, admin cookie, unsubscribe token.
│   ├── admin-auth.ts               requireAdmin(), checkPassword().
│   ├── mailer.ts                   isMailConfigured(), sendLibraryEmail(). Never throws to callers.
│   ├── counters.ts                 bump(key).
│   ├── engine/
│   │   ├── normalise.ts            Pure.
│   │   ├── match.ts                Pure. createEngine(phrases) → { match(text) }.
│   │   ├── fallback.ts             The no-match response constant.
│   │   └── cache.ts                getEngine(), invalidatePhraseCache(). 10-min TTL, check-on-read.
│   └── client/
│       ├── storage.ts              try/catch wrappers for localStorage + sessionStorage.
│       └── session.ts              getSessionId(), translation counter.
├── db/
│   ├── schema.ts                   Drizzle schema (§5).
│   └── seed/
│       ├── index.ts                Idempotent seeder; prints category counts.
│       ├── validate.ts             `npm run seed:check` — runs validatePhrase on every entry.
│       └── phrases/                One file per category: taste.ts, trust.ts, scope.ts, money.ts,
│                                   timeline.ts, committee.ts, tech.ts, launch-fear.ts
├── drizzle/                        Generated SQL migrations. Committed. Never hand-edited.
├── tests/
│   ├── normalise.test.ts
│   ├── match.test.ts               Runs the engine against labelled cases (§19).
│   ├── match.cases.ts              The labelled cases.
│   ├── tokens.test.ts
│   └── phrase-validate.test.ts
├── scripts/backup.sh               Nightly pg_dump + retention purge.
├── public/                         favicon.ico, icon.svg. Must exist (Dockerfile copies it).
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml          Dev override: publishes db on 127.0.0.1:5432 only.
├── Caddyfile
├── drizzle.config.ts
├── next.config.ts                  output: 'standalone', security headers.
├── postcss.config.mjs
├── .env.example
├── .gitignore  .dockerignore
├── deploy.md
└── docs/build-spec.md              This file.
```

**`package.json` scripts**

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "tsx --test tests/*.test.ts",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:seed": "tsx db/seed/index.ts",
  "seed:check": "tsx db/seed/validate.ts"
}
```

`drizzle.config.ts` and `db/seed/index.ts` load env for local use with Node's built-in loader — no dotenv:

```ts
try { process.loadEnvFile('.env.local'); } catch {}
```

---

## 5. Database

### 5.1 Schema — `db/schema.ts`

```ts
import {
  pgTable, serial, bigserial, integer, bigint, smallint, real,
  text, boolean, uuid, timestamp, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

const ts = (name: string) => timestamp(name, { withTimezone: true });

export const phrases = pgTable('phrases', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  triggers: text('triggers').array().notNull(),
  keywords: text('keywords').array().notNull(),
  category: text('category').notNull(),
  meaning: text('meaning').notNull(),
  question: text('question').notNull(),
  reply: text('reply').notNull(),
  risk: text('risk').notNull(),                       // low | medium | high
  active: boolean('active').notNull().default(true),
  createdAt: ts('created_at').notNull().defaultNow(),
  updatedAt: ts('updated_at').notNull().defaultNow(), // set manually in update actions
});

export const translations = pgTable('translations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sessionId: uuid('session_id').notNull(),
  inputText: text('input_text').notNull(),
  phraseId: integer('phrase_id').references(() => phrases.id, { onDelete: 'set null' }),
  confidence: real('confidence'),
  createdAt: ts('created_at').notNull().defaultNow(),
}, (t) => [
  index('translations_created_at_idx').on(t.createdAt),
  index('translations_phrase_id_idx').on(t.phraseId),
]);

export const feedback = pgTable('feedback', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  translationId: bigint('translation_id', { mode: 'number' })
    .notNull().references(() => translations.id, { onDelete: 'cascade' }),
  vote: smallint('vote').notNull(),                   // 1 | -1
  createdAt: ts('created_at').notNull().defaultNow(),
}, (t) => [
  uniqueIndex('feedback_translation_id_uq').on(t.translationId), // one vote per translation
]);

export const suggestions = pgTable('suggestions', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  email: text('email'),
  status: text('status').notNull().default('new'),    // new | added | rejected
  createdAt: ts('created_at').notNull().defaultNow(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),            // the unique constraint IS the email index
  source: text('source').notNull(),                   // bar | library
  consentAt: ts('consent_at').notNull(),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  unsubscribedAt: ts('unsubscribed_at'),
  createdAt: ts('created_at').notNull().defaultNow(),
});

export const counters = pgTable('counters', {
  key: text('key').primaryKey(),
  value: bigint('value', { mode: 'number' }).notNull().default(0),
});
```

Rules:

- **No IP, hashed or otherwise, in `translations`, `feedback`, or `suggestions`.** Only `leads.ip_hash`.
- Phrases are never hard-deleted from the admin UI; they are toggled `active = false`.
- Enum-like columns (`category`, `risk`, `status`, `source`) stay `text`; validation lives in `lib/phrase-validate.ts` and the route handlers. This keeps migrations trivial when a category is added.

### 5.2 Counters — `lib/counters.ts`

One function: `bump(key: CounterKey)`, implemented as
`insert into counters (key, value) values ($1, 1) on conflict (key) do update set value = counters.value + 1`.

Keys: `translations_total`, `translations_unmatched`, `leads_total`, `feedback_up`, `feedback_down`, `suggestions_total`.

`bump` failures are caught and logged; they never fail a request.

### 5.3 Migrations

- Change `db/schema.ts` → `npm run db:generate` → commit the new file in `drizzle/`.
- Apply with `npm run db:migrate` (locally) or the `tools` service (production, §16).
- Never edit a generated migration after it has been merged.

### 5.4 Seeder — `db/seed/index.ts`

- Runs `validatePhrase` on every entry first; aborts on any error.
- Inserts with `on conflict (slug) do nothing`. **Re-seeding must never overwrite production edits** made through the admin panel.
- `--force` flag switches to `do update` for all content columns (for deliberate bulk corrections).
- The ten tone-setting examples from the brief are seeded **first** so they get ids 1–10; they are the free sample on `/library`.
- Finishes by printing a table of category → count and the total, and exits non-zero if any category has fewer than 12 entries or the total is under 120.

---

## 6. Homepage (`/`)

### 6.1 Layout and the no-scroll rule

Define a custom Tailwind variant in `globals.css`:

```css
@custom-variant desk (@media (min-width: 1024px) and (min-height: 680px));
```

Page skeleton (`app/page.tsx`):

```tsx
<div className="min-h-dvh flex flex-col desk:h-dvh desk:overflow-hidden">
  <SiteHeader />                                   {/* h-12, shrink-0 */}
  <main className="flex-1 min-h-0 w-full max-w-[760px] mx-auto px-4 py-2 flex flex-col">
    <Translator />                                 {/* fills main; renders EmailBar at its bottom */}
  </main>
  <SiteFooter />                                   {/* h-9, shrink-0 */}
</div>
```

- The lock is on this wrapper, **not** on `body`. Putting `overflow:hidden` on `body` in the root layout would break `/library`, `/terms`, `/privacy`.
- Below the `desk` breakpoint everything stacks and scrolls normally.

**Two visual states of `<Translator/>` on desktop**

| Element | Idle state | Result state |
|---|---|---|
| Hero `<h1>` | Display font, ~48px, vertically centred block with the input | Shrinks to ~24px single line. At viewport height < 760px it becomes `sr-only` (stays in DOM — single h1 rule) |
| Textarea | ~6 rows (≈160px) | Collapses to ≈56–76px (1–2 rows), still editable |
| Button | 44px, full width | unchanged |
| Result card | not rendered | `flex-1 min-h-0`, slides in (200ms translate-y + opacity) |
| Email bar | hidden | 48px row when eligible (§6.6) |

**Height budget at 1280×720, result state, email bar visible** — this is the worst case and it must fit:

```
header 48 + textarea 56 + button 44 + email bar 48 + footer 36 + gaps 48 + main padding 16  = 296
→ result card gets 720 − 296 = 424px   (hero is sr-only at this height)
```

Card content needs ≈355px at the content length caps in §9.2 (risk badge shares a row with the first label; body 15px/22px; reply box 14px/20px). That leaves ~70px of slack. **Last-resort safety valve:** the card's text region is `overflow-y-auto`, so an over-long admin-written entry scrolls inside the card and never produces a page scrollbar.

The no-match state must use the same card height: the suggestion form replaces the action row **in place** (§6.5), it does not add a row under the card.

### 6.2 `<Translator/>` state

```ts
type Status = 'idle' | 'loading' | 'result' | 'error';

state = {
  text: string,                 // textarea value
  status: Status,
  result: TranslateResponse | null,
  translatedText: string,       // the text that produced `result`
  errorMessage: string | null,
  vote: 0 | 1 | -1,             // feedback given for the current result
  copied: boolean,
}
derived: stale = status === 'result' && text.trim() !== translatedText
```

Behaviours:

- **Autofocus** the textarea on mount only when `matchMedia('(min-width:1024px)')` matches (avoids popping the mobile keyboard).
- **Placeholder rotation:** cycle `EXAMPLE_PHRASES` from `lib/site.ts` every 3.5s. Stop once the user has typed anything. With `prefers-reduced-motion: reduce`, show the first example and do not rotate.
- **Character counter** bottom-right of the textarea: `{text.length}/400`. `maxLength={400}`. Counter turns accent-coloured at ≥ 380.
- **Submit:** Enter submits; Shift+Enter inserts a newline. Guard IME composition:
  ```ts
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
  ```
  Empty/whitespace-only text does nothing. Submitting while `loading` does nothing.
- **Artificial delay:** `const [res] = await Promise.all([fetchTranslate(), sleep(400)])`. The delay is a *minimum*, not added on top of latency.
- **Button label:** "Translate" → "Decoding…" with a 14px CSS spinner while loading; `disabled` + `aria-busy`.
- **Stale result:** when `stale`, the card gets `opacity-50` (150ms transition). It returns to full opacity on the next successful translate.
- **Errors:** 429 → "Easy there — try again in a minute." Anything else → "Something broke on our end. Try again." Shown in the card slot with `role="alert"`. The textarea keeps its content.
- **Result region:** wrapper has `aria-live="polite"`. Do not move focus when the result arrives.
- **Translation counter:** after each response with `matched: true`, increment `cst_tx_count` in sessionStorage (§6.6).

### 6.3 `<ResultCard/>`

Top to bottom:

1. Row: label "What they probably mean" (left) + `<RiskBadge/>` (right).
2. Meaning paragraph.
3. Label "Ask them this" + the question in a `<blockquote>` with an accent left border.
4. Label "Copy-paste reply" + bordered box containing the reply and a **Copy** button (top-right of the box).
5. Action row (small, muted): thumbs-up, thumbs-down, **Share as image**, **Try another**.

Details:

- **Copy:** `navigator.clipboard.writeText(reply)` in try/catch; on failure fall back to selecting the text. Label flips to "Copied" for 1.5s. Announce via a visually hidden `aria-live` span.
- **Feedback:** two icon buttons with `aria-label="This was helpful"` / `"This missed the mark"`. On click: POST `/api/feedback`, immediately replace both buttons with the text "Thanks" (optimistic; ignore errors). Hidden entirely when `translationId` is null or the result is a no-match.
- **Try another:** clear text, clear result, status → idle, focus the textarea.
- **`<RiskBadge/>`:** pill with text "Low risk" / "Medium risk" / "High risk" / "Unknown". Colour is never the only signal. Colours in §7.

### 6.4 Share as image

This is the main viral mechanic. Spend design time here.

- Do **not** screenshot the live card. Render a dedicated `<ShareCard/>`: a fixed `1200×675` node, positioned off-screen with `position:fixed; left:-10000px; top:0` (`display:none` cannot be rendered). Always light theme, regardless of the user's colour scheme.
- Content: app name (top-left, small) · the client's phrase in large display-font quotes (clamped to 140 chars with an ellipsis; step the font size down at >60 and >100 chars) · "What they probably mean" + the meaning · risk badge · site host (bottom-right, e.g. `clientspeak.example`). **Never include the reply text.**
- On click:
  ```ts
  const { toBlob } = await import('html-to-image');           // lazy: keeps it out of the initial bundle
  await document.fonts.ready;
  const opts = { width: 1200, height: 675, pixelRatio: 1, cacheBust: true };
  let blob = await toBlob(node, opts);
  if (isSafari) blob = await toBlob(node, opts);              // Safari's first pass often drops fonts
  ```
  `pixelRatio: 1` is required — the default uses `devicePixelRatio` and would emit 2400×1350 on retina screens, failing acceptance #4.
- Download via a temporary `<a download="client-speak-{slug|unknown}.png">`.
- Then try clipboard copy inside try/catch: `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])`. Button label shows "Saved + copied" or "Saved" for 2s.
- While rendering, the button shows "Rendering…" and is disabled.

### 6.5 No-match state

Rendered in the same `<ResultCard/>` using the constant in `lib/engine/fallback.ts`:

- Badge: "Unknown" (neutral grey).
- Meaning: "We haven't decoded this one yet. Most vague feedback falls into one of three buckets: taste, trust, or fear of the launch."
- Question: "Which part of the page did you react to first, and what did you expect to see there instead?"
- Reply: "Thanks for the feedback — I want to make sure I act on it properly. Could you point me to the specific section you're reacting to and tell me what you expected to see there instead? A screenshot with a quick note is perfect. Once I have that, I'll come back with a concrete fix rather than a guess."
- Action row: feedback thumbs are replaced by a text button **"Want us to add this phrase?"**. Clicking swaps the action row for `<SuggestForm/>` inline: `[optional email input] [Send]` + hidden honeypot. On success the row becomes "Got it — thanks." Share and Try another remain available before the form is opened.

### 6.6 Email bar

Show the bar when **all** are true:

- `cst_tx_count` (sessionStorage) ≥ 2 — counts only `matched: true` responses
- no `cst_bar_dismissed_at` (localStorage) within the last 30 days
- no `cst_lead` flag (localStorage) — set to `1` after any successful lead submit

Copy: "Want the full library of {LIBRARY_COUNT_LABEL} decoded phrases?" `[email] [Send it]` `[×]`. On desktop it is one 48px row; the consent checkbox and its label sit inline to the right of the input. After success the row becomes: "Sent. The library is unlocked — open it →" (link to `/library`).

All storage access goes through `lib/client/storage.ts`, which wraps every call in try/catch and returns `null` on failure. If storage is unavailable the bar simply shows again next visit — never crash.

### 6.7 `<EmailForm/>` (used by the bar and the library wall)

Props: `source: 'bar' | 'library'`, `layout: 'inline' | 'stacked'`, `onSuccess()`.

Fields — exactly these and no others:

1. `email` — `type="email"`, `required`, `autocomplete="email"`, visible or sr-only label.
2. `consent` — checkbox, **unchecked by default**, `required`. Label: "I agree to the [Terms](/terms) and [Privacy Policy](/privacy)".
3. `website` — honeypot. Text input, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`, hidden with an off-screen class (not `display:none`; some bots skip those).

Under the form, one muted line: "One email with the link. Occasional product updates. Unsubscribe anytime."

Submit → POST `/api/lead`. On `{ ok: true }`: set `cst_lead=1`, call `onSuccess`. On 429: "Too many tries — give it an hour." On 400: show the field message.

---

## 7. Design system

### 7.1 Tokens — `app/globals.css`

```css
@import "tailwindcss";
@custom-variant desk (@media (min-width: 1024px) and (min-height: 680px));

:root {
  --bg: #FAF8F4;  --surface: #FFFFFF;  --ink: #1C1917;  --muted: #6B645C;
  --line: #E7E2DA; --accent: #C2410C;  --on-accent: #FFFFFF;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #171412;  --surface: #211D1A;  --ink: #F5F1EA;  --muted: #A8A097;
    --line: #38322C; --accent: #FB923C;  --on-accent: #171412;
  }
}
@theme inline {
  --color-bg: var(--bg);        --color-surface: var(--surface);
  --color-ink: var(--ink);      --color-muted: var(--muted);
  --color-line: var(--line);    --color-accent: var(--accent);
  --color-on-accent: var(--on-accent);
}
```

Components use `bg-bg text-ink border-line bg-accent text-on-accent` — **no `dark:` variants scattered through components.** Dark mode is entirely the variable swap above.

The accent is `#C2410C`, not a brighter orange, because white text on brighter oranges fails WCAG AA (4.5:1) and would cost the Lighthouse accessibility score. All pairs above pass AA.

Risk badge colours (background / text):

| | Light | Dark |
|---|---|---|
| Low | `#DCFCE7` / `#166534` | `#14532D` / `#BBF7D0` |
| Medium | `#FEF3C7` / `#92400E` | `#78350F` / `#FDE68A` |
| High | `#FEE2E2` / `#991B1B` | `#7F1D1D` / `#FECACA` |
| Unknown | `#E7E5E4` / `#44403C` | `#44403C` / `#E7E5E4` |

### 7.2 Typography

- **Display** (hero line, share card, OG image): Fraunces (OFL licence), self-hosted variable woff2, Latin subset, loaded with `next/font/local`, `display: 'swap'`. Keep one static `Fraunces-SemiBold.ttf` alongside it for `/og` — Satori (next/og) cannot read woff2.
- **Body:** system stack — `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Zero bytes.
- No runtime requests to Google Fonts or any font CDN.

### 7.3 Motion and accessibility

- Allowed motion: result slide-in, stale fade, copy confirmation, spinner. Nothing else. All disabled under `prefers-reduced-motion: reduce`.
- Every interactive element has a visible `:focus-visible` ring (2px accent, 2px offset).
- Full keyboard path: textarea → Translate → Copy → thumbs → Share → Try another → email form → footer link.
- Touch targets ≥ 44px on mobile. One `<h1>` per page. Landmarks: `header`, `main`, `footer`.

### 7.4 Header and footer copy

- Header left: "Client-Speak Translator" (text, links to `/`). Right: `Library · Terms · Privacy`.
- Hero: "Paste what the client said. Get what they meant."
- Footer: "Made by {COMPANY_NAME} — the CRM built for web designers →" linking to `{PAID_APP_URL}?utm_source=client-speak-translator&utm_medium=footer&utm_campaign=lead-magnet`, `target="_blank" rel="noopener"`.

---

## 8. Translation engine

The engine is **pure** (no DB, no env) so it can be unit-tested against the seed files directly. `lib/engine/cache.ts` is the only part that touches the database.

### 8.1 `normalise(raw)` — `lib/engine/normalise.ts`

```ts
const FILLERS = ['kind of', 'sort of', 'um', 'uh', 'just', 'like', 'maybe', 'please']; // multi-word first

export function normalise(raw: string): string {
  let s = raw.toLowerCase().normalize('NFKC');
  s = s.replace(/[’'`]/g, '');                 // i'll → ill, don't → dont
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');     // all other punctuation → space
  s = s.replace(/\s+/g, ' ').trim();
  for (const f of FILLERS) s = s.replace(new RegExp(`\\b${f}\\b`, 'g'), ' ');
  return s.replace(/\s+/g, ' ').trim();
}
```

**Both sides go through this function**: user input at request time, and every trigger and keyword at cache-load time. That is what keeps quirks harmless (e.g. "I don't like it" → "i dont it" on both sides). Consequence: filler words can never be keywords — the seed validator rejects them.

### 8.2 `createEngine(phrases)` → `match(text)` — `lib/engine/match.ts`

```ts
type EnginePhrase = { id: number; slug: string; triggers: string[]; keywords: string[]; category: string; /* + content */ };
type MatchResult  = { phrase: EnginePhrase | null; confidence: number; stage: 'exact' | 'fuse' | 'keywords' | 'none' };
```

> **Built and tuned against the empirical noise floor, not the original plan.** The design below (sliding word-windows, Fuse indexing triggers + keywords + category, Fuse-before-keywords ordering) is what was originally planned, but building `tests/match.cases.ts` against the real 120-entry library showed it doesn't hold up: taking the single best score across dozens of short sliding-window queries against many short trigger/keyword strings amplifies noise — garbage input like "the weather has been really nice this week" scored as a confident match purely by chance, because with enough independent short queries some short window is bound to look coincidentally close to some short trigger. What's actually implemented, and what M1 shipped and tested green, is documented here; treat this as the current spec.

At creation: normalise all triggers (keywords and category are normalised too, for the keyword-vote stage, but are **not** indexed in Fuse — see below), build one Fuse index over triggers only:

```ts
new Fuse(docs, {
  includeScore: true, ignoreLocation: true, minMatchCharLength: 3,
  threshold: 1,                                    // disabled; FUSE_THRESHOLD (0.3) is applied manually
  keys: [{ name: 'triggersNorm', weight: 1.0 }],
});
```

`match(text)` runs the stages in order and returns at the first hit:

**Stage 0 — guard.** `n = normalise(text)`. If `n.length < 2` → none.

**Stage 1 — exact trigger (wins outright).** For every phrase and trigger, test `(' ' + n + ' ').includes(' ' + trigger + ' ')` — the padding makes it whole-word, so "pop" cannot match "popup". If several phrases hit, the **longest trigger** wins; tie → lowest id. Confidence `1.0`.

**Stage 2 — keyword vote (deterministic, runs before fuzzy).** Tokens of `n` (strip a trailing "s" from both tokens and keywords) intersected with each phrase's keywords. Accept only if the top phrase has **≥ 2 distinct hits and no tie for first**. Confidence fixed at `0.5`. This runs *before* the fuzzy stage because it's the more common and more reliable case — a paraphrase that shares vocabulary with a phrase is far more frequent than one that's merely a close edit of the trigger text itself, and unlike fuzzy edit-distance it can't be fooled by unrelated short strings.

**Stage 3 — Fuse fallback (single whole-string query, triggers only).** Catches rewordings close enough to an actual trigger that Stage 2 didn't have 2 shared keywords for:

- `n` capped at the first 40 words, queried as a single string — no sliding windows. (Windows were the source of the noise described above; one query against the full input keeps the score meaningfully separated from chance matches.)
- Skipped entirely for single-word input — one fuzzy keyword hit ("logo") would otherwise hijack any input that happens to contain it.
- Accept if `score ≤ FUSE_THRESHOLD` (`0.3`, tuned empirically — see `tests/match.test.ts`). Confidence = `1 − score`.

**Otherwise** → none; `confidence` = the Stage-3 score seen (useful in the admin's unmatched list), or 0.

Round confidence to 2 decimals. Tunables (`FUSE_THRESHOLD`, `KEYWORD_MIN_HITS`) are exported constants at the top of the file.

Performance target: < 100ms per match for 120+ phrases and a 400-char input — comfortably met, since each match is now one exact-substring pass, one keyword-intersection pass, and at most one Fuse query (not dozens).

### 8.3 Phrase cache — `lib/engine/cache.ts`

```ts
const g = globalThis as unknown as { __cstEngine?: { engine: Engine; loadedAt: number; loading?: Promise<Engine> } };

export async function getEngine(): Promise<Engine>   // loads active phrases if empty or older than 10 min
export function invalidatePhraseCache(): void         // sets loadedAt = 0; called by every admin phrase mutation
```

- Check-on-read TTL; no `setInterval`.
- Share an in-flight `loading` promise so concurrent requests trigger one query.
- If a reload fails and a previous engine exists, **keep serving the stale engine** and log the error. Translations must survive a DB blip.

---

## 9. Phrase library content

### 9.1 Categories

| Category | What belongs here |
|---|---|
| `taste` | Subjective look-and-feel reactions without vocabulary: colour, type, spacing, "energy". |
| `trust` | Doubts about the designer, the process, ownership, access, guarantees; past bad experiences. |
| `scope` | Anything that grows the work: additions, "quick" favours, extra rounds, assumed inclusions. |
| `money` | Price objections, discounts, payment timing, comparisons with DIY tools or cheap relatives. |
| `timeline` | Rush requests, delays (theirs or perceived), status anxiety, pauses, missing content. |
| `committee` | Feedback from people who are not the decision-maker: family, boss, board, staff, social polls. |
| `tech` | Misunderstandings about browsers, caching, speed, SEO, hosting, platforms, editing, email. |
| `launch-fear` | Stalling before go-live: perfectionism, second thoughts, "one more round", fear of judgement. |

### 9.2 Entry rules (enforced by `validatePhrase` — seed and admin share it)

| Field | Rule |
|---|---|
| `slug` | kebab-case, unique, ≤ 60 chars. Admin-created phrases auto-generate it from the first trigger (+ `-2`, `-3` on collision). |
| `triggers` | 3–8 items. Each is something a client would literally say. Each must be **≥ 2 words after normalisation**. No normalised trigger may appear in two phrases. |
| `keywords` | 3–10 single lowercase words. No filler words (§8.1). |
| `category` | one of the eight above |
| `risk` | `low` \| `medium` \| `high` |
| `meaning` | 2–3 sentences, **≤ 260 chars**. Honest, a little funny, never mean about the client. |
| `question` | exactly one question, **≤ 160 chars** |
| `reply` | 2–4 sentences, **≤ 360 chars**. Something a professional would actually send verbatim. Fill-in slots use square brackets, e.g. `[Friday]`. |
| Names | Real product/company names only in `triggers`/`keywords` (D14). |

The length caps are what make the no-scroll layout work (§6.1). Do not raise them without re-checking the height budget.

**Voice:** the designer is the hero; the client is a normal person who lacks vocabulary, not a villain. Replies never apologise for having a process, never sound passive-aggressive, and always end with a clear next step. The ten examples in the original brief are the reference for tone — copy them in verbatim as entries 1–10.

### 9.3 Writing backlog — 120 entries

One entry per line below. (✓ = already written in the brief.) Writers may swap individual topics but must keep each category's count.

**taste (20):** make it pop ✓ · I'll know it when I see it ✓ · something feels off ✓ · make the logo bigger ✓ · make it more modern · it looks too plain/boring · make it more fun/playful · make it look more premium/high-end · not sure about the colours · can we try a different font · too much white space · it feels too busy · make it look like [famous brand]'s site · it needs more wow factor · can you jazz it up · it's too corporate · it doesn't feel like us · make it cleaner · can we see a few more options · I liked the first version better

**trust (14):** can I see it before paying the deposit · my last designer disappeared · can you just send me the files · who owns the site when it's done · can I have the admin login · do we really need a contract · how do I know this will get me customers · can you guarantee page one of Google · can you do a quick mockup first so we can decide · I've been burned before · can I talk to a past client · why do you need my domain login · are you going to outsource this · what happens if I don't like it

**scope (18):** just a small change ✓ · add a blog/shop/booking system ✓ · while you're in there can you also · can you just quickly · one more round of revisions · can you write the copy too · can you do the logo as well · can we add a few more pages · can you set up my email too · can you do our social graphics · it should only take you five minutes · I thought that was included · can we start over in a new direction · I want to be able to edit everything myself · can you add a popup/chat widget/animation · can you find the photos · can we add another language · can you train my team

**money (16):** the DIY builder is free, why is this $4,000 ✓ · that's more than I expected · can you do it cheaper · my nephew can do it for $500 · can we pay when it's finished · we'll send you lots of referrals · there's more work coming later, so discount this one · can we pay in instalments · what's your hourly rate · why do I pay monthly for hosting/maintenance · can we drop something to save money · I'll pay the invoice next week (again) · can I get a refund · do you charge for calls · do you do a friends/nonprofit discount · just give me a ballpark

**timeline (14):** when will it be done ✓ · we need it by Friday · can you start today · sorry, been busy (after weeks of silence) · I'll get you the content next week · we must launch before the event · why is it taking so long · can we push the deadline · got time for a quick call · can you work this weekend · I need it yesterday · let's pause the project for a bit · we're nearly there, right · can you just put up something temporary

**committee (12):** my brother/nephew/friend thinks ✓ · I need to run it by my partner/boss · everyone in the office has thoughts · my wife/husband doesn't like the colour · let's ask our followers to vote · the CEO hasn't seen it yet · our new marketing person has ideas · can you combine option A and option B · I showed it to a few customers · our investor thinks · we couldn't agree, so here are everyone's comments · legal needs to review it

**tech (14):** it looks different on my phone · can you make it load faster · why aren't we on Google yet · it doesn't work in my browser · I can't see the changes you made · can I edit it myself · can we move it to a different platform · the site is down · can you make it secure · I'm not getting the contact form emails · can you make it an app · can you add SEO · I updated something and it broke · can we use my cousin's cheap hosting

**launch-fear (12):** hold off until it's perfect ✓ · can we do a soft launch · one more round before we go live · what if people don't like it · can we keep the old site up just in case · let me sit on it for a few days · I'm not sure about it anymore · can we test everything first · what if it breaks on launch day · let's wait until after the busy season · I want to rewrite all the copy first · a competitor just relaunched, should we rethink

### 9.4 Deliverable check

`npm run seed:check` must pass and print the category table. Paste that table into the PR description for the owner to confirm coverage (brief §14).

---

## 10. API reference

Conventions for every handler in `app/api/**/route.ts`:

- `export const dynamic = 'force-dynamic'`. JSON in, JSON out. Parse the body in try/catch → `400 { "error": "invalid_input" }` on bad JSON.
- Error shape is always `{ "error": code, "message"?: string }`. Codes: `invalid_input` (400), `rate_limited` (429, with `Retry-After` seconds), `server_error` (500).
- Client IP: `lib/ip.ts` reads the first entry of `x-forwarded-for`. This is trustworthy **only because** the app port is not published and Caddy overwrites the header (§16). If a CDN/proxy is ever put in front of Caddy, configure Caddy `trusted_proxies`.
- Never log raw emails or IPs to stdout.

### 10.1 `POST /api/translate`

Rate limit: 30 / minute / IP.

Request: `{ "text": string, "sessionId": string }`

Validation: `text` trimmed length 1–400; `sessionId` matches a UUID regex. Else 400.

Flow:
1. rate limit → validate
2. `engine = await getEngine()`; `result = engine.match(text)`
3. Insert into `translations` (`input_text` = trimmed raw text, `phrase_id`, `confidence`). **Wrapped in try/catch** — if logging fails, still respond, with `translationId: null`.
4. `bump('translations_total')`, and `bump('translations_unmatched')` when unmatched.

Response 200:

```json
{
  "matched": true,
  "phraseId": 1,
  "translationId": 48213,
  "confidence": 1,
  "meaning": "…", "question": "…", "reply": "…",
  "risk": "medium",
  "category": "taste",
  "slug": "make-it-pop"
}
```

No-match: `matched:false, phraseId:null, risk:"unknown", category:null, slug:null`, with `meaning/question/reply` from `lib/engine/fallback.ts`.

### 10.2 `POST /api/lead`

Rate limit: 5 / hour / IP.

Request: `{ "email": string, "consent": boolean, "source": "bar" | "library", "website": string }`

Flow, in this order:
1. Rate limit.
2. **Honeypot:** if `website` is non-empty → respond `200 { "ok": true }` and do nothing else. No row, no cookie, no email.
3. Validate: `email` trimmed + lowercased, ≤ 254 chars, matches `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`; `consent === true`; `source` in enum. Else 400 with a message for the field.
4. Upsert:
   - `insert … on conflict (email) do nothing returning id`.
   - Row returned → new lead → `bump('leads_total')`.
   - No row → existing lead → `update leads set consent_at = now(), unsubscribed_at = null where email = $1 returning id` (re-consent re-subscribes). `source` keeps its original value.
5. Set the unlock cookie (§11.1).
6. If `isMailConfigured()` and this address has not been emailed in the last 24h (in-memory map on `globalThis`), schedule `sendLibraryEmail` with `after()` from `next/server` so it runs post-response. Failures are logged only.
7. Respond `200 { "ok": true }`. The response is **identical** for new and existing emails (no enumeration).

Stored alongside: `ip_hash = HMAC-SHA256(IP_HASH_SECRET, ip)` hex, `user_agent` truncated to 300 chars.

### 10.3 `POST /api/feedback`

Rate limit: 60 / minute / IP.

Request: `{ "translationId": number, "vote": 1 | -1, "sessionId": string }`

Look up the translation; if it does not exist **or its `session_id` differs** → `200 { ok: true }` and do nothing (no oracle). Otherwise `insert … on conflict (translation_id) do nothing`; if a row was inserted, bump `feedback_up` / `feedback_down`. Respond `{ "ok": true }`.

### 10.4 `POST /api/suggest`

Rate limit: 5 / hour / IP.

Request: `{ "text": string, "email"?: string, "website": string }`

Honeypot as in 10.2. `text` 1–400 chars; `email` optional but must validate if present. Insert with `status='new'`; `bump('suggestions_total')`. An email here is **not** a lead — no consent was given; never copy it into `leads`.

### 10.5 `GET /api/health`

`select 1` with a 2-second timeout. `200 { "ok": true, "db": true }` or `503 { "ok": false, "db": false }`. `Cache-Control: no-store`. No rate limit.

### 10.6 `POST /api/unsubscribe?token=…`

RFC 8058 one-click target referenced by the email's `List-Unsubscribe` header. Verify token (§11.3) → set `unsubscribed_at = now()` if null → `200`. Invalid token → `400`.

### 10.7 Rate limiter — `lib/rate-limit.ts`

```ts
export function rateLimit(bucket: string, ip: string, max: number, windowMs: number):
  { ok: true } | { ok: false; retryAfterSec: number }
```

`Map<string, number[]>` on `globalThis`, key `${bucket}:${ip}`. On each call: drop timestamps older than the window, check length, push now. When the map exceeds 10,000 keys, sweep empty/expired entries. Single instance, so in-memory is correct; state resets on deploy and that is fine.

---

## 11. Tokens and cookies — `lib/tokens.ts`

All signatures: `HMAC-SHA256(COOKIE_SECRET, payload)` → base64url. Compare with `crypto.timingSafeEqual`. One generic pair — `sign(kind, parts[])` / `verify(kind, token, maxAgeSec?)` — serves all three uses; `kind` is part of the signed payload so tokens cannot be replayed across purposes.

| Use | Format | Lifetime | Cookie attributes |
|---|---|---|---|
| 11.1 Library unlock — cookie `cst_lib` | `lib.<leadId>.<iat>.<sig>` | 90 days | `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=7776000` |
| 11.2 Admin session — cookie `cst_admin` | `admin.<iat>.<sig>` | 7 days | `HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=604800` |
| 11.3 Unsubscribe — URL token | `unsub.<leadId>.<sig>` | never expires | n/a |

- `Secure` is set when `NODE_ENV === 'production'`.
- Unlocking is stateless: a valid signature + unexpired `iat` = unlocked. No DB lookup. Unsubscribing does not re-lock the library.
- The email's library link is `${SITE_URL}/library/unlock?token=<lib token>`. That route handler verifies the token, sets `cst_lib`, and redirects to `/library` — so the link unlocks on any device. (Cookies can only be set in route handlers and server actions, never during page render.)

---

## 12. Library page (`/library`)

Server component, `force-dynamic`.

1. `unlocked = verify('lib', cookies.get('cst_lib'))`.
2. Query active phrases ordered by id.
3. **Locked:** send full content for the first 10 by id only. For all others send **only** `{ slug, title: triggers[0], category, risk }`. The locked body text shown under the blur is hard-coded dummy text. **Never ship locked content to the browser and hide it with CSS** — it would be readable in view-source.
4. **Unlocked:** send everything.

Layout:

- `<h1>` "The Client-Speak Library" + one-line intro + search input.
- **Locked view:** section "Free sample" (the 10 full entries), then the eight category sections with locked rows (title + risk badge visible, blurred dummy body, `aria-hidden` on the dummy text). A wall card containing `<EmailForm source="library" layout="stacked"/>` sits at the top of the locked area (`position: sticky`). On success → `router.refresh()`; the server re-renders unlocked.
- **Unlocked view:** the eight category sections in the §9.1 order, each with a count.
- Each entry is a native `<details id={slug}>`: `<summary>` shows `triggers[0]` + risk badge; the body shows other triggers ("Also sounds like: …"), meaning, question, reply with a Copy button.
- Search is a plain case-insensitive substring filter over triggers + keywords + meaning (titles only for locked rows). No Fuse on the client. Empty state: "Nothing matches that — try the translator instead →".

This page scrolls normally and has standard metadata; it is in the sitemap.

---

## 13. Email — `lib/mailer.ts`

- `isMailConfigured()` = all of `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` are set. If not, everything else in the app behaves identically and the UI still shows success (acceptance #6).
- Transport created lazily, cached on `globalThis`; `secure: port === 465`.
- `sendLibraryEmail({ leadId, email })` never throws; it logs failures.

One plain-text email, no HTML, no sequence:

```
Subject: Your Client-Speak library link

Here's your link to the full library of decoded client phrases:

{SITE_URL}/library/unlock?token={libToken}

It works on any device and stays unlocked for 90 days.

— {COMPANY_NAME}

You're getting this because you asked for the library at {SITE_HOST}.
Unsubscribe: {SITE_URL}/unsubscribe?token={unsubToken}
```

Headers: `List-Unsubscribe: <{SITE_URL}/api/unsubscribe?token=…>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`.

**`/unsubscribe` page:** GET renders "Unsubscribe {masked email}?" with a single button. The button is a server action that sets `unsubscribed_at`. A GET must never mutate — mail scanners prefetch links. Invalid token → a friendly "This link isn't valid" page. After success: "Done. You won't hear from us again."

---

## 14. Admin panel

### 14.1 Auth — `lib/admin-auth.ts`

- `checkPassword(input)`: SHA-256 both the input and `ADMIN_PASSWORD`, compare digests with `timingSafeEqual`. If `ADMIN_PASSWORD` is unset or shorter than 12 chars, login always fails and a warning is logged once.
- Login action: rate limit 5 / 15 min / IP → check → set `cst_admin` → redirect `/admin`. Wrong password: generic "Wrong password."
- `requireAdmin()`: verify the cookie; on failure `redirect('/admin/login')`.
- **Call `requireAdmin()` in: the `(protected)/layout.tsx`, every function in `admin/actions.ts`, and `leads/export/route.ts`.** Layouts do not re-run for server actions or route handlers; an action without its own check is publicly callable.
- Logout action clears the cookie.
- All `/admin` pages: `force-dynamic` and `robots: { index: false }`.

Tabs are real routes (server-rendered, plain forms + server actions). No client-side tab state.

### 14.2 Overview — `/admin`

- Stat tiles from `counters`: translations, unmatched %, leads, feedback ratio `up / (up + down)`.
- **Top 20 matched phrases, last 30 days:** `phrase_id, count(*)` joined to `phrases` (show the first trigger, category, count).
- **Top 20 unmatched inputs, last 30 days:** group by `lower(trim(input_text))` where `phrase_id is null`; show count + last seen. Each row has **"Add as phrase"** → `/admin/phrases?new=1&trigger=<text>`. This table is how the library grows.
- **Top 10 most down-voted phrases, last 30 days:** join `feedback → translations → phrases`, order by down-votes.

### 14.3 Phrases — `/admin/phrases`

- Filters via query string: `?q=` (substring over triggers/slug), `?category=`, `?active=`.
- "Add phrase" form at the top, pre-filled from `?trigger=` and `?suggestionId=`.
- Each row: first trigger, category, risk, active state, **Toggle active** button, and a `<details>` containing the edit form (inline edit with zero client JS).
- Form fields: triggers (textarea, one per line), keywords (comma-separated), category (select), risk (select), meaning, question, reply (textareas with live `maxLength` = the §9.2 caps), active.
- Every save runs `validatePhrase`; errors re-render the form with messages. On success: set `updated_at = now()`, call **`invalidatePhraseCache()`**, `revalidatePath('/admin/phrases')`. If `suggestionId` was present, mark that suggestion `added`.

### 14.4 Suggestions — `/admin/suggestions`

List, default filter `status = 'new'`, newest first: text, email (if any), date. Actions: **Add as phrase** (link to the pre-filled phrase form) and **Reject** (sets `status='rejected'`).

### 14.5 Leads — `/admin/leads`

- Table: email, source, consent_at, created_at, unsubscribed_at. `?q=` email substring search. 100 per page.
- Toggle "Include unsubscribed" (`?all=1`), off by default.
- **Export CSV** → `GET /admin/leads/export[?all=1]` → `text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="leads-YYYY-MM-DD.csv"`. Columns: `email,source,consent_at,created_at`. Quote every field, double internal quotes, and prefix any cell beginning with `= + - @` with `'` (spreadsheet formula injection).

---

## 15. Legal pages, SEO, security headers

### 15.1 `/terms` and `/privacy`

Static, scrollable, readable (max-width ~70ch). Top of each file:

```tsx
{/* LEGAL-REVIEW: first draft generated by engineering. Must be reviewed by a human/lawyer before launch. */}
```

Include a "Last updated" date. The pages must state, accurately:

1. **Cookies:** none, except two strictly functional ones — the library-unlock cookie and the admin session cookie. The site also uses browser storage (session/local) to remember an anonymous session id, the translation count, and whether the email bar was dismissed. No tracking, no analytics scripts.
2. **Phrases you paste are stored** to improve the library and may be read by a human. Do not paste confidential or personal information. Stored without IP address or account; deleted after 12 months.
3. **Emails** are used only to send the library link and occasional product updates from {COMPANY_NAME}. Every email has an unsubscribe link. With the email we store the consent time, a one-way hashed IP address, and the browser user-agent, solely for abuse prevention.
4. **Sharing:** no data is sold. Data is processed only by our hosting provider and our email delivery provider. (The brief said "email provider only" — the hosting provider must be named too, or the statement is false.)
5. **No server access logs** are kept by the web server. (Keep this true: do not add a `log` directive to the Caddyfile.)
6. **Not advice:** the tool gives general communication suggestions, not legal, contractual, or financial advice.
7. How to request access/deletion: contact address (owner to supply, §21).

Terms additionally: provided as-is, no warranty, acceptable use (no automated scraping of the library), content ownership, governing law placeholder.

### 15.2 SEO

- Root metadata: `metadataBase: new URL(SITE_URL)`; title "Client-Speak Translator – decode vague web design feedback"; description "Paste what the client said. Get what they meant, what to ask back, and a reply you can send — free, instant, no sign-up."; `openGraph.images: ['/og']`; `twitter.card: 'summary_large_image'`.
- `/og`: `ImageResponse` 1200×630, off-white background, app name, the sample phrase "Can you make it pop?" in the display font (load the `.ttf` with `readFile`), a Medium risk badge. Cache for a day.
- `app/robots.ts`: allow `/`; disallow `/admin` and `/api`; link the sitemap.
- `app/sitemap.ts`: `/`, `/library`, `/terms`, `/privacy`.
- Semantic HTML, one `h1` per page.

### 15.3 Security headers — `next.config.ts` `headers()`

Applied to all routes:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

(`data:`/`blob:` are required by html-to-image. A nonce-based CSP would force every page dynamic; not worth it here.) HSTS is set in the Caddyfile.

---

## 16. Deployment

### 16.1 `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
ARG SITE_URL
ARG PAID_APP_URL
ARG COMPANY_NAME
ENV SITE_URL=$SITE_URL PAID_APP_URL=$PAID_APP_URL COMPANY_NAME=$COMPANY_NAME NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

`HOSTNAME=0.0.0.0` is mandatory: Docker sets `HOSTNAME` to the container id and the standalone server would bind to that and be unreachable from Caddy.

### 16.2 `docker-compose.yml`

```yaml
x-logging: &logging
  driver: json-file
  options: { max-size: "10m", max-file: "3" }

x-build: &build
  context: .
  args:
    SITE_URL: ${SITE_URL}
    PAID_APP_URL: ${PAID_APP_URL}
    COMPANY_NAME: ${COMPANY_NAME}

services:
  app:
    build: *build
    env_file: .env
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    expose: ["3000"]                 # never `ports:` — the app must only be reachable through Caddy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    logging: *logging

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: cst
      POSTGRES_DB: cst
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cst -d cst"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging: *logging

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443", "443:443/udp"]
    environment:
      DOMAIN: ${DOMAIN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on: [app]
    logging: *logging

  tools:                              # migrations + seed; has full node_modules and source
    profiles: ["tools"]
    build:
      <<: *build
      target: builder
    env_file: .env
    depends_on:
      db: { condition: service_healthy }

volumes:
  pgdata:
  caddy_data:
  caddy_config:
```

`docker-compose.dev.yml` (local only) adds `ports: ["127.0.0.1:5432:5432"]` to `db`. Local workflow: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db`, then `npm run dev` with `.env.local` pointing at `localhost`.

### 16.3 `Caddyfile`

```
{$DOMAIN} {
	encode zstd gzip
	reverse_proxy app:3000
	header {
		Strict-Transport-Security "max-age=31536000; includeSubDomains"
		-Server
	}
}
```

No `log` directive (privacy policy §15.1 item 5).

### 16.4 `.env.example`

```
# --- Site (also used as Docker build args: changing these needs `docker compose build app`)
SITE_URL=https://clientspeak.example
DOMAIN=clientspeak.example
PAID_APP_URL=https://yourapp.example
COMPANY_NAME=Your Company

# --- Database
POSTGRES_PASSWORD=            # openssl rand -hex 24   (hex only: it is embedded in the URL below)
DATABASE_URL=postgres://cst:REPLACE_WITH_POSTGRES_PASSWORD@db:5432/cst

# --- Secrets
ADMIN_PASSWORD=               # min 12 chars
COOKIE_SECRET=                # openssl rand -hex 32
IP_HASH_SECRET=               # openssl rand -hex 32

# --- SMTP (optional: leave blank to disable sending; leads are still stored)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Client-Speak Translator <hello@clientspeak.example>"
```

`lib/env.ts` requires in production: `DATABASE_URL`, `COOKIE_SECRET` (≥ 32 chars), `IP_HASH_SECRET` (≥ 32 chars), `SITE_URL`. It validates lazily on first call, never at import.

### 16.5 `deploy.md` — must contain these exact steps

1. Create droplet: Ubuntu 24.04, 1 GB / 1 vCPU, SSH key auth.
2. **Add 2 GB swap** (`fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`, plus the `/etc/fstab` line). `next build` can run out of memory on 1 GB without it.
3. Firewall: `ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw enable`.
4. Install Docker Engine + compose plugin from Docker's official apt repository.
5. Point the DNS A record for `DOMAIN` at the droplet **before** first start (Caddy needs it to obtain the certificate).
6. `git clone https://github.com/Murkette/dev-logic.git /opt/cst && cd /opt/cst`
7. `cp .env.example .env` and fill every value.
8. `docker compose build`
9. `docker compose up -d db`
10. `docker compose run --rm tools npm run db:migrate`
11. `docker compose run --rm tools npm run db:seed` → confirm the printed category counts.
12. `docker compose up -d`
13. Verify: `curl -s https://$DOMAIN/api/health` → `{"ok":true,"db":true}`.
14. Install the backup cron (16.6). Point an external uptime monitor at `/api/health`.

**Redeploy:** `git pull && docker compose build && docker compose run --rm tools npm run db:migrate && docker compose up -d`

**Restore:** `docker compose exec -T db pg_restore -U cst -d cst --clean --if-exists < /var/backups/cst/<file>.dump`

### 16.6 `scripts/backup.sh`

```sh
#!/bin/sh
set -eu
cd /opt/cst
DIR=/var/backups/cst
mkdir -p "$DIR"
TMP="$DIR/.inprogress.dump"
docker compose exec -T db pg_dump -U cst -Fc cst > "$TMP"
mv "$TMP" "$DIR/cst-$(date +%F).dump"
ls -1t "$DIR"/cst-*.dump | tail -n +15 | xargs -r rm --
docker compose exec -T db psql -U cst -d cst -c \
  "delete from translations where created_at < now() - interval '12 months'"
```

Cron (root): `15 3 * * * /opt/cst/scripts/backup.sh >> /var/log/cst-backup.log 2>&1`

The dump is written to a temp file first so a failed `pg_dump` never leaves an empty file that counts toward the 14.

---

## 17. Performance (Lighthouse ≥ 95)

- Homepage is static HTML + one client component. No client-side data fetching on load.
- `html-to-image` is dynamically imported on click only. Fuse.js must never appear in a client bundle — check with the build output.
- One self-hosted font file, preloaded by `next/font`; body text uses system fonts.
- No images on the homepage. Favicon is an SVG.
- Reserve layout so nothing shifts on load (the rotating placeholder must not change the textarea's height).
- Run Lighthouse against the **production build** (`npm run build && npm start`, or the droplet), mobile and desktop profiles.

---

## 18. Order of work

One PR per milestone into `main`. Commit at the end of each. Do not start a milestone until the previous one's "done when" is true.

**M0 — Repo, Docker, database, migrations**
Scaffold Next.js + TS + Tailwind v4; `next.config.ts` (standalone + headers); `lib/env.ts`, `lib/db.ts`, `db/schema.ts`, `drizzle.config.ts`; first migration; `Dockerfile`, both compose files, `Caddyfile`, `.env.example`, `.gitignore`, `.dockerignore`; `/api/health`.
*Done when:* `docker compose up -d` locally serves a placeholder homepage; `docker compose run --rm tools npm run db:migrate` creates all six tables; `/api/health` returns `{ok:true, db:true}`; `npm run typecheck` and `npm run lint` pass.
*Commit:* `chore: scaffold app, docker, schema, migrations`

**M1 — Engine and seed data**
`lib/engine/*`, `lib/phrase-validate.ts`, all eight seed files (120+ entries), `db/seed/index.ts`, `db/seed/validate.ts`, `lib/rate-limit.ts`, `lib/ip.ts`, `lib/counters.ts`, `/api/translate`, all engine tests.
*Done when:* `npm run seed:check` passes and prints counts (paste into the PR); `npm test` passes with the §19 targets; `curl -X POST /api/translate` with "make it pop" returns the pop entry, Medium risk.
*Commit:* `feat: translation engine, phrase library seed, translate API`

**M2 — Homepage UI**
`globals.css` tokens, fonts, header/footer, `Translator`, `ResultCard`, `RiskBadge`, `ShareCard`, `SuggestForm`, `/api/feedback`, `/api/suggest`, client storage/session helpers.
*Done when:* acceptance #1–#4 pass by hand at 1440×900 and 1280×720, in light and dark mode, with the longest seeded entry.
*Commit:* `feat: translator UI, share image, feedback, suggestions`

**M3 — Lead capture and library**
`lib/tokens.ts`, `lib/mailer.ts`, `EmailForm`, `EmailBar`, `/api/lead`, `/library`, `/library/unlock`, `/unsubscribe`, `/api/unsubscribe`, token tests.
*Done when:* acceptance #5–#7 pass; with SMTP configured against a test inbox the email arrives and its link unlocks the library in a fresh browser; view-source on the locked library contains no locked content.
*Commit:* `feat: lead capture, library gate, unsubscribe`

**M4 — Admin**
`lib/admin-auth.ts`, login, the four tabs, actions, CSV export.
*Done when:* acceptance #8 passes; editing a phrase in admin changes the very next `/api/translate` response (proves cache invalidation across module graphs); calling a server action without the cookie redirects to login.
*Commit:* `feat: admin panel`

**M5 — Legal, SEO, polish**
`/terms`, `/privacy`, metadata, `/og`, `robots.ts`, `sitemap.ts`, Lighthouse fixes, accessibility pass.
*Done when:* acceptance #10 passes; OG image renders in a social card validator.
*Commit:* `feat: legal pages, SEO, OG image`

**M6 — Production deploy**
`deploy.md`, `scripts/backup.sh`, real droplet deploy.
*Done when:* acceptance #9 and #11 pass on the droplet; a backup file exists and a test restore into a scratch database succeeds.
*Commit:* `docs: deployment guide and backup script`

---

## 19. Testing

Run with `npm test` (`tsx --test`). No test framework.

| File | Covers |
|---|---|
| `tests/normalise.test.ts` | Apostrophes, punctuation, fillers (multi-word first), unicode quotes, empty-after-normalise. |
| `tests/match.test.ts` | Builds the engine from the seed files (no DB) and runs `tests/match.cases.ts`. Also asserts the 100ms worst-case timing. |
| `tests/tokens.test.ts` | Round-trip, tampered signature, expired `iat`, cross-kind replay (a `lib` token must not verify as `admin`). |
| `tests/phrase-validate.test.ts` | Each rule in §9.2 rejects what it should. |

**`tests/match.cases.ts` — the tuning harness.** At least 80 labelled cases:

- ≥ 40 **paraphrases** (not verbatim triggers) → expected slug. E.g. "could you give the homepage a bit more punch" → `make-it-pop`; "my husband isn't keen on the green" → the spouse/colour committee entry.
- ≥ 10 **long inputs** (a 3–4 sentence client email containing one recognisable ask) → expected slug.
- ≥ 20 **negatives** that must return no-match: keyboard gibberish, a lorem ipsum sentence, unrelated sentences ("what time does the bakery open"), a single word ("logo"), only fillers ("um, like, maybe").
- The brief's literal checks: "make it pop" → `make-it-pop` at confidence 1.

**Targets that gate M1:** 100% of negatives return no-match (a wrong confident answer is worse than "unknown"); ≥ 90% of positives return the expected slug. Tune `FUSE_THRESHOLD` and the keyword minimum until both hold — if false positives appear, lower the threshold before touching anything else. Record the final values in the PR.

M1 shipped with `FUSE_THRESHOLD = 0.3` and `KEYWORD_MIN_HITS = 2`, 100% of negatives passing and 100% of the 57 positive paraphrase/long-input cases passing (comfortably above the 90% gate) — see §8.2's note on why the engine's actual search strategy (single whole-string Fuse query, keyword-vote before fuzzy) differs from the sliding-window design originally planned here.

Everything outside the engine and tokens is verified by the manual checklist in §20.

---

## 20. Acceptance criteria and how to verify each

| # | Criterion | How to verify |
|---|---|---|
| 1 | No scrollbar on the homepage at 1440×900 and 1280×720, before and after a result | Browser devtools responsive mode at both sizes; test idle, result (use the longest seeded entry), no-match with the suggest form open, and with the email bar visible. `document.documentElement.scrollHeight === innerHeight`. |
| 2 | "make it pop" + Enter → the pop entry, Medium risk; server responds in < 500ms; the 400ms reveal delay is a minimum, not an addition | Network tab timing on `/api/translate`. |
| 3 | Gibberish → no-match state with a working suggestion form | Submit "asdf qwer zxcv"; send a suggestion; confirm the row in admin → Suggestions. |
| 4 | Share as image downloads a presentable 1200×675 PNG | Check the file's dimensions on a retina display specifically. Confirm fonts rendered and the reply text is absent. |
| 5 | Email bar appears after the second matched translation; dismissal survives reload | Also confirm it stays hidden with localStorage blocked (no crash). |
| 6 | Valid email → lead stored, `/library` unlocked, email sent if SMTP configured, silent skip if not | Test both configurations. Submit the same email twice → still one row. |
| 7 | Honeypot filled → 200, nothing stored | `curl` with `"website":"x"`; check `leads` count unchanged and no `Set-Cookie`. |
| 8 | `/admin` needs the password, shows unmatched inputs, exports CSV | Also: open the CSV in a spreadsheet; confirm unsubscribed leads are excluded by default. |
| 9 | `docker compose up -d` on a fresh Ubuntu 24.04 droplet brings the site up on HTTPS | Follow `deploy.md` literally on a new droplet — no undocumented steps allowed. |
| 10 | Lighthouse ≥ 95 Performance, Accessibility, Best Practices on the homepage | Production build, mobile + desktop. |
| 11 | Zero paid third-party services required | With SMTP blank, every feature except the email itself works. |

---

## 21. Open questions for the product owner

None of these block M0–M2. Placeholders live in `.env.example` and `lib/site.ts`.

| # | Needed | Blocks | Placeholder used |
|---|---|---|---|
| Q1 | Company name for the footer and emails | M2 polish | "Your Company" |
| Q2 | Paid app URL; confirm the UTM values in §7.4 | M2 polish | `https://yourapp.example` |
| Q3 | Production domain | M6 | `clientspeak.example` |
| Q4 | SMTP provider + `MAIL_FROM` address (needs SPF/DKIM on that domain) | M3 email test | sending disabled |
| Q5 | Legal entity name, contact email for privacy requests, governing-law jurisdiction | M5 / launch | bracketed placeholders in the legal pages |
| Q6 | Ship with "120+" in the bar copy, or write 150 entries before launch? (D12) | launch | "120+" |
| Q7 | Approve the deviations in §2 — especially D1, D2, D3, D10 | M0 schema | as specified |
| Q8 | Who reviews the 120 seed entries for tone before the first deploy? | M1 sign-off | — |

---

## 22. Working agreement

- Follow the milestone order in §18. Commit after each stage.
- **Ask before adding any dependency not listed in §3.**
- When the seed data is written, print the category counts and put them in the PR so the owner can confirm coverage.
- If a requirement here conflicts with an acceptance criterion in §20, the acceptance criterion wins — flag the conflict in the PR.
- Secrets never enter git. `.env` is ignored; only `.env.example` is committed.
