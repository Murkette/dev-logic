export type MatchCase = { text: string; expectedSlug: string | null };

// ≥40 paraphrases (not verbatim triggers) mapped to the phrase they should resolve to.
export const PARAPHRASE_CASES: MatchCase[] = [
  { text: 'the homepage really needs more punchy energy', expectedSlug: 'make-it-pop' },
  { text: "I'm honestly unsure, can you give me a few options to look at", expectedSlug: 'know-it-when-i-see-it' },
  { text: 'the spacing and alignment on this section feels off', expectedSlug: 'something-feels-off' },
  { text: 'the brand doesn’t feel prominent enough, can the logo be bigger', expectedSlug: 'make-the-logo-bigger' },
  { text: 'this feels pretty dated, can we get a more modern and fresh look', expectedSlug: 'make-it-more-modern' },
  { text: 'it just feels a bit dull and boring, needs more personality', expectedSlug: 'too-plain-or-boring' },
  { text: 'can it feel more playful and fun instead of so serious', expectedSlug: 'make-it-more-fun' },
  { text: 'we want it to feel more premium and luxury, like a high end brand', expectedSlug: 'make-it-look-premium' },
  { text: "not loving the colour palette, can we look at a different hue", expectedSlug: 'not-sure-about-colours' },
  { text: 'the typeface feels off, can we look at a different font', expectedSlug: 'try-a-different-font' },
  { text: "there's a lot of empty whitespace and gaps, feels too sparse", expectedSlug: 'too-much-white-space' },
  { text: 'the page feels crowded and noisy, too much going on', expectedSlug: 'it-feels-too-busy' },
  { text: 'can we use this other site as a style reference', expectedSlug: 'make-it-look-like-that-site' },
  { text: 'we need a stronger first impression, more visual impact', expectedSlug: 'needs-more-wow-factor' },
  { text: 'can you add some flair and liven it up a bit', expectedSlug: 'jazz-it-up' },
  { text: 'it feels stiff and impersonal, too corporate and generic', expectedSlug: 'its-too-corporate' },
  { text: "this doesn't match our brand voice or personality at all", expectedSlug: 'doesnt-feel-like-us' },
  { text: 'can we simplify and declutter the design to make it cleaner', expectedSlug: 'make-it-cleaner' },
  { text: 'can you show a couple more concepts or alternative directions', expectedSlug: 'see-a-few-more-options' },
  { text: 'I think the earlier draft and original direction was better, can we revert', expectedSlug: 'liked-the-first-version-better' },
  { text: 'can we see a mockup before any deposit or upfront payment', expectedSlug: 'see-it-before-deposit' },
  { text: 'my previous designer just vanished and stopped replying, so unreliable', expectedSlug: 'designer-disappeared' },
  { text: "we'd like the source files and full ownership at handoff", expectedSlug: 'just-send-me-the-files' },
  { text: "just confirming we get full ownership and rights once it's done", expectedSlug: 'who-owns-the-site' },
  { text: 'can I get full admin access and the login credentials', expectedSlug: 'admin-login' },
  { text: 'is the contract and legal agreement really necessary paperwork', expectedSlug: 'do-we-need-a-contract' },
  { text: 'how can I be sure this brings in real customers and leads', expectedSlug: 'will-this-get-me-customers' },
  { text: 'can you guarantee our search ranking and seo results', expectedSlug: 'guarantee-page-one-of-google' },
  { text: "can we get a rough sketch or preview mockup before we decide", expectedSlug: 'quick-mockup-first' },
  { text: "we've felt pretty burned and wary from a bad experience before", expectedSlug: 'been-burned-before' },
  { text: 'could we get a testimonial or reference from a past client', expectedSlug: 'talk-to-a-past-client' },
  { text: 'why do you need dns and registrar access to our domain', expectedSlug: 'domain-login' },
  { text: "will you subcontract or outsource part of this project", expectedSlug: 'are-you-outsourcing-this' },
  { text: "what's the process if we're unhappy and need more revisions", expectedSlug: 'what-if-i-dont-like-it' },
  { text: "just a minor tweak, shouldn't be a big change right", expectedSlug: 'just-a-small-change' },
  { text: 'can we also add an online shop and booking system', expectedSlug: 'add-a-blog-shop-booking' },
  { text: "since you're already in there can you fix this other extra thing", expectedSlug: 'while-youre-in-there' },
  { text: "we've already used our revision rounds, can we get another round", expectedSlug: 'one-more-round-of-revisions' },
  { text: 'could you also write the copywriting and text content for the pages', expectedSlug: 'can-you-write-the-copy-too' },
  { text: 'can we get a logo and full branding identity designed too', expectedSlug: 'can-you-do-the-logo-too' },
  { text: 'can we include a few more additional pages in the sitemap', expectedSlug: 'add-a-few-more-pages' },
  { text: 'could you configure our business inbox and email setup too', expectedSlug: 'set-up-my-email-too' },
  { text: 'we want ongoing instagram and social media graphics templates', expectedSlug: 'do-our-social-graphics' },
  { text: 'I assumed this was already included and part of the package', expectedSlug: 'i-thought-that-was-included' },
  { text: 'can we scrap this and pivot to a completely fresh restart', expectedSlug: 'start-over-new-direction' },
];

