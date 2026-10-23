import catalog from '@/server/catalog.json'

/**
 * Prints for sale on the website.
 *
 * Two files work together:
 *   - server/catalog.json (written by `npm run sync-products` in the server
 *     folder) holds each print's id, title, description, sizes, and prices,
 *     all copied from Printify. The server charges from the same file, so the
 *     site and the checkout always agree.
 *   - The list below holds only the pictures for each print: its image and
 *     any mockups.
 *
 * To put a print on the site:
 *   1. Add an entry below. Its `id` must match an "id" in server/catalog.json.
 *   2. Put its artwork in /public/images/, and any mockups in
 *      /public/images/mockups/<id>/ (mockup-1.jpg, mockup-2.jpg, ...).
 *      Leave `mockups: []` to show the artwork until mockups are ready.
 *
 * If an id doesn't match the catalog, or that print isn't for sale, the
 * website refuses to build and says which one. That way a typo can never
 * reach customers as a Buy button that silently fails.
 */
const siteDetails = [
  {
    id: 'eagle',
    image: 'prints/eagle.jpg',
    aspectClass: 'aspect-[4/5]',
    mockups: ['mockup-1.jpg', 'mockup-2.jpg', 'mockup-3.jpg'],
  },
  {
    id: 'dog',
    image: 'prints/dog.jpg',
    aspectClass: 'aspect-[4/5]',
    mockups: [],
  },
  {
    id: 'cat-in-a-basket',
    image: 'prints/cat-in-a-basket.jpg',
    aspectClass: 'aspect-[4/5]',
    mockups: [],
  },
  {
    id: 'still-life',
    image: 'prints/still-life.jpg',
    aspectClass: 'aspect-[4/5]',
    mockups: [],
  },
  {
    id: 'mountain-landscape',
    image: 'prints/mountain-landscape.jpg',
    aspectClass: 'aspect-[5/4]',
    mockups: [],
  },
]

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`

/** @type {Array<{
 *   slug: string,
 *   title: string,
 *   image: string,
 *   aspectClass: string,
 *   description: string[],
 *   mockups: string[],
 *   sizes: Array<{ key: string, label: string, priceCents: number, price: string }>,
 *   startingPrice: string
 * }>} */
export const prints = siteDetails.map((details) => {
  const entry = catalog.find((item) => item.id === details.id)
  if (!entry) {
    throw new Error(`data/prints.js: "${details.id}" is not in server/catalog.json. Check the spelling.`)
  }
  if (entry.forSale === false) {
    throw new Error(`data/prints.js: "${details.id}" is marked "forSale": false in server/catalog.json.`)
  }

  const sizes = Object.entries(entry.sizes).map(([key, size]) => ({
    key,
    label: size.label,
    priceCents: size.priceCents,
    price: formatPrice(size.priceCents),
  }))
  if (sizes.length === 0) {
    throw new Error(`data/prints.js: "${details.id}" has no sizes in server/catalog.json.`)
  }

  return {
    ...details,
    slug: entry.id,
    title: entry.title,
    description: entry.description ?? [],
    sizes,
    startingPrice: formatPrice(Math.min(...sizes.map((size) => size.priceCents))),
  }
})

/** The first mockup if there is one, otherwise the artwork itself. */
export function coverImage(print) {
  return print.mockups.length > 0
    ? `/images/mockups/${print.slug}/${print.mockups[0]}`
    : `/images/${print.image}`
}
