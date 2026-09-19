import type { SeedPhrase } from './types';

export const taste: SeedPhrase[] = [
  {
    slug: 'make-it-pop',
    triggers: ['make it pop', 'can you make it pop', 'needs to pop more', 'make it pop more'],
    keywords: ['pop', 'punchy', 'energy', 'flat', 'contrast'],
    category: 'taste',
    meaning:
      "They want more contrast or hierarchy but don't have the words for it. The page probably reads as flat, or the thing they care about isn't the loudest thing on the screen.",
    question: 'Which element should someone notice first when they land here?',
    reply:
      "Happy to push the visual energy. To aim it right: which one element should grab attention first? I'll increase contrast and hierarchy around that instead of making everything louder at once.",
    risk: 'medium',
  },
  {
    slug: 'know-it-when-i-see-it',
    triggers: [
      "i'll know it when i see it", 'i will know it when i see it',
      'just show me some options', "not sure yet but i'll know",
    ],
    keywords: ['undecided', 'options', 'direction', 'iterate', 'unsure'],
    category: 'taste',
    meaning:
      "They haven't decided what they want yet and are hoping you'll iterate until something clicks. Left open-ended, this becomes unlimited revisions in disguise.",
    question: "Can you send me three sites you like and one you can't stand?",
    reply:
      "That's a normal place to start. So we don't burn the budget guessing, could you send three sites you like and one you don't, with a sentence on why each? I'll build the first concept from those.",
    risk: 'high',
  },
  {
    slug: 'something-feels-off',
    triggers: [
      'something feels off', "something's not right", 'it just feels wrong', 'not quite right somehow',
    ],
    keywords: ['off', 'spacing', 'alignment', 'clash', 'wrong'],
    category: 'taste',
    meaning:
      "Usually this means spacing, alignment, or a colour that clashes with the brand in their head. It's rarely a structural problem.",
    question: 'If you had to point at one spot on the screen, where would you point?',
    reply:
      'Got it. Could you screenshot the section and circle where your eye snags? Even a rough guess helps me fix the right thing instead of changing everything.',
    risk: 'medium',
  },
  {
    slug: 'make-the-logo-bigger',
    triggers: [
      'make the logo bigger', 'can we make the logo bigger',
      'logo needs to be bigger', 'logo should stand out more',
    ],
    keywords: ['logo', 'bigger', 'brand', 'prominent', 'size'],
    category: 'taste',
    meaning:
      "They're worried the brand isn't prominent enough. It's usually about confidence in the brand, not literal pixels.",
    question: "Is the concern that visitors won't know who they're looking at?",
    reply:
      "We can do that. Before I do, is the worry that the brand doesn't feel present enough? If so, there are other ways to fix that beyond scale, and I'd rather solve the real concern.",
    risk: 'low',
  },
  {
    slug: 'make-it-more-modern',
    triggers: [
      'make it more modern', 'can this look more modern', 'it feels dated', 'needs a more current look',
    ],
    keywords: ['modern', 'dated', 'current', 'fresh', 'trendy'],
    category: 'taste',
    meaning:
      "They've seen newer sites elsewhere and want that same sense of polish. Usually this is about type, spacing, and imagery more than a full redesign.",
    question: 'Which modern sites have caught your eye recently, and what stood out about them?',
    reply:
      "Happy to freshen it up. Could you send one or two sites that feel modern to you? I'll match that direction rather than guessing at a trend.",
    risk: 'medium',
  },
  {
    slug: 'too-plain-or-boring',
    triggers: [
      'it looks too plain', "it's kind of boring", 'needs more personality', 'feels a bit flat and boring',
    ],
    keywords: ['plain', 'boring', 'personality', 'flat', 'dull'],
    category: 'taste',
    meaning:
      "They want the design to feel more alive but usually can't name what's missing. Often it's a texture, an accent colour, or a stronger image that's absent.",
    question: "What's a brand or site that feels like the opposite of boring to you?",
    reply:
      "Let's give it more personality. Send me a brand or site that feels like the opposite of boring to you, and I'll pull that energy in through colour, imagery, or type rather than adding clutter.",
    risk: 'medium',
  },
  {
    slug: 'make-it-more-fun',
    triggers: [
      'make it more fun', 'can it feel more playful',
      'needs more personality and fun', 'make it feel less serious',
    ],
    keywords: ['fun', 'playful', 'serious', 'personality', 'energy'],
    category: 'taste',
    meaning:
      'They want warmth and character, not just information delivered cleanly. This usually means loosening up colour, illustration, or copy tone.',
    question: 'Playful in the colours and shapes, or playful in how the copy sounds?',
    reply:
      "Easy to dial up. Just so I push the right lever: is the playfulness you want more about the visuals, or the way the words sound? I'll adjust that specifically.",
    risk: 'medium',
  },
  {
    slug: 'make-it-look-premium',
    triggers: [
      'make it look more premium', 'needs to feel high end',
      'make it feel more luxury', 'should look more expensive',
    ],
    keywords: ['premium', 'luxury', 'expensive', 'polish', 'highend'],
    category: 'taste',
    meaning:
      'They want the site to signal quality and justify a higher price point. This is usually solved with restraint and stronger photography, not more decoration.',
    question: "Which brand's site feels premium to you in a way ours currently doesn't?",
    reply:
      "We can get there. Premium usually comes from more breathing room and stronger imagery, not more elements. Send me a site that reads as premium to you and I'll match that restraint.",
    risk: 'medium',
  },
  {
    slug: 'not-sure-about-colours',
    triggers: [
      'not sure about the colours', 'the colours feel off',
      'can we look at other colours', "colour palette isn't working",
    ],
    keywords: ['colour', 'palette', 'shade', 'tone', 'hue'],
    category: 'taste',
    meaning:
      "They have a gut reaction against the palette but can't say why. It's often one specific colour, not the whole scheme.",
    question: 'Is there one specific colour that bothers you, or the palette as a whole?',
    reply:
      "No problem. Can you tell me if it's one colour in particular, or the whole palette that feels off? That'll save us from redoing the parts that were already working.",
    risk: 'low',
  },
  {
    slug: 'try-a-different-font',
    triggers: [
      'can we try a different font', "the font doesn't feel right",
      'can we change the typeface', 'font feels off somehow',
    ],
    keywords: ['font', 'typeface', 'type', 'lettering', 'typography'],
    category: 'taste',
    meaning:
      "They're reacting to the mood the type sets, like formal versus friendly, rather than the letterforms themselves. It's rarely about the specific font family.",
    question: 'Does the current font feel too formal, too casual, or just unfamiliar?',
    reply:
      'Happy to explore other options. Would you say the current type feels too formal, too casual, or just unfamiliar? I’ll bring two or three alternatives built around that.',
    risk: 'low',
  },
  {
    slug: 'too-much-white-space',
    triggers: [
      'too much white space', "there's too much empty space",
      'feels too spaced out', 'too much blank space',
    ],
    keywords: ['whitespace', 'empty', 'spacing', 'sparse', 'gaps'],
    category: 'taste',
    meaning:
      "They read generous spacing as unfinished or empty rather than intentional. This is common with clients used to denser, older-style websites.",
    question: 'Which section feels the emptiest to you?',
    reply:
      "Spacing is doing a job here, but let's make sure it's landing right. Which section feels the emptiest? I can add weight there without cramming the rest of the page.",
    risk: 'low',
  },
  {
    slug: 'it-feels-too-busy',
    triggers: [
      'it feels too busy', "there's too much going on",
      'feels cluttered', 'too much happening on the page',
    ],
    keywords: ['busy', 'cluttered', 'crowded', 'noisy', 'overwhelming'],
    category: 'taste',
    meaning:
      "Multiple elements are competing for attention at once, so nothing feels like the priority. Usually one or two things need to be quieter, not everything.",
    question: 'If you could only keep three things on this page, what would they be?',
    reply:
      'Fair reaction. If you had to keep only three things on this page, what would they be? I’ll build the hierarchy around those and quiet down the rest.',
    risk: 'medium',
  },
  {
    slug: 'make-it-look-like-that-site',
    triggers: [
      'make it look like that site', "can we copy this website's style",
      'make ours look like theirs', 'style it like this other site',
    ],
    keywords: ['copy', 'reference', 'inspiration', 'style', 'similar'],
    category: 'taste',
    meaning:
      "They've found a reference that communicates a feeling they want, even if the industries don't match. Usually they want the mood, not a literal copy.",
    question: 'What specifically draws you to it: the layout, the colours, or the tone?',
    reply:
      "That's a useful reference. What exactly draws you to it: the layout, the colours, or the tone of the copy? I'll borrow that feeling without duplicating their design outright.",
    risk: 'medium',
  },
  {
    slug: 'needs-more-wow-factor',
    triggers: [
      'it needs more wow factor', 'can we add some wow factor',
      'make it more impressive', 'needs a bigger first impression',
    ],
    keywords: ['wow', 'impressive', 'impact', 'impression', 'standout'],
    category: 'taste',
    meaning:
      "They want a stronger first five seconds, usually meaning the hero section. This is solvable with one bold move, not more effects everywhere.",
    question: 'What’s the one thing you want a first-time visitor to feel immediately?',
    reply:
      "Let's make that first moment count. What's the one feeling you want a new visitor to have in the first five seconds? I'll build the hero section around that single impression.",
    risk: 'medium',
  },
  {
    slug: 'jazz-it-up',
    triggers: [
      'can you jazz it up', 'just jazz it up a bit',
      'spice it up somehow', 'give it some more flair',
    ],
    keywords: ['jazz', 'flair', 'spice', 'liven', 'energy'],
    category: 'taste',
    meaning:
      "A vague ask for more visual energy without any target in mind. Without a focus, this can turn into endless small tweaks with no clear finish line.",
    question: 'Which section should get that extra flair first?',
    reply:
      "Happy to add some flair. Which section should I focus that energy on first, so we're not touching everything at once? Once that lands, we can decide if more is needed elsewhere.",
    risk: 'medium',
  },
  {
    slug: 'its-too-corporate',
    triggers: [
      "it's too corporate", 'feels too corporate',
      'too stiff and corporate', 'feels like a big company site',
    ],
    keywords: ['corporate', 'stiff', 'formal', 'impersonal', 'generic'],
    category: 'taste',
    meaning:
      "They want the brand to feel more human and less like a template. This is usually fixed with photography, copy voice, and colour, not a structural rebuild.",
    question: 'Where does it feel most generic to you: the words, the photos, or the layout?',
    reply:
      "Good instinct to flag. Where does it feel most corporate to you: the words, the photos, or the layout? I'll target that specifically instead of loosening the whole design.",
    risk: 'medium',
  },
  {
    slug: 'doesnt-feel-like-us',
    triggers: [
      "it doesn't feel like us", "this isn't very us",
      "doesn't feel like our brand", 'not really our vibe',
    ],
    keywords: ['brand', 'vibe', 'identity', 'voice', 'personality'],
    category: 'taste',
    meaning:
      "The design is technically fine but doesn't match how they see themselves. This gap is almost always about tone, not layout or colour choice.",
    question: 'If your brand were a person, how would you describe them in three words?',
    reply:
      "That's useful to know before we go further. If your brand were a person, how would you describe them in three words? I'll use that to steer tone, imagery, and copy together.",
    risk: 'medium',
  },
  {
    slug: 'make-it-cleaner',
    triggers: [
      'make it cleaner', "can we simplify this",
      'it needs to be cleaner', 'tidy up the design a bit',
    ],
    keywords: ['clean', 'simplify', 'tidy', 'minimal', 'declutter'],
    category: 'taste',
    meaning:
      "They want less visual noise but are trusting you to decide what to cut. This is a genuine editing opportunity, not just a style preference.",
    question: 'Is there a specific section that feels the most cluttered to you?',
    reply:
      "Happy to tighten it up. Is there a section that feels most cluttered, or should I take a pass at the whole page? I'll show a before-and-after so nothing gets lost by accident.",
    risk: 'low',
  },
  {
    slug: 'see-a-few-more-options',
    triggers: [
      'can we see a few more options', 'can you show more directions',
      "let's see some more concepts", 'can we get a couple more options',
    ],
    keywords: ['options', 'concepts', 'directions', 'alternatives', 'variations'],
    category: 'taste',
    meaning:
      "They're not confident committing to one direction yet and want a wider comparison. Reasonable once, but it can quietly turn into unpaid extra rounds.",
    question: "What's missing from this concept that would help you decide?",
    reply:
      "Happy to explore further. What's missing from this direction that's making it hard to decide? If it's within the current scope I'll add options; if it's a bigger pivot, I'll scope that as an add-on.",
    risk: 'medium',
  },
  {
    slug: 'liked-the-first-version-better',
    triggers: [
      'i liked the first version better', 'can we go back to the original',
      'the first draft was better', "let's revert to the earlier version",
    ],
    keywords: ['revert', 'original', 'earlier', 'previous', 'firstdraft'],
    category: 'taste',
    meaning:
      "Later changes solved a specific problem but cost something they valued in the first pass. It's rarely an all-or-nothing choice between the two.",
    question: 'What specifically did the first version have that this one is missing?',
    reply:
      "Good to know before we lock anything in. What specifically did the first version get right that this one lost? I can usually bring that piece back without giving up the fix we made after.",
    risk: 'low',
  },
];
