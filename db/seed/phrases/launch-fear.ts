import type { SeedPhrase } from './types';

export const launchFear: SeedPhrase[] = [
  {
    slug: 'hold-off-until-perfect',
    triggers: [
      "let's hold off until it's perfect", "let's wait until it's perfect",
      "i don't want to launch until it's perfect", 'we should wait for it to be flawless',
    ],
    keywords: ['perfect', 'holdoff', 'wait', 'flawless', 'delay'],
    category: 'launch-fear',
    meaning:
      'Fear of being judged is driving the delay. Perfect never arrives, and this project is about to quietly stall.',
    question: 'What specifically would make you comfortable launching next week?',
    reply:
      "Totally understand wanting it right. Perfect tends to arrive after launch, once real visitors tell us what matters. What are the two or three things that, if fixed, would make you comfortable going live?",
    risk: 'high',
  },
  {
    slug: 'soft-launch',
    triggers: [
      'can we do a soft launch', 'what about a quiet launch first',
      'can we launch quietly to start', "let's do a low key launch first",
    ],
    keywords: ['softlaunch', 'quiet', 'gradual', 'test', 'limited'],
    category: 'launch-fear',
    meaning:
      "This is often a genuinely good instinct dressed up as stalling, since a limited release can lower the stakes of launching. It just needs a real end date, or it can drift indefinitely.",
    question: 'What would trigger the move from soft launch to the full public one?',
    reply:
      "That's a solid approach. What would trigger moving from the soft launch to the full public one, like a date or a visitor count? I'll set that as a real milestone, not an open-ended phase.",
    risk: 'medium',
  },
  {
    slug: 'one-more-round-before-launch',
    triggers: [
      'one more round before we go live', 'just one more pass before launch',
      "let's do one final round first", 'one more check before it goes live',
    ],
    keywords: ['onemore', 'finalround', 'beforelaunch', 'lastcheck', 'delay'],
    category: 'launch-fear',
    meaning:
      "This can be a genuine quality step, or it can be the same fear of launching wearing a practical-sounding disguise. The difference is whether there's a concrete list driving it.",
    question: "What specifically is this round meant to catch that the last one didn't?",
    reply:
      "Happy to do another pass. What specifically is this round meant to catch that we haven't already covered? If there's a clear list, let's do it; if it's more of a feeling, that's launch nerves talking.",
    risk: 'high',
  },
  {
    slug: 'what-if-people-dont-like-it',
    triggers: [
      "what if people don't like it", "what if our customers hate it",
      'what if nobody likes the new site', "i'm worried people won't like it",
    ],
    keywords: ['worried', 'dislike', 'fear', 'customers', 'reaction'],
    category: 'launch-fear',
    meaning:
      "This is fear of judgement, not evidence that anything is actually wrong. It rarely resolves by looking longer at a design in isolation; it resolves by seeing how real visitors respond.",
    question: "What's the worst realistic reaction, and how would we actually know if it happened?",
    reply:
      "That worry is normal before any launch. What's the worst realistic reaction, and how would we know if it happened? We can watch for that specifically instead of waiting for a certainty that won't come.",
    risk: 'high',
  },
  {
    slug: 'keep-old-site-up-just-in-case',
    triggers: [
      'can we keep the old site up just in case', "let's leave the old site running for now",
      'can the old site stay live as a backup', 'keep the previous site up temporarily',
    ],
    keywords: ['oldsite', 'backup', 'justincase', 'keeplive', 'fallback'],
    category: 'launch-fear',
    meaning:
      "This comes from a fear of losing something rather than a real technical need, since the old site stays fully backed up regardless. Running both at once usually just confuses visitors and search engines.",
    question: "What specifically are you worried we'd lose by switching over fully?",
    reply:
      "Understandable instinct, and good news: the old site is fully backed up either way. What are you worried about losing? Running both live at once tends to confuse visitors and search engines more than it protects you.",
    risk: 'medium',
  },
  {
    slug: 'sit-on-it-for-a-few-days',
    triggers: [
      'let me sit on it for a few days', 'i need a few days to think it over',
      'give me some time to sit with this', 'let me sleep on it for a bit',
    ],
    keywords: ['sitonit', 'thinkitover', 'time', 'decide', 'pause'],
    category: 'launch-fear',
    meaning:
      "They want space before committing, a fair and normal request. It's worth pairing it with a specific date, or 'a few days' can quietly become several weeks.",
    question: 'Can we pencil in a specific day to reconnect on this?',
    reply:
      "Of course, take the time you need. Can we pencil in a specific day to reconnect, so it doesn't slip past what you actually intended? I'll hold the schedule until then.",
    risk: 'medium',
  },
  {
    slug: 'not-sure-about-it-anymore',
    triggers: [
      "i'm not sure about it anymore", "i'm having second thoughts",
      "i don't know if this is right anymore", "i'm second guessing the whole thing",
    ],
    keywords: ['secondthoughts', 'unsure', 'doubt', 'hesitant', 'reconsidering'],
    category: 'launch-fear',
    meaning:
      "Second thoughts this late are usually about nerves rather than a specific, nameable flaw. It's worth finding the actual concern before treating this as a signal to redo the work.",
    question: 'Is there something specific that changed your mind, or is it more a general feeling?',
    reply:
      "That's worth talking through before we go further. Is there something specific that's shifted, or more a general feeling of nerves? Naming the actual concern will tell us whether anything needs to change.",
    risk: 'high',
  },
  {
    slug: 'test-everything-first',
    triggers: [
      'can we test everything first', "let's make sure everything's tested",
      "can we double check it all works", 'we should test this thoroughly first',
    ],
    keywords: ['testing', 'qa', 'checkfirst', 'thorough', 'verify'],
    category: 'launch-fear',
    meaning:
      "This is a completely reasonable request and usually already part of the process. It's worth showing what testing already happens so it doesn't feel like an unaddressed gap.",
    question: "Is there a specific device, browser, or flow you're most worried about?",
    reply:
      "Good instinct, and testing is already built into the process. Is there a specific device, browser, or flow you're most worried about? I'll make sure that gets extra attention before we go live.",
    risk: 'low',
  },
  {
    slug: 'what-if-it-breaks-on-launch-day',
    triggers: [
      'what if it breaks on launch day', 'what happens if something fails at launch',
      "what's the plan if launch day goes wrong", 'what if the site crashes when we launch',
    ],
    keywords: ['launchday', 'breaks', 'crash', 'failure', 'contingency'],
    category: 'launch-fear',
    meaning:
      "This is a fair operational question, not just anxiety, and deserves a real answer about the plan rather than pure reassurance. A rollback plan matters more than promising nothing will go wrong.",
    question: 'Would it help to walk through the rollback plan if something did go wrong?',
    reply:
      "Fair thing to plan for rather than just hope against. I keep a rollback ready so we can revert quickly if anything goes wrong at launch. I'll walk you through that plan before we set the date.",
    risk: 'medium',
  },
  {
    slug: 'wait-until-after-busy-season',
    triggers: [
      "let's wait until after the busy season", 'can we hold off until after the season',
      "let's launch after our peak season ends", 'better to wait past the busy period',
    ],
    keywords: ['busyseason', 'peak', 'waituntil', 'timing', 'season'],
    category: 'launch-fear',
    meaning:
      "This can be a genuinely sound business call, since a risky change during peak revenue isn't worth it for everyone. It's worth confirming a real date now so waiting doesn't quietly become indefinite.",
    question: 'What’s the actual date the busy season wraps up for you?',
    reply:
      "That's a fair call if the timing genuinely matters for revenue. What's the actual date the busy season wraps up? I'll lock that in as our real launch window instead of leaving it open-ended.",
    risk: 'medium',
  },
  {
    slug: 'rewrite-all-the-copy-first',
    triggers: [
      'i want to rewrite all the copy first', "let's redo all the text before launch",
      'i need to fix all the wording first', 'can we rewrite everything before going live',
    ],
    keywords: ['copy', 'rewrite', 'wording', 'text', 'beforelaunch'],
    category: 'launch-fear',
    meaning:
      "This can be genuine quality control, or it can be a way to avoid finishing, since copy can always be tweaked one more time. It's worth setting a hard cutoff so editing doesn't become the new delay.",
    question: "What specifically feels wrong with the current copy?",
    reply:
      "Happy to take another pass. What specifically feels off: the tone, the accuracy, or something else? Let's set a cutoff date for edits so this doesn't become the new reason to wait.",
    risk: 'high',
  },
  {
    slug: 'competitor-just-relaunched',
    triggers: [
      'a competitor just relaunched should we rethink', 'our competitor just redid their site',
      'a rival just launched a new site should we wait', 'should we rethink this since a competitor relaunched',
    ],
    keywords: ['competitor', 'rival', 'relaunch', 'rethink', 'comparison'],
    category: 'launch-fear',
    meaning:
      "Seeing a competitor move can shake confidence in a direction that was solid a week ago. It's worth looking at what they actually changed before assuming anything here needs to shift.",
    question: 'What specifically about their relaunch made you want to reconsider?',
    reply:
      "Worth a look, but not a reason to panic on its own. What specifically about their relaunch caught your eye? If it points to something real, we can adjust; if it's launch-day nerves, let's stay the course.",
    risk: 'medium',
  },
];
