# DeeproDraws

Charcoal portrait artist site — Next.js 14, Tailwind CSS, Framer Motion, deployed to GitHub Pages as a static export.

---

## Adding a New Print

All print data lives in **`/data/prints.js`**. Adding a new print requires two steps and zero component changes.

### Step 1 — Add an entry to `/data/prints.js`

```js
{
  slug: 'your-print-slug',        // URL-safe identifier, used in /prints/[slug]
  title: 'Your Print Title',      // Displayed on cards and the detail page
  image: 'your_image.jpeg',       // Filename inside /public/images/
  aspectClass: 'aspect-[3/4]',   // Tailwind aspect ratio class for the card
  description: 'Optional short description shown on the detail page.',
  startingPrice: '$45',           // e.g. '$45' — leave '' to show "Pricing confirmed after inquiry"
  mockups: ['mockup-1.jpeg', 'mockup-2.jpeg'],  // Leave [] to use the artwork as placeholder
},
```

Common `aspectClass` values: `aspect-[3/4]` (portrait), `aspect-[4/5]`, `aspect-[5/6]`, `aspect-[4/3]` (landscape).

### Step 2 — Add mockup images (optional)

Put mockup images in:
```
/public/images/mockups/<slug>/mockup-1.jpeg
/public/images/mockups/<slug>/mockup-2.jpeg
...
```

If `mockups: []`, the gallery on the detail page falls back to the artwork image automatically. Swap in real mockups whenever they're ready — just add the files and update the `mockups` array.

### That's it

The print appears automatically on:
- The **`/prints`** index page
- The **`/prints/<slug>`** detail page
- The **Prints section** on the main homepage

---

## Development

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Static export to /out
```

Deployed as a static site (`output: 'export'`) to GitHub Pages.
