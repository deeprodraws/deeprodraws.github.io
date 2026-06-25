'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import FadeIn from './FadeIn'

const artworks = [
  { id: 1,  title: 'The Godfather',                     year: '2025', file: 'the_godfather.jpeg',        aspectClass: 'aspect-[5/6]'  },
  { id: 2,  title: 'Crown of Thorns',                   year: '2025', file: 'jesus_crown.jpeg',          aspectClass: 'aspect-[5/7]'  },
  { id: 3,  title: 'Bowed',                             year: '2026', file: 'jesus_down.jpeg',           aspectClass: 'aspect-[4/5]'  },
  { id: 4,  title: 'Portrait Study',                    year: '2025', file: 'portrait_study.jpeg',       aspectClass: 'aspect-[3/4]'  },
  { id: 5,  title: 'Looking Up',                        year: '2026', file: 'looking_up.jpeg',           aspectClass: 'aspect-[3/4]'  },
  { id: 6,  title: 'Eagle',                             year: '2025', file: 'eagle.jpeg',                aspectClass: 'aspect-[5/6]'  },
  { id: 7,  title: "Where the Forest Holds its Breath", year: '2026', file: 'puma.jpeg',                 aspectClass: 'aspect-[4/5]'  },
  { id: 8,  title: 'Above the Rim',                     year: '2026', file: 'basketball.jpeg',           aspectClass: 'aspect-[3/4]'  },
  { id: 9,  title: 'Curled',                            year: '2025', file: 'cat_in_a_basket.jpeg',     aspectClass: 'aspect-[4/5]'  },
  { id: 10, title: 'Food on my Mind',                   year: '2025', file: 'lying_dog.jpeg',            aspectClass: 'aspect-[4/3]'  },
  { id: 11, title: 'Teddy',                             year: '2026', file: 'cavapoo.jpeg',              aspectClass: 'aspect-[4/5]'  },
  { id: 12, title: 'What Awaits You Here',              year: '2025', file: 'foggy_hills_landscape.jpeg', aspectClass: 'aspect-[4/3]' },
  { id: 13, title: 'Snowy Peaks',                       year: '2026', file: 'large_mountain.jpeg',      aspectClass: 'aspect-[4/3]'  },
  { id: 14, title: 'Mountain Landscape',                year: '2025', file: 'mountain_landscape.jpeg',  aspectClass: 'aspect-[3/4]'  },
  { id: 15, title: 'The Overlook',                      year: '2026', file: 'cliff_overlook.jpeg',      aspectClass: 'aspect-[4/3]'  },
]

type Artwork = (typeof artworks)[number]

function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left overflow-hidden focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
      aria-label={`Open ${artwork.title}`}
    >
      <div className={`relative ${artwork.aspectClass} overflow-hidden`}>
        <img
          src={`/images/${artwork.file}`}
          alt={artwork.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 z-10 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-start justify-end p-4">
          <p className="font-sans text-base font-semibold text-white leading-tight">{artwork.title}</p>
          <p className="font-sans text-xs text-white/55 mt-0.5">{artwork.year}</p>
        </div>
      </div>
    </button>
  )
}

function Lightbox({ artworks, index, onClose, onPrev, onNext }: {
  artworks: Artwork[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const artwork = artworks[index]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
      {index > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Previous">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {index < artworks.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Next">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full ${artwork.aspectClass} relative overflow-hidden`}>
          <img src={`/images/${artwork.file}`} alt={artwork.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-sans text-lg font-semibold text-white">{artwork.title}</p>
            <p className="font-sans text-xs text-white/45 mt-0.5">{artwork.year}</p>
          </div>
          <p className="font-sans text-xs text-white/30 flex-shrink-0 mt-1">{index + 1} / {artworks.length}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MobileSwipeGallery({ onOpen }: { onOpen: (i: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const total = artworks.length + 1 // +1 for VIEW ALL card

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const firstCard = el.children[0] as HTMLElement
      if (!firstCard) return
      const cardW = firstCard.offsetWidth
      const gap = 12
      setActiveIndex(Math.min(Math.round(el.scrollLeft / (cardW + gap)), total - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [total])

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    const firstCard = el.children[0] as HTMLElement
    const cardW = firstCard?.offsetWidth ?? 0
    el.scrollTo({ left: i * (cardW + 12), behavior: 'smooth' })
  }

  return (
    <div>
      {/* Scroll track — breakout handled by parent's -mx-6 */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pl-6 scroll-pl-6 pb-3 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {artworks.map((artwork, i) => (
          <button
            key={artwork.id}
            onClick={() => onOpen(i)}
            className="flex-none w-[82vw] snap-start text-left focus-visible:outline-none"
            aria-label={`Open ${artwork.title}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
              <img
                src={`/images/${artwork.file}`}
                alt={artwork.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-2.5">
              <p className="font-sans text-sm font-semibold text-white leading-tight">{artwork.title}</p>
              <p className="font-sans text-xs text-white/45 mt-0.5">{artwork.year}</p>
            </div>
          </button>
        ))}

        {/* VIEW ALL card */}
        <Link href="/gallery" className="flex-none w-[82vw] snap-start">
          <div className="relative aspect-[3/4] border border-white/15 flex flex-col items-center justify-center gap-4 hover:border-white/35 transition-colors duration-150">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/35">
              <rect x="3" y="3" width="7" height="7" rx="0.5" />
              <rect x="14" y="3" width="7" height="7" rx="0.5" />
              <rect x="3" y="14" width="7" height="7" rx="0.5" />
              <rect x="14" y="14" width="7" height="7" rx="0.5" />
            </svg>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/60">View All</p>
          </div>
        </Link>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-[5px] mt-5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-[14px] h-[3px] bg-white'
                : 'w-[3px] h-[3px] bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1)
      if (e.key === 'ArrowRight' && lightboxIndex < artworks.length - 1) setLightboxIndex(lightboxIndex + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <section id="gallery" className="bg-black py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="mb-14">
          <div className="flex items-start gap-6">
            <div className="hidden md:flex flex-col justify-start pt-4">
              <span
                className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Gallery
              </span>
            </div>
            <div>
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-3 md:hidden">Gallery</p>
              <h2 className="font-serif text-[clamp(4.5rem,14vw,11rem)] leading-[0.85] text-white">
                MY WORK
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Mobile: horizontal swipe carousel — -mx-6 bleeds past section padding */}
        <div className="-mx-6 md:hidden">
          <MobileSwipeGallery onOpen={setLightboxIndex} />
        </div>

        {/* Desktop: vertical masonry grid — unchanged */}
        <div className="hidden md:block">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
            {artworks.map((artwork, i) => (
              <FadeIn key={artwork.id} delay={i * 0.03} scale className="break-inside-avoid mb-3">
                <ArtworkCard artwork={artwork} onClick={() => setLightboxIndex(i)} />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            artworks={artworks}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((i) => (i !== null ? i - 1 : i))}
            onNext={() => setLightboxIndex((i) => (i !== null ? i + 1 : i))}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
