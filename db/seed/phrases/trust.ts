import type { SeedPhrase } from './types';

export const trust: SeedPhrase[] = [
  {
    slug: 'see-it-before-deposit',
    triggers: [
      'can i see it before paying the deposit', 'can i see a mockup before i pay',
      'show me something before the deposit', 'i want to see work before paying',
    ],
    keywords: ['deposit', 'upfront', 'payment', 'mockup', 'trust'],
    category: 'trust',
    meaning:
      "They've likely been asked to pay upfront before without seeing anything, and don't want to repeat that. It's a trust question, not a negotiation tactic.",
    question: 'Would a short call walking through my process and past work put you at ease?',
    reply:
      "Totally fair to ask. The deposit secures the time on my calendar rather than paying for a finished design. I'm happy to walk you through past projects and how the process works before you commit.",
    risk: 'medium',
  },
  {
    slug: 'designer-disappeared',
    triggers: [
      'my last designer disappeared', 'my previous designer went silent',
      'the last person i hired vanished', 'my old designer stopped replying',
    ],
    keywords: ['disappeared', 'ghosted', 'unreliable', 'previous', 'vanished'],
    category: 'trust',
    meaning:
      "A past bad experience is shaping how closely they'll watch this project. Consistent, visible communication will matter more to them than usual.",
    question: 'Would a short weekly update, even a one-line one, help you feel secure this time?',
    reply:
      "Sorry that happened — that's a rough way to lose money and time. I send a short update every week regardless of how much progress there is, so you're never left guessing where things stand.",
    risk: 'low',
  },
  {
    slug: 'just-send-me-the-files',
    triggers: [
      'can you just send me the files', 'just give me the source files',
      'can i get the raw files', 'send over all the design files',
    ],
    keywords: ['files', 'source', 'ownership', 'handoff', 'assets'],
    category: 'trust',
    meaning:
      "They want reassurance that they own the work and aren't locked in, more than the files themselves right now. This usually comes up when trust is still being built.",
    question: 'Is the concern about ownership, or do you need the files for something specific right now?',
    reply:
      "Understood — you'll get full files at handoff, as outlined in the contract. If it's ownership you're weighing, that's already covered; if you need something specific now, tell me what and I'll send it.",
    risk: 'medium',
  },
  {
    slug: 'who-owns-the-site',
    triggers: [
      "who owns the site when it's done", 'do i own the website after',
      'who has ownership of the final site', 'is the site mine once it’s built',
    ],
    keywords: ['ownership', 'owns', 'rights', 'license', 'handoff'],
    category: 'trust',
    meaning:
      "This is a legitimate and important question that should already have a clear answer in the contract. If they're asking, the terms may not have been explained clearly enough.",
    question: 'Have you had a chance to read the ownership section of the contract yet?',
    reply:
      "Great question to ask before we start. You own the final site, content, and design once it's paid in full — that's spelled out in the contract. Let me know if you'd like to walk through it together.",
    risk: 'low',
  },
  {
    slug: 'admin-login',
    triggers: [
      'can i have the admin login', 'i want the admin password',
      'give me full admin access', 'can you share the admin login',
    ],
    keywords: ['admin', 'login', 'access', 'credentials', 'password'],
    category: 'trust',
    meaning:
      "They want a safety net in case something goes wrong or the relationship ends. That's reasonable, though full admin access before launch carries its own risks.",
    question: 'Would a documented handoff of credentials at launch cover what you need?',
    reply:
      "Makes sense to want that safety net. I'll hand over full admin access and documentation at launch so nothing is locked away from you. Until then I can add you as an editor if you'd like to follow along.",
    risk: 'medium',
  },
  {
    slug: 'do-we-need-a-contract',
    triggers: [
      'do we really need a contract', 'can we skip the contract',
      'is a contract necessary', "let's just do a handshake deal",
    ],
    keywords: ['contract', 'agreement', 'paperwork', 'handshake', 'legal'],
    category: 'trust',
    meaning:
      "They see the contract as friction rather than protection for both sides. It usually helps to frame it as something that protects them as much as it protects you.",
    question: "Is there a specific clause you're unsure about, or is it the paperwork itself?",
    reply:
      "I get wanting to move fast. The contract protects you as much as me — it sets the scope, timeline, and what happens if either of us needs to change something. Happy to walk through any part you're unsure about.",
    risk: 'medium',
  },
  {
    slug: 'will-this-get-me-customers',
    triggers: [
      'how do i know this will get me customers', 'will this actually bring in business',
      'will this website make me money', 'how will this get me clients',
    ],
    keywords: ['customers', 'results', 'roi', 'leads', 'business'],
    category: 'trust',
    meaning:
      "They're pricing the project against outcomes rather than deliverables, which a website alone can't fully guarantee. This is really a conversation about marketing, not just design.",
    question: 'What does a successful first three months look like to you in concrete numbers?',
    reply:
      "A great site removes friction; it can't force demand on its own. What would success look like in real numbers over the first three months? I'll design toward that goal and flag what else needs to support it.",
    risk: 'high',
  },
  {
    slug: 'guarantee-page-one-of-google',
    triggers: [
      'can you guarantee page one of google', 'will this rank first on google',
      'can you promise top of google search', 'guarantee number one on google',
    ],
    keywords: ['google', 'ranking', 'seo', 'guarantee', 'search'],
    category: 'trust',
    meaning:
      "No honest developer can guarantee a search ranking, since that's controlled by an algorithm no one sells access to. They likely conflate having a website with being found.",
    question: "Would it help if I explained what SEO work is included, and what's outside anyone's control?",
    reply:
      "No one can honestly guarantee a specific Google ranking — that would be a red flag from anyone who promises it. I build the site to solid SEO fundamentals and can point you to ongoing options if visibility is the real goal.",
    risk: 'medium',
  },
  {
    slug: 'quick-mockup-first',
    triggers: [
      'can you do a quick mockup first so we can decide', 'just a rough mockup before we commit',
      'can we see a sketch before signing', 'quick draft before we agree to anything',
    ],
    keywords: ['mockup', 'sketch', 'draft', 'preview', 'decide'],
    category: 'trust',
    meaning:
      "They want lower-stakes proof before committing fully, a reasonable instinct. The risk is that 'quick' work outside a signed scope rarely stays quick or free.",
    question: 'Would a small paid discovery phase work, with the mockup as its first deliverable?',
    reply:
      "That's a fair ask, and I have a way to do it: a small paid discovery phase that starts with a rough mockup. It keeps the risk low for both of us instead of me speculating for free.",
    risk: 'high',
  },
  {
    slug: 'been-burned-before',
    triggers: [
      "i've been burned before", 'i had a bad experience before',
      'we got burned last time', 'i was let down by a designer before',
    ],
    keywords: ['burned', 'badexperience', 'trust', 'wary', 'cautious'],
    category: 'trust',
    meaning:
      "Past disappointment is doing the talking here, not necessarily anything about this project. Extra visibility early on will go a long way toward rebuilding confidence.",
    question: "What happened last time that you'd want to make sure doesn't happen again?",
    reply:
      "Sorry to hear that — it colours how this feels even when the situation is different. What happened last time that you'd want to avoid repeating? I'll build the process around avoiding exactly that.",
    risk: 'medium',
  },
  {
    slug: 'talk-to-a-past-client',
    triggers: [
      'can i talk to a past client', 'do you have references i can call',
      'can i speak with a former client', 'can you connect me with a reference',
    ],
    keywords: ['reference', 'testimonial', 'pastclient', 'review', 'referral'],
    category: 'trust',
    meaning:
      'This is a completely reasonable request, and saying yes builds more trust than any pitch could. It signals confidence rather than a hidden weakness.',
    question: 'Would you prefer a written testimonial, a quick call, or both?',
    reply:
      'Happy to connect you. Would a written testimonial work, or would you rather hop on a short call with a past client directly? I’ll set that up either way.',
    risk: 'low',
  },
  {
    slug: 'domain-login',
    triggers: [
      'why do you need my domain login', 'why do you want access to my domain',
      'do you need my domain password', 'why access to the domain registrar',
    ],
    keywords: ['domain', 'registrar', 'dns', 'access', 'login'],
    category: 'trust',
    meaning:
      "They're understandably cautious about handing over something that controls their whole online identity. A clear explanation of exactly what access is needed usually resolves this fast.",
    question: 'Would it help if I explained exactly what I need to change and for how long?',
    reply:
      'Good instinct to ask before sharing that. I only need access to point the domain at the new site and set up email correctly, and I can walk you through doing it yourself instead if you’d rather keep it in hand.',
    risk: 'low',
  },
  {
    slug: 'are-you-outsourcing-this',
    triggers: [
      'are you going to outsource this', 'will someone else be doing the work',
      'is this getting outsourced overseas', 'are you subcontracting this project',
    ],
    keywords: ['outsource', 'subcontract', 'outside', 'handsoff', 'delegate'],
    category: 'trust',
    meaning:
      "They want to know who is actually accountable for the work they're paying for. This is really a question about accountability, not necessarily who types the code.",
    question: "Is the concern about who's accountable for the work, or specifically who does it?",
    reply:
      "Fair to want that clarity upfront. I'm accountable for everything delivered on this project, whether I do it myself or bring in specialist help for a specific piece. I'll always tell you when that happens.",
    risk: 'medium',
  },
  {
    slug: 'what-if-i-dont-like-it',
    triggers: [
      "what happens if i don't like it", 'what if i hate the final result',
      "what's the plan if i don't like it", "what if i'm not happy with it",
    ],
    keywords: ['dislike', 'unhappy', 'revisions', 'guarantee', 'unsatisfied'],
    category: 'trust',
    meaning:
      "They want to know the safety net before they commit, a fair thing to ask upfront. This is really a scoping question about revisions, not a hint that they expect to hate it.",
    question: 'Have you seen the number of revision rounds built into the contract?',
    reply:
      "Good question to settle now. The contract includes a set number of revision rounds for exactly this, and we check in at each milestone so nothing arrives as a surprise. Anything past that scope, we'd agree on separately.",
    risk: 'medium',
  },
];
