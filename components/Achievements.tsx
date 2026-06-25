'use client'

import FadeIn from './FadeIn'

const achievements = [
  {
    label: 'Congressional Art Competition',
    detail: "Recognized at the 2025 Congressional Art Competition, California's 15th District. Selected from entries across the district.",
  },
  {
    label: 'Showcase Exhibitor',
    detail: 'The Yard Coffee in Redwood City. Curated group show of original charcoal works.',
  },
  {
    label: 'Award of Excellence, San Mateo County',
    detail: 'Recognized at the county level for outstanding artistic achievement.',
  },
]

export default function Achievements() {
  return (
    <section id="achievements" className="bg-black py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="mb-16">
          <div className="flex items-start gap-6">
            <div className="hidden md:flex flex-col justify-start pt-3 flex-shrink-0">
              <span
                className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Recognition
              </span>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-3 md:hidden">Recognition</p>
              <h2 className="font-serif text-[clamp(4.5rem,14vw,11rem)] leading-[0.85] text-white">
                AWARDS
              </h2>
            </div>
          </div>
        </FadeIn>

        <div>
          {achievements.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="relative border-t border-white/10 py-12">
                {/* Huge number in background */}
                <span
                  className="absolute top-4 right-0 font-serif leading-none text-white/[0.04] select-none pointer-events-none"
                  style={{ fontSize: 'clamp(6rem,18vw,14rem)' }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 flex flex-col md:flex-row md:gap-16">
                  <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4 md:mb-0 md:w-12 flex-shrink-0 pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1] text-white mb-4">
                      {item.label}
                    </p>
                    <p className="font-sans text-sm text-white/45 leading-relaxed max-w-xl">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  )
}
