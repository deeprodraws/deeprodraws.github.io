/**
 * All available prints.
 *
 * To add a new print:
 *   1. Add an entry to this array.
 *   2. Add mockup images to /public/images/mockups/<slug>/ (mockup-1.jpeg, mockup-2.jpeg, …)
 *      Leave `mockups: []` to use the artwork image as a placeholder until real mockups are ready.
 *   3. That's it — the index and detail pages update automatically.
 */

/** @type {Array<{
 *   slug: string,
 *   title: string,
 *   image: string,
 *   aspectClass: string,
 *   description: string,
 *   startingPrice: string,
 *   mockups: string[]
 * }>} */
export const prints = [
  {
    slug: 'bowed',
    title: 'Bowed',
    image: 'jesus_down.jpeg',
    aspectClass: 'aspect-[4/5]',
    description: '',
    startingPrice: '',
    mockups: ['mockup-1.jpg', 'mockup-2.jpg', 'mockup-3.jpg'],
  },
  {
    slug: 'eagle',
    title: 'Eagle',
    image: 'eagle.jpeg',
    aspectClass: 'aspect-[5/6]',
    description: '',
    startingPrice: '',
    mockups: ['mockup-1.jpg', 'mockup-2.jpg', 'mockup-3.jpg'],
  },
  {
    slug: 'puma',
    title: 'Where the Forest Holds its Breath',
    image: 'puma.jpeg',
    aspectClass: 'aspect-[4/5]',
    description: '',
    startingPrice: '',
    mockups: ['mockup-1.jpg', 'mockup-2.jpg', 'mockup-3.jpg'],
  },
]
