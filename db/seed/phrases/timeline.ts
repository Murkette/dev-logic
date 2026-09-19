import type { SeedPhrase } from './types';

export const timeline: SeedPhrase[] = [
  {
    slug: 'when-will-it-be-done',
    triggers: [
      'when will it be done', 'when is it going to be finished',
      "what's the timeline looking like", 'do we have a completion date',
    ],
    keywords: ['timeline', 'deadline', 'finished', 'eta', 'schedule'],
    category: 'timeline',
    meaning:
      "They're excited, and possibly haven't been told the timeline in writing. Sent early in a project, this is rarely a complaint.",
    question: 'Have you seen the milestone schedule I sent at kickoff?',
    reply:
      "We're on track. Here's the milestone schedule again with dates, and I'll send a short update every Friday so you never have to wonder.",
    risk: 'low',
  },
  {
    slug: 'need-it-by-friday',
    triggers: [
      'we need it by friday', 'can this be done by friday',
      'friday is our hard deadline', 'it has to be ready by friday',
    ],
    keywords: ['friday', 'deadline', 'hard', 'date', 'urgent'],
    category: 'timeline',
    meaning:
      "A specific date has appeared, possibly for the first time, and it may or may not fit the current schedule. This needs a straight answer, not a hopeful one.",
    question: 'Is Friday a fixed date tied to something, or a preference?',
    reply:
      "Thanks for the clear date. Is Friday tied to something specific, like an event or launch, or is there flexibility? I'll tell you honestly whether the current scope fits that window.",
    risk: 'high',
  },
  {
    slug: 'can-you-start-today',
    triggers: [
      'can you start today', 'can we begin right away',
      'is it possible to start immediately', 'can you jump on this today',
    ],
    keywords: ['today', 'immediately', 'start', 'asap', 'rightaway'],
    category: 'timeline',
    meaning:
      "They're ready and excited, a good sign, but a real start needs a signed agreement and often a deposit in place first. Enthusiasm alone can't skip the setup steps.",
    question: 'Have the contract and deposit gone through on your end yet?',
    reply:
      "Love the energy — let's use it. Once the contract's signed and the deposit's through, I can start the same day. If those are already moving, tell me and I'll clear time now.",
    risk: 'low',
  },
  {
    slug: 'sorry-been-busy',
    triggers: [
      'sorry been busy', 'sorry for the radio silence',
      "sorry i've been slow to reply", 'apologies for going quiet',
    ],
    keywords: ['busy', 'silence', 'delay', 'quiet', 'sorry'],
    category: 'timeline',
    meaning:
      "Weeks of silence from their side likely pushed back a step that was waiting on them, like feedback or content. The schedule now needs an honest look, not a guilt-driven rush.",
    question: 'Given where we are now, should we adjust the launch date together?',
    reply:
      "No worries at all, life happens. Given the gap, let's look at the schedule together and set a launch date that's realistic from here rather than one we're now chasing.",
    risk: 'low',
  },
  {
    slug: 'content-next-week',
    triggers: [
      "i'll get you the content next week", 'content is coming next week i promise',
      "i'll send over the copy next week", 'photos and text coming next week',
    ],
    keywords: ['content', 'copy', 'photos', 'nextweek', 'pending'],
    category: 'timeline',
    meaning:
      "The project is waiting on something only they can provide, and the launch date depends on when it actually arrives. It's worth being clear about what happens if next week slips again.",
    question: 'If it slips past next week, should we adjust the launch date now or wait and see?',
    reply:
      "Sounds good, I'll build around that date. Just so we're aligned: if it slips again, the launch date needs to move with it rather than compress the build time. I'll block the week to move fast once it's in.",
    risk: 'medium',
  },
  {
    slug: 'must-launch-before-event',
    triggers: [
      'we must launch before the event', 'it has to be live before our event',
      'the launch needs to beat our event date', 'we need this up before the big event',
    ],
    keywords: ['event', 'deadline', 'launch', 'hard', 'musthave'],
    category: 'timeline',
    meaning:
      "There's a real external date driving the schedule, useful information to have as early as possible. This changes how urgently any delays need to be flagged.",
    question: "What's the exact date of the event, and is there any flexibility around it?",
    reply:
      "Good to know the hard date. What's the exact date, and is there truly no flexibility? I'll build the schedule backward from that and flag immediately if anything puts it at risk.",
    risk: 'high',
  },
  {
    slug: 'why-is-it-taking-so-long',
    triggers: [
      'why is it taking so long', 'why is this taking forever',
      "shouldn't this be done by now", "why isn't this finished yet",
    ],
    keywords: ['slow', 'delay', 'long', 'taking', 'forever'],
    category: 'timeline',
    meaning:
      "From the outside, progress that's actually on track can look invisible, especially between visible milestones. This is best answered with specifics, not reassurance alone.",
    question: 'Would a quick rundown of what’s been done and what’s left help right now?',
    reply:
      "Fair to ask. Here's exactly where things stand and what's left before the next milestone. If it genuinely has slipped, I'll own that and give you a real revised date.",
    risk: 'medium',
  },
  {
    slug: 'can-we-push-the-deadline',
    triggers: [
      'can we push the deadline', 'can we move the launch date back',
      "let's extend the timeline a bit", 'can we delay the launch date',
    ],
    keywords: ['push', 'extend', 'delay', 'deadline', 'reschedule'],
    category: 'timeline',
    meaning:
      "Something on their end needs more time, a completely normal thing to ask for. It just needs to be reflected honestly in the schedule rather than absorbed silently.",
    question: 'How much more time do you think you need, roughly?',
    reply:
      "That's no problem at all. Roughly how much more time do you need? I'll shift the schedule and let you know if it bumps into anything else we've already planned.",
    risk: 'low',
  },
  {
    slug: 'quick-call',
    triggers: [
      'got time for a quick call', 'can we hop on a quick call',
      'do you have five minutes to chat', 'can we jump on a call real quick',
    ],
    keywords: ['call', 'quick', 'chat', 'phone', 'meeting'],
    category: 'timeline',
    meaning:
      "'Quick' calls without an agenda tend to run long and derail a focused block of work. A one-line reason for the call usually keeps it actually quick.",
    question: "What's the call about, so I can be ready with the right info?",
    reply:
      "Sure, happy to talk. What's it about, so I come prepared rather than guessing? I've got a slot later today or tomorrow morning if either works for you.",
    risk: 'low',
  },
  {
    slug: 'work-this-weekend',
    triggers: [
      'can you work this weekend', 'any chance you can work saturday',
      'could you put in some weekend hours', 'can this get done over the weekend',
    ],
    keywords: ['weekend', 'saturday', 'sunday', 'overtime', 'afterhours'],
    category: 'timeline',
    meaning:
      "They likely don't know whether weekend work is normal, rushed, or outside your usual availability. This is worth answering as a boundary, not an apology.",
    question: 'Is this urgent enough to justify a rush turnaround, or can it wait until Monday?',
    reply:
      "I keep weekends outside my regular schedule so the work stays sharp on weekdays. If it's genuinely urgent I can look at a rush rate; otherwise I'll have it first thing Monday.",
    risk: 'medium',
  },
  {
    slug: 'need-it-yesterday',
    triggers: [
      'i need it yesterday', 'this needed to be done yesterday',
      "we're already behind we need it now", "this is way overdue we need it asap",
    ],
    keywords: ['urgent', 'yesterday', 'overdue', 'rush', 'asap'],
    category: 'timeline',
    meaning:
      "Urgency is being expressed with humour, but there's usually real deadline pressure behind it. It's worth finding the actual date rather than reacting to the exaggeration.",
    question: "What's the actual date this needs to be live by?",
    reply:
      "I hear the urgency. What's the real date this needs to be live by? Once I know that, I can tell you honestly what's realistic and what we'd need to cut to get there.",
    risk: 'high',
  },
  {
    slug: 'pause-the-project',
    triggers: [
      "let's pause the project for a bit", 'can we put this on hold for now',
      'can we pause things for a while', "let's take a break from the project",
    ],
    keywords: ['pause', 'hold', 'break', 'stall', 'onhold'],
    category: 'timeline',
    meaning:
      "Something outside the project, often budget or bandwidth, has made it hard to continue right now. It's worth agreeing on what a pause actually means before it starts.",
    question: 'Roughly how long do you expect the pause to last?',
    reply:
      "Understood, that happens. Roughly how long do you expect this to last? I'll note where we paused and what it takes to restart cleanly whenever you're ready.",
    risk: 'medium',
  },
  {
    slug: 'were-nearly-there-right',
    triggers: [
      "we're nearly there right", "this is basically done right",
      'we must be close to finished now', 'almost finished right',
    ],
    keywords: ['nearlydone', 'almost', 'close', 'finished', 'progress'],
    category: 'timeline',
    meaning:
      "They're hoping for reassurance, and the honest answer might be more nuanced than yes or no. A specific answer builds more trust than a vague one either way.",
    question: 'Would it help to see exactly what’s left on the list?',
    reply:
      "Good question to check in on. We're close on some parts and still have real work on others — let me send the exact list of what's left so it's not just a feeling either way.",
    risk: 'low',
  },
  {
    slug: 'something-temporary',
    triggers: [
      'can you just put up something temporary', 'can we get a placeholder page live',
      'can we launch something basic for now', 'just put something up in the meantime',
    ],
    keywords: ['temporary', 'placeholder', 'interim', 'holding', 'meanwhile'],
    category: 'timeline',
    meaning:
      "They want something live now while the real site is still being finished, usually to stop losing visitors to a blank page. This is a real deliverable, even if it's simple.",
    question: 'What’s the one thing this temporary page absolutely needs to say?',
    reply:
      "That's doable and often worth doing. What's the one thing this page absolutely has to say while people wait? I'll get something simple live quickly without pulling focus from the real build.",
    risk: 'low',
  },
];
