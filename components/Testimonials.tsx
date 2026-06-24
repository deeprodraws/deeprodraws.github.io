'use client'

import FadeIn from './FadeIn'

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-ink py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">
            Testimonial
          </p>
          <h2 className="font-serif text-7xl md:text-9xl text-parchment leading-none">
            People Say
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-2 border-2 border-ink-border overflow-hidden">
            {/* Image */}
            <div className="aspect-[3/4] md:aspect-auto relative overflow-hidden">
              <img
                src="/images/basketball.jpeg"
                alt="Above the Rim"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Quote */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-ink-light">
              <span className="font-sans text-6xl leading-none text-gold/30 mb-4 block select-none">
                "
              </span>
              <p className="font-sans text-lg text-parchment leading-relaxed mb-8">
                Deepro's piece is a demonstration of inspiration through portraying such a captivating art form of a basketball player, it truly inspires me to pursue my dreams and fulfill my potential.
              </p>
              <div className="border-t-2 border-ink-border pt-6">
                <p className="font-sans text-base font-semibold text-parchment">Salem Swift</p>
                <p className="font-sans text-sm text-parchment-dim mt-0.5">Charcoal Portrait Client</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
