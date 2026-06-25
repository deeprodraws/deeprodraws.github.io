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
    <section id="about" className="bg-white py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-6 md:gap-10">
          {/* Rotated label */}
          <div className="hidden md:flex flex-col justify-start pt-3 flex-shrink-0">
            <span
              className="font-sans text-[9px] tracking-[0.4em] uppercase text-black/25"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              About
            </span>
          </div>

          <div className="flex-1">
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-black/30 mb-8 md:hidden">About</p>

            {/* Pull quote */}
            <FadeIn>
              <blockquote className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-black mb-12">
                I draw what the camera can't capture.
              </blockquote>
            </FadeIn>

            <div className="w-full h-[3px] bg-black mb-12" />

            <FadeIn delay={0.1}>
              <div className="grid md:grid-cols-2 gap-10">
                <p className="font-sans text-lg text-black/65 leading-[1.7]">
                  I'm Deepro, a charcoal artist based in Belmont, CA. I draw portraits by hand. People, pets, landscapes, the moments worth keeping. No shortcuts, no filters. Just paper, charcoal, and what's real.
                </p>

                <div className="space-y-4">
                  {facts.map((fact, i) => (
                    <div key={i} className="flex items-center gap-3 border-b border-black/10 pb-4 last:border-0 last:pb-0">
                      <span className="font-sans text-[10px] tracking-[0.3em] text-black/25 w-8 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-sm text-black/70 font-medium">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
