'use client'

import FadeIn from './FadeIn'

const achievements = [
  {
    label: 'Congressional Art Competition',
    detail:
      "Recognized at the 2025 Congressional Art Competition — California's 15th District. Selected from entries across the district.",
  },
  {
    label: 'Showcase Exhibitor',
    detail:
      'The Yard Coffee, Redwood City — curated gallery showcase featuring original charcoal works.',
  },
  {
    label: 'National Reach',
    detail: 'Commissions fulfilled across the United States for individuals, families, and pet owners.',
  },
]

export default function Achievements() {
  return (
    <section id="achievements" className="bg-ink-light py-28 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="mb-20">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">
            Recognition
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-parchment leading-none">Notable</h2>
        </FadeIn>

        <div>
          {achievements.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group py-9 border-t border-ink-border flex flex-col md:flex-row md:items-start md:gap-12 hover:border-gold/25 transition-colors duration-500">
                {/* Index */}
                <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-parchment-mute mb-3 md:mb-0 md:w-14 flex-shrink-0 pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <p className="font-serif text-2xl md:text-3xl text-parchment mb-3 leading-snug">
                    {item.label}
                  </p>
                  <p className="font-sans text-sm text-parchment-dim leading-relaxed max-w-xl">
                    {item.detail}
                  </p>
                </div>

                {/* Expanding accent */}
                <div className="hidden md:flex items-center pt-2">
                  <div className="w-6 h-px bg-ink-border group-hover:w-12 group-hover:bg-gold transition-all duration-500" />
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-ink-border" />
        </div>
      </div>
    </section>
  )
}
