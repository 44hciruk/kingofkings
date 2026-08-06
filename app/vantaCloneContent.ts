// Stage 1 (exact Vanta clone) neutral placeholder copy. Structurally
// equivalent to the reference's own copy — same line-break shape, word
// count, and reveal grouping — but not a verbatim reproduction of Vanta's
// text, and not yet KING OF KINGS content either. Real KING OF KINGS
// wording replaces this in the Stage 2 copy-only conversion.

export const brand = { name: "BRAND", editionLabel: "Objects¹ — Edition 1", buyLabel: "Buy" };

export const hero = {
  eyebrow: "Objects",
  bodyLines: ["Placeholder assets for designers,", "builders, and ", { accent: "creative" }, " teams."],
};

export const pitch = {
  section: "§02 / THE PITCH",
  headingPlain: "One Object.",
  headingAccent: "Two outputs.",
  body: "Drop an Object into a design tool as a background or fill. Feed the same file to another tool as a style reference. Same library, both jobs.",
  cards: [
    { title: "Design asset", body: "As a background, visual element, scroll driven animations. Plug it in quickly." },
    { tag: "014", code: "Ob", label: "NEUTRAL" },
    { title: "As a style reference", body: "Feed it to a generator as a look and feel guide. Consistent results, every time." },
  ],
};

export const library = {
  section: "§03 / THE LIBRARY",
  headingPlain: "160 Objects.",
  headingAccent: "One library.",
  body: "160 abstract visuals in three formats — stills, loops, and transparent PNGs. Yours to apply across everything you make.",
  panelTitle: "Objects¹",
  tabs: ["Stills", "Loops", "Templates"],
  meta: [
    { label: "Format:", value: "PNG" },
    { label: "Original resolution:", value: "2048 x 2048" },
    { label: "Colour format:", value: "sRGB" },
    { label: "Licensing:", value: "Personal + Commercial Use" },
  ],
  testimonial: {
    quoteLead: "Every one of the objects in this pack are pristine. Mesmerizing all on their own.",
    quoteRest: "And even more excellent when it's used as a style reference for further prompting and personalizing. Worth every penny.",
    name: "PLACEHOLDER BUYER",
    role: "VERIFIED BUYER",
  },
};

export const recipe = {
  section: "§04 / THE RECIPE",
  headingLines: ["Type something.", "Pick an Object.", "That's the recipe."],
  body: "Objects work as fills. Drop one onto type, vectors, or photos — same workflow, every tool you already use.",
  prompt: "floating glass orb",
};

export const showcase = {
  heading: "A few Objects, on real work.",
  deviceLabel: "Design, build & deploy",
};

export const pricing = {
  heading: "Two ways in.",
  tiers: [
    { name: "Objects¹", price: "$9", featured: true },
    { name: "Dark Objects", price: "Free", featured: false },
  ],
  panelTitle: "Objects¹",
  panelSubtitle: "The full library, 160 specimens.",
  features: ["5x 4K object loops", "3x object designs for web", "9x UI card templates", "Mini guide: Objects in AI", "3 prompts for making your own", "Figma file", "Lifetime updates", "Support"],
  cta: "Get Objects¹ — $9",
  testimonial: {
    quote: "Stunning and thoughtfully curated collection of visuals. Excited to incorporate them into a variety of client projects.",
    name: "PLACEHOLDER BUYER TWO",
    role: "VERIFIED BUYER",
  },
};

export const faq = {
  heading: "FAQ",
  items: [
    { q: "Can I just generate these myself with AI?", a: "Honestly, you can get a frame of approximately equivalent images with prompting and image references, but it's possible. A simple method to do this in the exact asset pack is you can generate an infinite amount of objects." },
    { q: "Is the quality good enough for client work?", a: "Yes — every object in the pack is rendered at production resolution and licensed for commercial client projects." },
    { q: "Do I really need 160 Objects?", a: "No single project needs all 160, but having the full range means you always have the right shape, material, and color on hand." },
    { q: "Can I use these in client and commercial projects?", a: "Yes, both the free pack and Objects¹ are licensed for personal and commercial use in client projects." },
    { q: "What file formats do the Objects come in?", a: "Stills as transparent PNGs, loops as MP4/WebM, and templates as layered project files." },
    { q: "What's the difference between the free pack and Objects¹?", a: "Objects¹ is the full library — 160 stills and 160 loops. The free pack is a 10-object sampler." },
  ],
};

export const footer = {
  wordmark: "OBJECTS",
  madeBy: "Made by Placeholder Studio",
  links: [{ label: "example.com", href: "#" }, { label: "Threads", href: "#" }, { label: "Say hi", href: "#" }],
};
