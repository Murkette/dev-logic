import type { SeedPhrase } from './types';

export const money: SeedPhrase[] = [
  {
    slug: 'diy-builder-is-free',
    triggers: [
      'wix is free why is this so expensive', 'squarespace is free why is this 4000',
      'why pay you when i could use a free builder', 'the free website builder does the same thing',
    ],
    keywords: ['wix', 'squarespace', 'free', 'diy', 'cheap'],
    category: 'money',
    meaning:
      "They're not attacking the price; they don't yet know what it's paying for. The free tool and a designer's time solve different problems.",
    question: 'Would it help if I broke down what’s included and what a DIY build would cost you in time?',
    reply:
      "Fair question. The tools are free; the strategy, design, and support are what you're paying for. I'll send a breakdown so you can see exactly where the number comes from.",
    risk: 'medium',
  },
  {
    slug: 'more-than-i-expected',
    triggers: [
      "that's more than i expected", "i wasn't expecting it to cost this much",
      'this is higher than i thought', 'the price is more than i budgeted',
    ],
    keywords: ['expensive', 'budget', 'expected', 'cost', 'price'],
    category: 'money',
    meaning:
      "The number surprised them, which usually means the scope wasn't fully clear before the quote landed. It's worth checking whether it's the total or a specific line item that's the issue.",
    question: "Is it the total that's the surprise, or one specific part of the quote?",
    reply:
      "That's useful to know before we go further. Is it the total, or one part in particular? I can walk through what drives the cost, and we can look at trimming scope if the budget is fixed.",
    risk: 'medium',
  },
  {
    slug: 'can-you-do-it-cheaper',
    triggers: [
      'can you do it cheaper', 'is there a cheaper option',
      'can we get a lower price', 'any way to bring the cost down',
    ],
    keywords: ['cheaper', 'discount', 'lower', 'price', 'cost'],
    category: 'money',
    meaning:
      "They like the work but the number doesn't fit right now. The honest lever is usually less scope, not the same project for less money.",
    question: 'Is there a part of the scope we could trim to fit your budget?',
    reply:
      "I hear you on budget. The rate reflects what the full scope takes, but we can trim a page or feature to bring the number down instead of cutting corners on what stays.",
    risk: 'medium',
  },
  {
    slug: 'nephew-can-do-it-cheaper',
    triggers: [
      'my nephew can do it for 500', 'my cousin says he can build it cheaper',
      'a friend of mine could do this for less', 'someone offered to do it way cheaper',
    ],
    keywords: ['cheaper', 'nephew', 'cousin', 'friend', 'diy'],
    category: 'money',
    meaning:
      "They're weighing price against price without yet weighing it against outcome or reliability. This is worth answering calmly rather than defensively.",
    question: 'What would make you comfortable that this option covers what theirs doesn’t?',
    reply:
      "That might be a great option for what you need. If you'd like, I can walk through what's included in my process so you can compare the two fairly, not just on price.",
    risk: 'medium',
  },
  {
    slug: 'pay-when-its-finished',
    triggers: [
      "can we pay when it's finished", "can we pay entirely at the end",
      "i'd rather pay once it's done", 'can payment wait until launch',
    ],
    keywords: ['payment', 'finished', 'deferred', 'end', 'delayed'],
    category: 'money',
    meaning:
      "They want assurance the work will be worth paying for before money changes hands. This is the same trust concern a deposit and milestones are designed to solve.",
    question: 'Would milestone payments tied to specific deliverables feel fair instead?',
    reply:
      "Understandable instinct. I split payment across milestones instead of one lump sum at the end, so you're only ever paying for work you've already seen. Full payment upfront at the close isn't something I can offer.",
    risk: 'medium',
  },
  {
    slug: 'send-you-referrals',
    triggers: [
      "we'll send you lots of referrals", 'this could lead to a lot more work for you',
      "think of all the exposure you'll get", "we know a lot of people who'll hire you too",
    ],
    keywords: ['referrals', 'exposure', 'future', 'morework', 'leads'],
    category: 'money',
    meaning:
      "Future work is being offered in place of payment for the work in front of you now. It might be genuine, but it isn't cash, and it isn't guaranteed.",
    question: 'Would you be open to a smaller discount tied to referrals that actually come through?',
    reply:
      "I appreciate that, and I'd genuinely love the referrals. For this project though, I still need to price it on its own terms — happy to build in a discount for any work that actually comes from it.",
    risk: 'high',
  },
  {
    slug: 'discount-because-more-work-later',
    triggers: [
      "there's more work coming later so discount this", "there'll be more projects down the line",
      'this is just the first of many projects', "discount it since we'll work together again",
    ],
    keywords: ['discount', 'futurework', 'laterwork', 'pipeline', 'morework'],
    category: 'money',
    meaning:
      "Future projects are being used as leverage on the price of the current one. It's a fair thing to offer, but it works better as a plan for the next quote than a discount on this one.",
    question: 'Would you like me to put together a rate for future phases once we see how this one goes?',
    reply:
      "I like the sound of more work together. Let's price this project on its own, and once we've worked together I'm glad to talk about a better rate for what comes next.",
    risk: 'medium',
  },
  {
    slug: 'pay-in-instalments',
    triggers: [
      'can we pay in instalments', 'can we split this into payments',
      'can we do a payment plan', 'is there an instalment option',
    ],
    keywords: ['instalments', 'paymentplan', 'split', 'monthly', 'installments'],
    category: 'money',
    meaning:
      "They want the total spread out rather than reduced, a completely reasonable cash-flow request. This is usually simple to accommodate without changing the total price.",
    question: 'Would splitting it across the project milestones work for you?',
    reply:
      "That's easy to set up. I can split the total across the project milestones instead of the usual deposit and final payment. I'll send an updated schedule so it's clear what's due and when.",
    risk: 'low',
  },
  {
    slug: 'whats-your-hourly-rate',
    triggers: [
      "what's your hourly rate", 'how much do you charge per hour',
      'can you just bill me hourly', 'what do you charge an hour',
    ],
    keywords: ['hourly', 'rate', 'perhour', 'billing', 'price'],
    category: 'money',
    meaning:
      "They're trying to compare your price to a number they already understand. A flat project rate usually protects them more than hourly billing would.",
    question: 'Would it help more to see the flat project price broken into what it covers?',
    reply:
      "I price by project rather than by the hour, so you know the total upfront regardless of how long something takes me. I'm happy to break down what that price covers if it helps the comparison.",
    risk: 'low',
  },
  {
    slug: 'why-monthly-hosting-fee',
    triggers: [
      'why do i pay monthly for hosting', 'why is there a monthly maintenance fee',
      'what am i paying monthly for exactly', 'why do i need ongoing maintenance payments',
    ],
    keywords: ['hosting', 'maintenance', 'monthly', 'recurring', 'fee'],
    category: 'money',
    meaning:
      "The build price and the running cost of keeping a site online, secure, and updated feel like they should be the same thing, but they aren't. This usually just needs a plain explanation.",
    question: 'Would a simple one-page breakdown of what the monthly fee covers help?',
    reply:
      "Totally fair to ask. The monthly fee covers hosting, security updates, and backups, none of which are one-time costs. I'll send a plain breakdown so you can see what keeps running behind the scenes.",
    risk: 'medium',
  },
  {
    slug: 'drop-something-to-save-money',
    triggers: [
      'can we drop something to save money', 'what can we cut to lower the price',
      'can we remove a feature to save cost', 'what should we cut from the budget',
    ],
    keywords: ['cut', 'trim', 'budget', 'remove', 'savemoney'],
    category: 'money',
    meaning:
      "This is actually the healthiest version of a budget conversation, since they're offering to adjust scope instead of asking for the same thing for less. It just needs a clear list to choose from.",
    question: 'Should we prioritise by what matters most at launch, or by what costs the most to build?',
    reply:
      "Glad to work through that together. I'll put together a short list of what could come out and what it saves, so you can decide based on real numbers instead of a guess.",
    risk: 'low',
  },
  {
    slug: 'pay-invoice-next-week-again',
    triggers: [
      "i'll pay the invoice next week", "sorry i'll get that invoice paid soon",
      'payment is coming i promise', "i'll send payment in a few days",
    ],
    keywords: ['invoice', 'late', 'overdue', 'payment', 'delay'],
    category: 'money',
    meaning:
      "A payment has slipped past its due date, possibly more than once. This needs a clear, calm boundary rather than quiet frustration that builds up over time.",
    question: 'Can we agree on a specific date this week that works for you?',
    reply:
      "No worries, these things happen. Could we agree on a specific date this week? Work on the next milestone pauses until the current invoice clears, so a firm date helps both of us plan around it.",
    risk: 'medium',
  },
  {
    slug: 'can-i-get-a-refund',
    triggers: [
      'can i get a refund', 'i want my money back',
      'can we cancel and get refunded', "i'd like a refund for this project",
    ],
    keywords: ['refund', 'moneyback', 'cancel', 'reimburse', 'return'],
    category: 'money',
    meaning:
      "Something has gone wrong enough that they want out entirely, not just a fix. It's worth understanding the real complaint before talking about money at all.",
    question: "Can you tell me specifically what's fallen short so I understand what happened?",
    reply:
      "I want to understand what happened before anything else. Can you tell me specifically what's fallen short? Depending on where we are in the project, a refund, a fix, or a mix of both might be the right path.",
    risk: 'high',
  },
  {
    slug: 'do-you-charge-for-calls',
    triggers: [
      'do you charge for calls', 'is a phone call billable',
      'do check in calls cost extra', 'will you bill me for this meeting',
    ],
    keywords: ['calls', 'meetings', 'billable', 'time', 'charge'],
    category: 'money',
    meaning:
      "They want to know if picking up the phone starts a meter running. Being upfront about this early avoids awkwardness on every call afterward.",
    question: "Would it help if I explained which calls are included and which aren't?",
    reply:
      "Good to clarify upfront. Regular project check-ins are included in the scope; longer strategy sessions outside that are billed separately, and I'll always flag it before one starts.",
    risk: 'low',
  },
  {
    slug: 'friends-or-nonprofit-discount',
    triggers: [
      'do you do a friends discount', 'is there a nonprofit discount',
      'can you give us a family rate', 'do you offer discounts for nonprofits',
    ],
    keywords: ['discount', 'nonprofit', 'friends', 'family', 'rate'],
    category: 'money',
    meaning:
      "They're asking honestly rather than assuming, which is worth respecting either way you answer. A clear, consistent policy is easier to hold than a one-off exception.",
    question: 'Is this for personal use, or is there a nonprofit or cause behind it?',
    reply:
      "Appreciate you asking directly. I keep a consistent nonprofit rate I can apply if that's the case here; for personal or friend projects, I try to keep the scope lean instead of discounting the rate itself.",
    risk: 'low',
  },
  {
    slug: 'just-give-me-a-ballpark',
    triggers: [
      'just give me a ballpark', "what's a rough estimate",
      'just a rough number for now', 'ballpark it for me real quick',
    ],
    keywords: ['ballpark', 'estimate', 'roughnumber', 'quote', 'guess'],
    category: 'money',
    meaning:
      "They want a number before committing to a real conversation, which is fair. A ballpark without scope tends to become the number they remember and hold you to later.",
    question: "Can you tell me roughly what pages and features you're picturing?",
    reply:
      "Happy to give you a range. Roughly, what pages and features are you picturing? I'll give a real ballpark based on that, with the caveat that the firm number comes after we scope it properly.",
    risk: 'medium',
  },
];
