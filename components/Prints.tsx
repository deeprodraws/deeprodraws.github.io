'use client'

import FadeIn from './FadeIn'

const printPreviews = [
  { id: 1, title: 'Portrait Study',       file: 'portrait_study.jpeg',       aspectClass: 'aspect-[3/4]' },
  { id: 2, title: 'Eagle',                file: 'eagle.jpeg',                aspectClass: 'aspect-[5/6]' },
  { id: 3, title: 'What Awaits You Here', file: 'foggy_hills_landscape.jpeg', aspectClass: 'aspect-[4/3]' },
]

export default function Prints() {
  return (
    <section id="prints" className="bg-ink-light py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">Prints</p>
          <h2 className="font-serif text-7xl md:text-9xl text-parchment mb-5 leading-none">
            Take One Home
          </h2>
          <p className="font-sans text-base text-parchment-dim leading-relaxed max-w-md">
            Original charcoal artwork available as high-quality prints, fulfilled through Printful.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {printPreviews.map((print, i) => (
            <FadeIn key={print.id} delay={i * 0.1}>
              <div className="border-2 border-ink-border hover:border-gold/20 transition-colors duration-400 flex flex-col">
                <div className={`${print.aspectClass} relative overflow-hidden`}>
                  <img
                    src={`/images/${print.file}`}
                    alt={print.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 bg-ink-light flex flex-col gap-4">
                  <p className="font-sans text-base font-semibold text-parchment">{print.title}</p>
                  <a
                    href="/prints"
                    className="font-sans text-[10px] tracking-widest uppercase px-3 py-2.5 border-2 border-ink-border text-parchment-dim hover:text-parchment hover:border-gold/35 transition-colors text-center"
                  >
                    Order Print
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
