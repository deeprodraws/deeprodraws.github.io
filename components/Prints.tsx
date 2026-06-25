'use client'

import Link from 'next/link'
import FadeIn from './FadeIn'
import { prints } from '@/data/prints'

export default function Prints() {
  return (
    <section id="prints" className="bg-black py-24 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-14">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">Prints</p>
          <h2 className="font-serif text-[clamp(4.5rem,14vw,11rem)] leading-[0.85] text-white">
            TAKE ONE HOME
          </h2>
          <p className="font-sans text-sm text-white/45 leading-relaxed mt-5 max-w-md">
            Original charcoal artwork available as high-quality prints, fulfilled through Printful.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {prints.map((print, i) => (
            <FadeIn key={print.slug} delay={i * 0.08} scale>
              <div className="group overflow-hidden">
                <div className={`${print.aspectClass} relative overflow-hidden`}>
                  <img
                    src={`/images/${print.image}`}
                    alt={print.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="pt-4 pb-2 flex items-center justify-between">
                  <p className="font-sans text-sm font-semibold text-white">{print.title}</p>
                  <Link
                    href={`/prints/${print.slug}`}
                    className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 hover:text-white border-b border-white/20 hover:border-white/60 pb-px transition-colors min-h-[44px] flex items-center"
                  >
                    Order Print
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
