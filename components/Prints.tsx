'use client'

import { useState } from 'react'
import FadeIn from './FadeIn'

const noiseUrl =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const printPreviews = [
  {
    id: 1,
    title: 'Quiet Study',
    gradient: 'from-[#181614] via-[#26221e] to-[#121010]',
    file: 'quiet-study.jpg',
  },
  {
    id: 2,
    title: 'Portrait I',
    gradient: 'from-[#1e1a14] via-[#2e2418] to-[#14100c]',
    file: 'portrait-i.jpg',
  },
  {
    id: 3,
    title: 'Golden Hour',
    gradient: 'from-[#1e1a10] via-[#2a2414] to-[#120e08]',
    file: 'golden-hour.jpg',
  },
]

export default function Prints() {
  const [emails, setEmails] = useState<Record<number, string>>({})
  const [notified, setNotified] = useState<Record<number, boolean>>({})

  const handleNotify = (id: number) => {
    if (emails[id]?.includes('@')) {
      setNotified((prev) => ({ ...prev, [id]: true }))
    }
  }

  return (
    <section id="prints" className="bg-ink-light py-28 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">Shop</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-parchment mb-5 leading-tight">
            Own the Original.<br className="hidden sm:block" /> Or the Next Best Thing.
          </h2>
          <p className="font-sans text-sm text-parchment-dim leading-relaxed max-w-md">
            Select pieces are available as high-quality prints through Printful. Shop coming soon —
            leave your email below to be first to know.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {printPreviews.map((print, i) => (
            <FadeIn key={print.id} delay={i * 0.1}>
              <div className="border border-ink-border hover:border-gold/20 transition-colors duration-400 flex flex-col">
                {/* Artwork preview */}
                <div
                  className={`aspect-[4/5] relative overflow-hidden bg-gradient-to-br ${print.gradient}`}
                >
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{ backgroundImage: noiseUrl }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="font-sans text-[8px] tracking-widest uppercase text-parchment/20 bg-ink/50 px-2 py-1">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 bg-ink-light flex flex-col gap-4">
                  <p className="font-serif text-lg text-parchment">{print.title}</p>

                  {notified[print.id] ? (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      <p className="font-sans text-xs text-gold tracking-wide">
                        You're on the list.
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={emails[print.id] ?? ''}
                        onChange={(e) =>
                          setEmails((prev) => ({ ...prev, [print.id]: e.target.value }))
                        }
                        className="flex-1 bg-ink-mid border border-ink-border text-parchment placeholder-parchment-mute font-sans text-xs px-3 py-2.5 focus:outline-none focus:border-gold/40 transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleNotify(print.id)}
                      />
                      <button
                        onClick={() => handleNotify(print.id)}
                        className="font-sans text-[10px] tracking-widest uppercase px-3 py-2.5 border border-ink-border text-parchment-dim hover:text-parchment hover:border-gold/35 transition-colors whitespace-nowrap"
                      >
                        Notify Me
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