// ≥10 longer, email-shaped inputs containing one recognisable ask.
export const LONG_INPUT_CASES: MatchCase[] = [
  {
    text: "Hey! Hope you're doing well. I looked at the new homepage over the weekend and something about it just feels a little too corporate and stiff for our brand. Can we make it feel more human?",
    expectedSlug: 'its-too-corporate',
  },
  {
    text: "Thanks so much for the draft! Quick question though — my nephew took a look last night, and so did a friend of mine, and they both think the logo should really be bigger on the page.",
    expectedSlug: 'brother-nephew-friend-thinks',
  },
  {
    text: "Just wanted to check in on where things stand. It feels like it's been a while since the last update, and I'm wondering why this is taking so long compared to what we discussed at the start.",
    expectedSlug: 'why-is-it-taking-so-long',
  },
  {
    text: 'We had our whole team look at the latest version during our meeting yesterday. Honestly, everyone in the office has thoughts and opinions, and they did not all agree with each other.',
    expectedSlug: 'everyone-in-office-has-thoughts',
  },
  {
    text: 'I wanted to flag something that has been bothering me. My wife took a look over my shoulder last night and said she really does not like the colour we picked for the buttons.',
    expectedSlug: 'wife-husband-doesnt-like-colour',
  },
  {
    text: 'Quick update from our side: we spoke with our investor yesterday about the new direction, and our investor raised some real concerns about the homepage messaging before we go further.',
    expectedSlug: 'investor-thinks',
  },
  {
    text: 'So, we ran the new design by a few of our regular customers this week just to get a read on it, and honestly the customer feedback was really useful and mostly positive.',
    expectedSlug: 'showed-it-to-customers',
  },
  {
    text: "One more thing before I forget — I haven't received any of the emails from the site's contact form, and I've even checked my spam folder with nothing there.",
    expectedSlug: 'not-getting-contact-form-emails',
  },
  {
    text: "We're getting close to launch, but I'll be honest, I'm feeling pretty unsure and hesitant about the whole direction as we get close to launch.",
    expectedSlug: 'not-sure-about-it-anymore',
  },
  {
    text: "Just so you know where our heads are at: we'd really like to hold off until it's perfect before anything goes live, even if that means waiting a bit longer than planned.",
    expectedSlug: 'hold-off-until-perfect',
  },
  {
    text: 'The team spent some time this week looking at competitor sites, and a competitor just relaunched their entire site with a totally new look, which has us wondering if we should rethink our approach.',
    expectedSlug: 'competitor-just-relaunched',
  },
  {
    text: 'We ran into an issue this morning — the whole site appears to be down and offline for everyone, and a few customers have already messaged us confused about it.',
    expectedSlug: 'the-site-is-down',
  },
];

// ≥20 negatives that must return no-match.
export const NEGATIVE_CASES: MatchCase[] = [
  { text: 'asdf qwer zxcv', expectedSlug: null },
  { text: 'xyzzy plugh wibble nnnnn', expectedSlug: null },
  { text: 'the quick brown fox jumps over a lazy dog', expectedSlug: null },
  { text: 'what time does the bakery open on sundays', expectedSlug: null },
  { text: 'purple elephants dance quietly under the moon', expectedSlug: null },
  { text: 'thank you so much for your help today', expectedSlug: null },
  { text: 'see you at the conference next month', expectedSlug: null },
  { text: 'the weather has been really nice this week', expectedSlug: null },
  { text: '12345 67890 54321', expectedSlug: null },
  { text: 'logo', expectedSlug: null },
  { text: 'banana', expectedSlug: null },
  { text: 'hello', expectedSlug: null },
  { text: 'um, like, maybe', expectedSlug: null },
  { text: 'please just um', expectedSlug: null },
  { text: 'asdfghjkl qwertyuiop zxcvbnm', expectedSlug: null },
  { text: 'lorem ipsum dolor sit amet consectetur adipiscing elit', expectedSlug: null },
  { text: 'my dog needs a walk this afternoon', expectedSlug: null },
  { text: 'can you recommend a good pizza place nearby', expectedSlug: null },
  { text: 'the train was late again this morning', expectedSlug: null },
  { text: 'she plays the violin every tuesday evening', expectedSlug: null },
  { text: '!!! ??? ...', expectedSlug: null },
  { text: 'zzz zzz zzz', expectedSlug: null },
];

export const LITERAL_CASES: MatchCase[] = [
  { text: 'make it pop', expectedSlug: 'make-it-pop' },
];

export const CASES: MatchCase[] = [
  ...PARAPHRASE_CASES,
  ...LONG_INPUT_CASES,
  ...NEGATIVE_CASES,
];
