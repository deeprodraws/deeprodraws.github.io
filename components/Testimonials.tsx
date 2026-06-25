'use client'

import FadeIn from './FadeIn'

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white overflow-hidden">
      <FadeIn>
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          {/* Image — full height */}
          <div className="relative min-h-[60vw] md:min-h-0">
            <img
              src="/images/basketball.jpeg"
              alt="Above the Rim"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Quote panel — black */}
          <div className="bg-black flex flex-col justify-center px-8 md:px-14 py-16">
            <span className="font-serif leading-none text-white/20 select-none block -mb-6" style={{ fontSize: 'clamp(5rem,12vw,9rem)' }}>
              "
            </span>
            <p className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] text-white leading-[1.25] mb-10">
              Deepro's piece is a demonstration of inspiration through portraying such a captivating art form of a basketball player, it truly inspires me to pursue my dreams and fulfill my potential.
            </p>
            <div className="border-t border-white/10 pt-6">
              <p className="font-sans text-base font-semibold text-white">Salem Swift</p>
              <p className="font-sans text-xs text-white/40 mt-1 tracking-[0.2em] uppercase">Charcoal Portrait Client</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
