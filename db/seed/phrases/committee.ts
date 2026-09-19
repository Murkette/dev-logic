import type { SeedPhrase } from './types';

export const committee: SeedPhrase[] = [
  {
    slug: 'brother-nephew-friend-thinks',
    triggers: [
      'my brother thinks', 'my nephew thinks the logo should be bigger',
      'my friend took a look and said', 'my brother in law had some thoughts',
    ],
    keywords: ['brother', 'nephew', 'friend', 'opinion', 'secondguess'],
    category: 'committee',
    meaning:
      'A new decision-maker just joined the project without a seat at the table. Feedback will now come second-hand and out of context.',
    question: 'Should we loop them into the next review so I hear their concerns directly?',
    reply:
      "Great that you're getting other eyes on it. Would it help to have them join the next review call? That way I can ask follow-up questions instead of interpreting notes second-hand.",
    risk: 'high',
  },
  {
    slug: 'run-it-by-partner-or-boss',
    triggers: [
      'i need to run it by my partner', 'i have to check with my boss first',
      'let me run this by my husband', 'i need approval from my manager',
    ],
    keywords: ['approval', 'partner', 'boss', 'manager', 'checkwith'],
    category: 'committee',
    meaning:
      "A decision-maker outside the conversation needs to sign off before anything moves forward. It's worth knowing early, before a full round of changes is built on an unapproved direction.",
    question: 'Should they see this before or after the next round of changes?',
    reply:
      "Makes sense to loop them in. Would it help to have them look at this before we go further, so we're not revising around feedback that changes once they weigh in?",
    risk: 'medium',
  },
  {
    slug: 'everyone-in-office-has-thoughts',
    triggers: [
      'everyone in the office has thoughts', 'the whole team wants to weigh in',
      'everyone here has an opinion on it', 'the office had a lot of feedback',
    ],
    keywords: ['office', 'team', 'everyone', 'groupfeedback', 'opinions'],
    category: 'committee',
    meaning:
      "Feedback from a group tends to arrive as a pile of individual, sometimes conflicting, preferences. Someone still needs to be the one who decides what actually happens.",
    question: "Who has final say if the feedback doesn't all point the same way?",
    reply:
      "Group input is genuinely useful context. Who has final say if it doesn't all point the same direction? I'll work from one clear list rather than trying to satisfy every individual note.",
    risk: 'medium',
  },
  {
    slug: 'wife-husband-doesnt-like-colour',
    triggers: [
      "my wife doesn't like the colour", "my husband isn't keen on the colour",
      'my partner hates that shade', 'my spouse thinks the colour is wrong',
    ],
    keywords: ['spouse', 'wife', 'husband', 'colour', 'partner'],
    category: 'committee',
    meaning:
      "A colour choice is being judged by someone outside the target audience for the site. It's worth gently separating personal taste from what the business actually needs to communicate.",
    question: 'Setting personal taste aside, does the colour still fit how you want the brand to feel?',
    reply:
      "Good to know. Setting personal preference aside for a moment, does the colour still feel right for how you want the brand to come across? I'm glad to explore alternatives either way.",
    risk: 'low',
  },
  {
    slug: 'lets-ask-followers-to-vote',
    triggers: [
      "let's ask our followers to vote", "let's poll social media on this",
      "let's put it up for a vote online", "let's see what our audience picks",
    ],
    keywords: ['poll', 'vote', 'followers', 'socialmedia', 'audience'],
    category: 'committee',
    meaning:
      "Public polls tend to reward whatever is boldest or most familiar, not necessarily what serves the actual strategy. A vote can easily overrule a decision made for good reasons.",
    question: 'Should the poll decide the outcome, or just add one more data point?',
    reply:
      "Fun way to get people involved. Worth deciding upfront: does the poll decide the final choice, or is it one input among others? I'd rather agree on that before we see the results.",
    risk: 'medium',
  },
  {
    slug: 'ceo-hasnt-seen-it-yet',
    triggers: [
      "the ceo hasn't seen it yet", "our ceo still needs to review this",
      "leadership hasn't approved this yet", "the boss hasn't looked at it yet",
    ],
    keywords: ['ceo', 'leadership', 'approval', 'signoff', 'boss'],
    category: 'committee',
    meaning:
      "The real decision-maker hasn't been in the loop, which means everything approved so far could still be reopened. It's worth involving them before more work is built on top.",
    question: 'Can we get their eyes on this before the next round of work starts?',
    reply:
      "Better to know now than after the next round. Could we get their eyes on it before we go further? I'd rather adjust once for real feedback than twice for feedback that changes their mind.",
    risk: 'high',
  },
  {
    slug: 'new-marketing-person-has-ideas',
    triggers: [
      'our new marketing person has ideas', 'our new hire wants some changes',
      'the new marketing hire has feedback', 'our marketing person wants to redo this',
    ],
    keywords: ['marketing', 'newhire', 'ideas', 'feedback', 'redirection'],
    category: 'committee',
    meaning:
      "A new voice has joined partway through and wants to put their own stamp on the direction. Their ideas may be good, but they're arriving without the context of what's already been decided and why.",
    question: 'Would a quick call help catch them up on what’s already been agreed and why?',
    reply:
      "Fresh perspective can be useful. Would a short call help bring them up to speed on what's already been decided and why? New ideas can then build on the work done so far instead of restarting it.",
    risk: 'medium',
  },
  {
    slug: 'combine-option-a-and-b',
    triggers: [
      'can you combine option a and option b', 'can we mix the two designs together',
      'can we merge both concepts into one', "let's blend option one and two",
    ],
    keywords: ['combine', 'merge', 'blend', 'options', 'mashup'],
    category: 'committee',
    meaning:
      "Each option was likely designed around a single clear idea, and combining them risks losing what made either one work. It often produces something less coherent than starting fresh from the liked parts.",
    question: 'What specifically from each option do you want to keep?',
    reply:
      "Happy to explore that. Tell me specifically what you like from each one, and I'll build a version around those pieces rather than literally overlaying both designs.",
    risk: 'medium',
  },
  {
    slug: 'showed-it-to-customers',
    triggers: [
      'i showed it to a few customers', 'some of our customers saw it and said',
      'i asked some clients what they thought', 'our regulars gave some feedback on it',
    ],
    keywords: ['customers', 'clients', 'feedback', 'userfeedback', 'regulars'],
    category: 'committee',
    meaning:
      "This is genuinely valuable input, since it comes from the actual audience rather than internal opinions. It's worth treating with more weight than most other second-hand feedback.",
    question: 'What exactly did they react to, and how many people said the same thing?',
    reply:
      "That's great input, thank you for gathering it. What exactly did they react to, and did more than one person say the same thing? I'll treat repeated feedback as a real signal worth acting on.",
    risk: 'low',
  },
  {
    slug: 'investor-thinks',
    triggers: [
      'our investor thinks', 'one of our investors had feedback',
      'our investors want some changes', 'an investor raised some concerns about it',
    ],
    keywords: ['investor', 'stakeholder', 'feedback', 'concerns', 'boardroom'],
    category: 'committee',
    meaning:
      "A stakeholder with financial interest but no seat in day-to-day decisions has weighed in from the outside. Their concern is worth hearing, but it needs the same scrutiny as any other feedback.",
    question: 'What specifically are they concerned this will affect?',
    reply:
      "Worth taking seriously given their stake in it. What specifically are they worried this affects — growth, trust, or something else? I'll make sure that concern is actually addressed, not just noted.",
    risk: 'medium',
  },
  {
    slug: 'couldnt-agree-heres-everyones-comments',
    triggers: [
      "we couldn't agree so here are everyone's comments", "we all had different feedback so here's the list",
      "the team disagreed so here's everything they said", "everyone had different opinions here's the whole list",
    ],
    keywords: ['disagreement', 'comments', 'conflicting', 'everyone', 'mixedfeedback'],
    category: 'committee',
    meaning:
      "A pile of unreconciled, conflicting feedback has landed without anyone deciding which of it should actually be acted on. Treating it all as equally weighted will produce a worse result than picking a direction.",
    question: "Who on your side has the final call when the feedback conflicts?",
    reply:
      "Thanks for passing all of it along. Who has the final call when the comments don't agree with each other? I'll work from their priorities rather than trying to satisfy every conflicting note at once.",
    risk: 'high',
  },
  {
    slug: 'legal-needs-to-review-it',
    triggers: [
      'legal needs to review it', 'our lawyer wants to check this first',
      'compliance needs to sign off on this', "our legal team hasn't approved this yet",
    ],
    keywords: ['legal', 'compliance', 'lawyer', 'review', 'signoff'],
    category: 'committee',
    meaning:
      "A review step has appeared that sits outside the design process entirely and on a timeline you don't control. It's worth building slack into the schedule rather than assuming it will be quick.",
    question: 'Roughly how long does legal review usually take on your end?',
    reply:
      "Good to build that in now. Roughly how long does legal review usually take? I'll pencil that time into the schedule so it doesn't quietly eat into the launch date.",
    risk: 'medium',
  },
];
