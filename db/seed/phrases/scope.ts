import type { SeedPhrase } from './types';

export const scope: SeedPhrase[] = [
  {
    slug: 'just-a-small-change',
    triggers: ['just a small change', "it's just a small change", 'one small tweak', 'just a quick tweak'],
    keywords: ['small', 'tweak', 'quick', 'minor', 'change'],
    category: 'scope',
    meaning:
      "Small to say, rarely small to do. It often touches a template, a component, or something already approved.",
    question: 'Can you describe exactly what should look different afterwards?',
    reply:
      "Sure thing. Can you tell me exactly what should look different when it's done? Some 'small' changes ripple into other pages, so I'll confirm whether it fits the current round or needs a quick add-on.",
    risk: 'high',
  },
  {
    slug: 'add-a-blog-shop-booking',
    triggers: [
      'can we add a blog too', 'can we add a shop too',
      'can we add a booking system too', "let's also add an online store",
    ],
    keywords: ['blog', 'shop', 'booking', 'ecommerce', 'addon'],
    category: 'scope',
    meaning:
      "The project just grew, and they're hoping the price didn't. This is a new feature, not a tweak to the current one.",
    question: 'Do you want that in this launch, or as a phase two after we go live?',
    reply:
      "That's a great addition. It's outside the current scope, so I'll send a short add-on quote and timeline. If you'd rather launch first and add it as phase two, that works too.",
    risk: 'high',
  },
  {
    slug: 'while-youre-in-there',
    triggers: [
      "while you're in there can you also", "since you're already in there",
      "while you're at it can you", 'as long as you’re working on it',
    ],
    keywords: ['also', 'meanwhile', 'extra', 'addon', 'while'],
    category: 'scope',
    meaning:
      "A second ask is riding in on the first one because it feels free by comparison. Each 'while you're in there' is its own task with its own time cost.",
    question: 'Should I treat this as part of the current task, or list it separately?',
    reply:
      "Happy to take a look. I'll treat this as a separate item so it's clear what's in the current round versus what's new, and nothing gets assumed to be free.",
    risk: 'medium',
  },
  {
    slug: 'can-you-just-quickly',
    triggers: [
      'can you just quickly', "it'll only take you a second",
      'can you quickly do this', "shouldn't take you long right",
    ],
    keywords: ['quickly', 'fast', 'second', 'minute', 'quick'],
    category: 'scope',
    meaning:
      "The word 'quickly' is doing the client's estimating for them, not yours. Some quick-sounding asks are genuinely fast; others touch shared components and aren't.",
    question: "Can you tell me exactly what you'd like changed, and I'll tell you how it fits?",
    reply:
      "Happy to look at it. Tell me exactly what you'd like changed and I'll let you know if it's a two-minute fix or something that needs its own slot.",
    risk: 'medium',
  },
  {
    slug: 'one-more-round-of-revisions',
    triggers: [
      'one more round of revisions', 'just one more revision round',
      'can we get another round', 'one more pass at this',
    ],
    keywords: ['revision', 'round', 'another', 'extra', 'morerounds'],
    category: 'scope',
    meaning:
      "The agreed number of revision rounds has likely been used up, and they may not realise it. This is a scope conversation disguised as a small ask.",
    question: 'Have we used up the revision rounds in the current agreement?',
    reply:
      "Let's check where we stand — we've used the rounds included in the current scope. I'm glad to add another for a small fee, or we can prioritise the most important changes within what's left.",
    risk: 'high',
  },
  {
    slug: 'can-you-write-the-copy-too',
    triggers: [
      'can you write the copy too', 'can you write the website text',
      'can you handle the copywriting too', 'could you just write the words',
    ],
    keywords: ['copy', 'copywriting', 'text', 'wording', 'content'],
    category: 'scope',
    meaning:
      "Copywriting is a distinct skill and time cost that's easy to assume comes bundled with design. They may not know it's usually billed separately.",
    question: 'Do you have a first draft I can polish, or should I write it from scratch?',
    reply:
      "Happy to help with that. Copywriting sits outside the current design scope, so I'll send a quick quote — it's cheaper if you have a rough draft I can refine rather than starting from nothing.",
    risk: 'high',
  },
  {
    slug: 'can-you-do-the-logo-too',
    triggers: [
      'can you do the logo as well', 'can you also design our logo',
      'could you make us a logo too', 'can you design a logo for us',
    ],
    keywords: ['logo', 'branding', 'identity', 'design', 'addon'],
    category: 'scope',
    meaning:
      "Logo design is a separate discipline from web design, though the two often get bundled in a client's mind. This is a new deliverable, not part of the site build.",
    question: 'Do you have an existing logo we’re refining, or are we starting from zero?',
    reply:
      "I can help with that. Logo design sits outside the site build, so I'll send a separate quote for it — let me know if there's an existing mark to refine or if we're starting fresh.",
    risk: 'high',
  },
  {
    slug: 'add-a-few-more-pages',
    triggers: [
      'can we add a few more pages', "let's add some extra pages",
      'can we include more pages', 'we need a couple more pages added',
    ],
    keywords: ['pages', 'extra', 'more', 'additional', 'sitemap'],
    category: 'scope',
    meaning:
      "The sitemap agreed at the start is growing, which affects both timeline and price. Each new page needs its own content, not just a template slot.",
    question: 'What are the new pages, and do you have content ready for them?',
    reply:
      "Happy to add them. Since it's beyond the pages we scoped, I'll send a short update to the quote and timeline once I know what they are and whether content's ready.",
    risk: 'high',
  },
  {
    slug: 'set-up-my-email-too',
    triggers: [
      'can you set up my email too', 'can you also set up our email',
      'could you configure our business email', 'can you get my email working too',
    ],
    keywords: ['email', 'setup', 'configure', 'inbox', 'addon'],
    category: 'scope',
    meaning:
      "Email setup is a quick task for someone who knows DNS, but it's still a separate task with its own small time cost. Clients often assume it comes with hosting.",
    question: 'Which email provider are you using, or do you need a recommendation?',
    reply:
      "Sure, that's a quick one to add on. Let me know your email provider, or I can recommend one, and I'll add a small line item to cover the setup time.",
    risk: 'medium',
  },
  {
    slug: 'do-our-social-graphics',
    triggers: [
      'can you do our social graphics', 'can you make our social media images',
      'could you design our instagram posts', 'can you handle our social media graphics',
    ],
    keywords: ['social', 'graphics', 'instagram', 'socialmedia', 'assets'],
    category: 'scope',
    meaning:
      "This is ongoing content work, not a one-time deliverable like the site. It can quietly turn into a recurring commitment if the scope isn't set upfront.",
    question: 'Is this a one-time set of templates, or ongoing monthly graphics?',
    reply:
      "Happy to help with that. Is this a one-off set of templates you can reuse, or ongoing monthly graphics? The pricing and setup look different depending on which one you need.",
    risk: 'medium',
  },
  {
    slug: 'should-only-take-five-minutes',
    triggers: [
      'it should only take you five minutes', 'this is like a two minute fix',
      "shouldn't take more than a few minutes", 'this is a five minute job right',
    ],
    keywords: ['minutes', 'quick', 'fast', 'estimate', 'time'],
    category: 'scope',
    meaning:
      "They're estimating your time from the outside, and it usually feels smaller than the real work, like testing or touching shared code. It's rarely malicious, just a guess.",
    question: "Can you send exactly what you'd like changed so I can give you a real estimate?",
    reply:
      "I hear you, and some changes really are that fast. Send me exactly what you'd like changed and I'll give you a real time estimate rather than guessing either way.",
    risk: 'medium',
  },
  {
    slug: 'i-thought-that-was-included',
    triggers: [
      'i thought that was included', 'i assumed this was part of it',
      "wasn't this already in the price", 'i figured that came with the package',
    ],
    keywords: ['included', 'assumed', 'scope', 'package', 'expected'],
    category: 'scope',
    meaning:
      "A gap has opened between what they assumed the price covered and what the proposal actually listed. This is best resolved by pointing back to the written scope, not memory.",
    question: 'Can we look at the proposal together to see what’s listed for this?',
    reply:
      "Let's clear this up together — I'll pull up the proposal so we're both looking at the same list. If it's genuinely missing from there, I take responsibility for not being clear enough upfront.",
    risk: 'high',
  },
  {
    slug: 'start-over-new-direction',
    triggers: [
      'can we start over in a new direction', "let's scrap this and start fresh",
      'can we go a completely different way', 'i want to start from scratch instead',
    ],
    keywords: ['restart', 'scrap', 'freshstart', 'pivot', 'redo'],
    category: 'scope',
    meaning:
      "This is a full pivot, not a revision, and it resets the work done so far. It usually signals the original direction was approved too early, before it was fully understood.",
    question: "What specifically isn't working about the current direction?",
    reply:
      "That's a bigger shift than a normal revision, and that's okay — I'd rather get it right. What specifically isn't landing? I'll scope the restart as its own phase so we're both clear on time and cost.",
    risk: 'high',
  },
  {
    slug: 'edit-everything-myself',
    triggers: [
      'i want to be able to edit everything myself', 'i need full control to edit the site',
      'can i update all the content myself', 'i want to be able to change anything',
    ],
    keywords: ['editable', 'cms', 'selfmanaged', 'control', 'updates'],
    category: 'scope',
    meaning:
      "They want independence after launch, a fair long-term goal. It shapes which platform and structure make sense, so it needs deciding early, not bolted on later.",
    question: 'Which parts do you expect to update yourself: text, images, or the layout too?',
    reply:
      "Good to flag now rather than after launch. Which parts do you expect to update yourself: just text and images, or the layout too? That decides which platform makes sense and whether training is worth including.",
    risk: 'medium',
  },
  {
    slug: 'add-a-popup-or-widget',
    triggers: [
      'can you add a popup', 'can we add a chat widget',
      "let's add an animation on scroll", 'can you put in a popup for signups',
    ],
    keywords: ['popup', 'widget', 'chat', 'animation', 'addon'],
    category: 'scope',
    meaning:
      "Each of these is a small-sounding feature that still needs picking a tool, configuring it, and testing it against the rest of the site. They add up faster than they look.",
    question: 'Do you have a specific tool in mind, or should I recommend one?',
    reply:
      "Happy to add that in. Do you have a tool in mind, or would you like a recommendation? I'll fold it into the current round if it's quick, or flag it as a small add-on if it needs more setup.",
    risk: 'medium',
  },
  {
    slug: 'can-you-find-the-photos',
    triggers: [
      'can you find the photos', 'can you source the images for the site',
      'can you pick out some photos for us', 'where are the images going to come from',
    ],
    keywords: ['photos', 'images', 'stock', 'sourcing', 'assets'],
    category: 'scope',
    meaning:
      "Photography and image sourcing were likely assumed to be part of design rather than a separate task with its own licensing cost. Stock photos aren't free, and custom photography is its own project.",
    question: 'Do you have any brand photos already, or are we sourcing stock images?',
    reply:
      "Happy to source them. Do you have existing brand photography, or should I pull licensed stock images? Either way, I'll flag the cost of any paid licences before using them.",
    risk: 'medium',
  },
  {
    slug: 'add-another-language',
    triggers: [
      'can we add another language', 'can the site be in spanish too',
      "let's make it bilingual", 'can we translate the whole site',
    ],
    keywords: ['language', 'translation', 'bilingual', 'localization', 'multilingual'],
    category: 'scope',
    meaning:
      "Multi-language support touches nearly every page and needs a translation source, not just a settings toggle. It's a meaningfully larger project than the single-language version.",
    question: 'Do you have translated copy ready, or does that need to be done too?',
    reply:
      "That's very doable, and worth planning properly. Do you already have translated copy, or should that be sourced as part of this? I'll send a separate scope since it touches every page on the site.",
    risk: 'high',
  },
  {
    slug: 'can-you-train-my-team',
    triggers: [
      'can you train my team', 'can you teach my staff to use this',
      'can you show my employees how it works', 'can you do a training session for us',
    ],
    keywords: ['training', 'team', 'staff', 'onboarding', 'walkthrough'],
    category: 'scope',
    meaning:
      "They want their team to be self-sufficient after launch, reasonable but it takes real preparation time on your end. A single walkthrough call is very different from ongoing support.",
    question: 'How many people need training, and would one session cover it?',
    reply:
      "Happy to set that up. How many people need training, and would a single session cover it, or do you expect ongoing questions? I'll scope a short training block based on that.",
    risk: 'medium',
  },
];
