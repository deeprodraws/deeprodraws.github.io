'use client'

import FadeIn from './FadeIn'

const testimonials = [
  {
    quote:
      "Deepro captured something I couldn't put into words. My dog's portrait brought me to tears — it's exactly him. The texture, the eyes. I don't know how he does it.",
    name: 'Sarah M.',
    location: 'San Francisco, CA',
  },
  {
    quote:
      "I commissioned a portrait of my grandmother for her 80th birthday. Deepro handled every detail thoughtfully and delivered something truly timeless. It now hangs in her living room.",
    name: 'James T.',
    location: 'Los Angeles, CA',
  },
  {
    quote:
      'The process was smooth, communication was excellent, and the final piece exceeded everything I hoped for. A genuinely gifted artist — and a lovely person to work with.',
    name: 'Priya K.',
    location: 'Cupertino, CA',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-ink py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-20">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">Words</p>
          <h2 className="font-serif text-5xl md:text-7xl text-parchment leading-none">
            From Collectors
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="border border-ink-border hover:border-gold/15 transition-colors duration-500 p-8 flex flex-col h-full">
                <span className="font-serif text-5xl leading-none text-gold/30 mb-5 select-none">
                  "
                </span>
                <p className="font-serif text-[0.95rem] leading-[1.85] text-parchment-dim italic flex-1">
                  {t.quote}
                </p>
                <div className="mt-8 pt-6 border-t border-ink-border">
                  <p className="font-sans text-sm text-parchment font-medium">{t.name}</p>
                  <p className="font-sans text-xs text-parchment-mute mt-0.5">{t.location}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
