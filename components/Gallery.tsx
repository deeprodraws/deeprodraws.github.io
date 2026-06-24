'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'

const artworks = [
  // Human / emotional
  { id: 1,  title: 'The Godfather',                     year: '2025', file: 'the_godfather.jpeg',       aspectClass: 'aspect-[5/6]'  },
  { id: 2,  title: 'Crown of Thorns',                   year: '2025', file: 'jesus_crown.jpeg',         aspectClass: 'aspect-[5/7]'  },
  { id: 3,  title: 'Bowed',                             year: '2026', file: 'jesus_down.jpeg',          aspectClass: 'aspect-[4/5]'  },
  { id: 4,  title: 'Portrait Study',                    year: '2025', file: 'portrait_study.jpeg',      aspectClass: 'aspect-[3/4]'  },
  { id: 5,  title: 'Looking Up',                        year: '2026', file: 'looking_up.jpeg',          aspectClass: 'aspect-[3/4]'  },
  // Wildlife
  { id: 6,  title: 'Eagle',                             year: '2025', file: 'eagle.jpeg',               aspectClass: 'aspect-[5/6]'  },
  { id: 7,  title: "Where the Forest Holds it's Breath", year: '2026', file: 'puma.jpeg',              aspectClass: 'aspect-[4/5]'  },
  { id: 8,  title: 'Above the Rim',                     year: '2026', file: 'basketball.jpeg',          aspectClass: 'aspect-[3/4]'  },
  { id: 9,  title: 'Curled',                            year: '2025', file: 'cat_in_a_basket.jpeg',    aspectClass: 'aspect-[4/5]'  },
  { id: 10, title: 'Food on my Mind',                   year: '2025', file: 'lying_dog.jpeg',           aspectClass: 'aspect-[4/3]'  },
  { id: 11, title: 'Teddy',                             year: '2026', file: 'cavapoo.jpeg',             aspectClass: 'aspect-[4/5]'  },
  // Landscapes
  { id: 12, title: 'What Awaits You Here',              year: '2025', file: 'foggy_hills_landscape.jpeg', aspectClass: 'aspect-[4/3]' },
  { id: 13, title: 'Snowy Peaks',                       year: '2026', file: 'large_mountain.jpeg',     aspectClass: 'aspect-[4/3]'  },
  { id: 14, title: 'Mountain Landscape',                year: '2025', file: 'mountain_landscape.jpeg',  aspectClass: 'aspect-[3/4]'  },
  { id: 15, title: 'The Overlook',                      year: '2026', file: 'cliff_overlook.jpeg',     aspectClass: 'aspect-[4/3]'  },
]

type Artwork = (typeof artworks)[number]

function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left overflow-hidden focus-visible:ring-2 focus-visible:ring-gold"
      aria-label={`Open ${artwork.title}`}
    >
      <div className={`relative ${artwork.aspectClass} overflow-hidden`}>
        <img
          src={`/images/${artwork.file}`}
          alt={artwork.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Hover overlay — title only */}
        <div className="absolute inset-0 z-10 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] flex flex-col items-start justify-end p-5">
          <p className="font-sans text-lg font-semibold text-parchment translate-y-2 group-hover:translate-y-0 transition-transform duration-[400ms]">
            {artwork.title}
          </p>
          <div className="mt-2 w-0 group-hover:w-6 h-[2px] bg-gold transition-all duration-500 delay-75" />
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/96 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-parchment-mute hover:text-parchment transition-colors p-2" aria-label="Close">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
      {index > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-parchment-mute hover:text-parchment transition-colors p-3" aria-label="Previous">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {index < artworks.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-parchment-mute hover:text-parchment transition-colors p-3" aria-label="Next">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full ${artwork.aspectClass} relative overflow-hidden`}>
          <img
            src={`/images/${artwork.file}`}
            alt={artwork.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="font-sans text-xl font-semibold text-parchment">{artwork.title}</p>
          <p className="font-sans text-xs text-parchment-mute flex-shrink-0 mt-1">{index + 1} / {artworks.length}</p>
        </div>
      </motion.div>
    </motion.div>
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
    <section id="gallery" className="bg-ink-light py-28 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="mb-16">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">Work</p>
          <h2 className="font-serif text-7xl md:text-9xl text-parchment leading-none">My Work</h2>
        </FadeIn>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {artworks.map((artwork, i) => (
            <FadeIn key={artwork.id} delay={i * 0.04} className="break-inside-avoid mb-4">
              <ArtworkCard artwork={artwork} onClick={() => setLightboxIndex(i)} />
            </FadeIn>
          ))}
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
