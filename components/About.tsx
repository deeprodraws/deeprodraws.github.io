'use client'

import FadeIn from './FadeIn'

const facts = [
  'Based in Belmont, CA',
  'Congressional Art Competition 2025, CA-15',
  'Taking commissions now',
  'Pet portraits a specialty',
]

export default function About() {
  return (
    <section id="about" className="bg-ink py-28 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-6">About</p>
          <h2 className="font-serif text-6xl md:text-8xl text-parchment mb-8 leading-none">
            Deepro C.
          </h2>
          <p className="font-sans text-base text-parchment-dim leading-[1.8] mb-10">
            I'm Deepro, a charcoal artist based in Belmont, CA. I draw portraits by hand. People, pets, landscapes, the moments worth keeping. No shortcuts, no filters. Just paper, charcoal, and what's real.
          </p>

          <div className="border-t-2 border-ink-border pt-8 space-y-3.5">
            {facts.map((fact, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                <span className="font-sans text-sm text-parchment-dim">{fact}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
