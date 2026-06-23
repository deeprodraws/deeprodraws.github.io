'use client'

import FadeIn from './FadeIn'

const noiseUrl =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const facts = [
  'Based in Belmont, CA',
  'Congressional Art Competition 2025, CA-15',
  'Custom commissions open',
  'Pet portraits a specialty',
]

export default function About() {
  return (
    <section id="about" className="bg-ink py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Photo placeholder */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-ink-mid via-[#1e1a14] to-ink-light">
                <div
                  className="absolute inset-0 opacity-25"
                  style={{ backgroundImage: noiseUrl }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Placeholder label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-sans text-[9px] tracking-widest text-white/15 uppercase">
                    photo-of-deepro.jpg
                  </p>
                </div>
              </div>
              {/* Offset accent border */}
              <div className="absolute -bottom-5 -right-5 w-full h-full border border-gold/15 -z-10 pointer-events-none" />
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn direction="left" delay={0.15}>
            <div>
              <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-6">
                About
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-parchment mb-8 leading-tight">
                Deepro C.
              </h2>
              <p className="font-serif text-[1.1rem] text-parchment-dim leading-[1.8] mb-10 italic">
                "I'm Deepro C., a charcoal artist from Belmont, CA. I draw portraits by hand —
                people, pets, landscapes, and moments that deserve to be remembered. No shortcuts,
                no filters. Just paper, charcoal, and something true."
              </p>

              <div className="border-t border-ink-border pt-8 space-y-3.5">
                {facts.map((fact, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="font-sans text-sm text-parchment-dim">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
