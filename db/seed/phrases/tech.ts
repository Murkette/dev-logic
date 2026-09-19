import type { SeedPhrase } from './types';

export const tech: SeedPhrase[] = [
  {
    slug: 'looks-different-on-my-phone',
    triggers: [
      'it looks different on my phone', 'it looks weird on mobile',
      'the site looks broken on my phone', 'on my phone it looks all wrong',
    ],
    keywords: ['mobile', 'phone', 'responsive', 'broken', 'device'],
    category: 'tech',
    meaning:
      "Responsive design means the layout intentionally changes shape on a smaller screen, which can look 'wrong' if they expect an exact copy of the desktop view. Sometimes it is a genuine bug, though.",
    question: "Can you send a screenshot and tell me what phone and browser you're using?",
    reply:
      "Thanks for flagging it. Could you send a screenshot along with your phone model and browser? Some layout changes on mobile are intentional, but this could also be a real bug I need to fix.",
    risk: 'medium',
  },
  {
    slug: 'make-it-load-faster',
    triggers: [
      'can you make it load faster', 'the site feels slow',
      'can we speed up the website', 'loading feels sluggish can we fix that',
    ],
    keywords: ['speed', 'slow', 'loading', 'performance', 'fast'],
    category: 'tech',
    meaning:
      "Speed complaints are usually specific, like large images or a particular page, rather than the whole site being uniformly slow. It's worth measuring before changing anything.",
    question: 'Is it slow everywhere, or on one page in particular?',
    reply:
      "Let's fix that properly. Is it slow everywhere, or on a specific page? I'll run a real speed test first so we're fixing the actual bottleneck instead of guessing at one.",
    risk: 'medium',
  },
  {
    slug: 'why-arent-we-on-google-yet',
    triggers: [
      "why aren't we on google yet", "we're not showing up in search",
      "why can't i find us on google", "google isn't showing our site",
    ],
    keywords: ['google', 'search', 'seo', 'indexed', 'ranking'],
    category: 'tech',
    meaning:
      "A new site can take real time to be indexed and start ranking, which isn't a sign anything is broken. Expectations here are usually set by how search engines get talked about generally, not how they work.",
    question: 'How long has the site actually been live so far?',
    reply:
      "Totally normal at this stage. New sites usually take a few weeks to get indexed and longer to rank for anything competitive. I can confirm it's set up correctly and share what ongoing SEO would involve.",
    risk: 'medium',
  },
  {
    slug: 'doesnt-work-in-my-browser',
    triggers: [
      "it doesn't work in my browser", 'the site is broken in chrome',
      "this isn't working in safari", "the site won't load in my browser",
    ],
    keywords: ['browser', 'chrome', 'safari', 'broken', 'compatibility'],
    category: 'tech',
    meaning:
      "This is genuinely useful to know and might point to a real bug specific to one browser or an outdated version. It needs specifics before it can be reproduced and fixed.",
    question: 'Which browser and version are you using, and what exactly happens?',
    reply:
      "Thanks for catching that. Could you tell me which browser and version, and exactly what happens when it fails? I'll test it directly and get a fix out once I can reproduce it.",
    risk: 'medium',
  },
  {
    slug: 'cant-see-the-changes',
    triggers: [
      "i can't see the changes you made", "the updates aren't showing up",
      "nothing looks different to me", "i don't see what you changed",
    ],
    keywords: ['cache', 'changes', 'notshowing', 'refresh', 'update'],
    category: 'tech',
    meaning:
      "This is very often a caching issue in their browser rather than the update actually being missing. A hard refresh solves it more often than not.",
    question: 'Can you try a hard refresh, like ctrl+shift+r, and check again?',
    reply:
      "Good to check before assuming the worst. Could you try a hard refresh, like ctrl+shift+r, or an incognito window? If it still looks unchanged after that, let me know and I'll dig in properly.",
    risk: 'low',
  },
  {
    slug: 'edit-it-myself',
    triggers: [
      'can i edit it myself', 'can i make changes on my own',
      'can i update the text myself', 'how do i log in and edit things',
    ],
    keywords: ['editing', 'cms', 'selfedit', 'login', 'backend'],
    category: 'tech',
    meaning:
      "They want to make small updates without emailing every time, a completely reasonable expectation for most sites today. It's a setup and training question, not a technical impossibility.",
    question: 'What kinds of things do you expect to update: text, images, or both?',
    reply:
      "Yes, that's very doable. What do you expect to update most: text, images, or both? I'll set up access to just those pieces and walk you through it so it's simple day to day.",
    risk: 'low',
  },
  {
    slug: 'move-to-different-platform',
    triggers: [
      'can we move it to a different platform', 'can we migrate off this platform',
      "let's switch to another cms", "can we change what platform we're on",
    ],
    keywords: ['platform', 'migrate', 'cms', 'switch', 'hosting'],
    category: 'tech',
    meaning:
      "This is a much bigger job than it sounds, since content, design, and functionality all need rebuilding or careful migration, not copy-pasting. It's worth understanding the real motivation first.",
    question: "What's prompting the move: cost, features, or something not working?",
    reply:
      "That's a real project on its own, not a quick swap. What's driving the interest: cost, missing features, or something not working well? I'll scope the migration properly once I know the real goal.",
    risk: 'high',
  },
  {
    slug: 'the-site-is-down',
    triggers: [
      'the site is down', "our website isn't loading at all",
      'the site is completely offline', "visitors say the site won't load",
    ],
    keywords: ['down', 'offline', 'outage', 'notloading', 'error'],
    category: 'tech',
    meaning:
      "This needs treating as urgent until proven otherwise, since every minute offline can mean lost customers. It's worth confirming it's really down and not a local issue before diagnosing further.",
    question: 'Can you send a screenshot of the error, and what site are you checking on?',
    reply:
      "On it right now. Can you send a screenshot of what you're seeing and confirm the exact address? I'm checking the server directly and will update you the moment I know what's happening.",
    risk: 'high',
  },
  {
    slug: 'make-it-secure',
    triggers: [
      'can you make it secure', 'is the site actually safe',
      'can we get better security on this', 'how secure is our website really',
    ],
    keywords: ['security', 'secure', 'safety', 'hacked', 'protection'],
    category: 'tech',
    meaning:
      "Security concerns are often triggered by a news story or a scare rather than an actual incident on their own site. It's worth calmly confirming what's already in place before adding anything new.",
    question: 'Is there something specific that prompted this, or is it a general check-in?',
    reply:
      "Good to stay on top of. Is there something specific that prompted this, or would you like a general review? I'll confirm basics like HTTPS and backups are solid either way and flag anything missing.",
    risk: 'medium',
  },
  {
    slug: 'not-getting-contact-form-emails',
    triggers: [
      "i'm not getting the contact form emails", "the contact form doesn't seem to be working",
      "no one's emails are coming through from the form", "contact form submissions aren't reaching me",
    ],
    keywords: ['contactform', 'emails', 'notreceiving', 'spam', 'submissions'],
    category: 'tech',
    meaning:
      "Form emails are one of the most common quiet failures, often ending up in a spam folder rather than never being sent at all. It's worth checking spam before assuming the form itself is broken.",
    question: 'Have you checked your spam or junk folder for these?',
    reply:
      "Let's track that down. Have you checked spam or junk first, since that's the most common cause? If nothing's there, I'll test the form myself and check the delivery logs directly.",
    risk: 'medium',
  },
  {
    slug: 'make-it-an-app',
    triggers: [
      'can you make it an app', 'can we turn this into an app',
      'can this become a mobile app too', 'do we need an app version of this',
    ],
    keywords: ['app', 'mobileapp', 'ios', 'android', 'native'],
    category: 'tech',
    meaning:
      "A mobile app is a genuinely separate product with its own cost, app store process, and maintenance, not an export of the website. A mobile-friendly website often already covers what's actually needed.",
    question: "What would the app do that the mobile website currently can't?",
    reply:
      "That's a bigger build than exporting the site — apps are their own product with their own ongoing cost. What would it need to do that the mobile site can't already? That'll tell us if it's really needed.",
    risk: 'high',
  },
  {
    slug: 'can-you-add-seo',
    triggers: [
      'can you add seo', 'can we get some seo done',
      'can you optimize this for search', "let's add seo to the site",
    ],
    keywords: ['seo', 'search', 'optimization', 'keywords', 'ranking'],
    category: 'tech',
    meaning:
      "SEO is treated like a single feature that gets switched on, but it's really an ongoing practice across content, technical setup, and time. A one-time task can only cover the technical foundation.",
    question: 'Are you picturing a one-time technical setup, or ongoing monthly SEO work?',
    reply:
      "Happy to help with that. Are you picturing a one-time technical setup, or ongoing monthly work? I can handle the foundation now, and point you toward options for the ongoing side if that's the goal.",
    risk: 'medium',
  },
  {
    slug: 'i-updated-something-and-it-broke',
    triggers: [
      'i updated something and it broke', "i changed a setting and now it's broken",
      "i tried to edit it and something went wrong", 'i touched something and the site broke',
    ],
    keywords: ['broke', 'brokeit', 'edited', 'changed', 'error'],
    category: 'tech',
    meaning:
      "Something changed in the backend and the effect wasn't fully understood before it was saved. The fastest path forward is knowing exactly what was touched, not who's at fault.",
    question: 'Can you tell me exactly what you changed right before it broke?',
    reply:
      "No stress, this is fixable. Can you tell me exactly what you changed right before it broke? That'll help me undo just that piece quickly instead of digging through everything.",
    risk: 'medium',
  },
  {
    slug: 'cousins-cheap-hosting',
    triggers: [
      "can we use my cousin's cheap hosting", 'my cousin can host it for cheap',
      'can we host it somewhere cheaper', 'my friend offered free hosting for us',
    ],
    keywords: ['hosting', 'cheap', 'cousin', 'server', 'cheaphost'],
    category: 'tech',
    meaning:
      "Cheap or free hosting often comes with real trade-offs in reliability, support, and security that aren't obvious until something goes wrong. It's worth comparing what's actually included, not just the price.",
    question: 'Do you know what uptime and support come with that hosting option?',
    reply:
      "Worth comparing properly before switching. Do you know what uptime, backups, and support come with that option? I'm glad to review it with you so the decision is based on what's included, not just price.",
    risk: 'medium',
  },
];
