'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'

// Replace gradient placeholder divs with real <img> tags once you have artwork files.
// Drop images into public/images/ and update the `file` field below.
const artworks = [
  {
    id: 1,
    title: 'Quiet Study',
    medium: 'Charcoal on Strathmore',
    year: '2024',
    aspectClass: 'aspect-[3/4]',
    gradient: 'from-[#181614] via-[#26221e] to-[#121010]',
    file: 'quiet-study.jpg',
  },
  {
    id: 2,
    title: 'Evening Light',
    medium: 'Charcoal on paper',
    year: '2024',
    aspectClass: 'aspect-[4/3]',
    gradient: 'from-[#1e1a14] via-[#2e2418] to-[#14100c]',
    file: 'evening-light.jpg',
  },
  {
    id: 3,
    title: 'The Dog',
    medium: 'Charcoal on paper',
    year: '2024',
    aspectClass: 'aspect-square',
    gradient: 'from-[#14141c] via-[#1e1e28] to-[#0c0c14]',
    file: 'the-dog.jpg',
  },
  {
    id: 4,
    title: 'Portrait I',
    medium: 'Charcoal on Canson',
    year: '2024',
    aspectClass: 'aspect-[2/3]',
    gradient: 'from-[#1c1810] via-[#28221a] to-[#121008]',
    file: 'portrait-i.jpg',
  },
  {
    id: 5,
    title: 'Landscape Study',
    medium: 'Charcoal on paper',
    year: '2025',
    aspectClass: 'aspect-[16/9]',
    gradient: 'from-[#101418] via-[#181e26] to-[#0a0e12]',
    file: 'landscape-study.jpg',
  },
  {
    id: 6,
    title: 'Tabby',
    medium: 'Charcoal on paper',
    year: '2025',
    aspectClass: 'aspect-[3/4]',
    gradient: 'from-[#181412] via-[#201c18] to-[#0e0c0a]',
    file: 'tabby.jpg',
  },
  {
    id: 7,
    title: 'Golden Hour',
    medium: 'Charcoal on paper',
    year: '2025',
    aspectClass: 'aspect-[4/5]',
    gradient: 'from-[#1e1a10] via-[#2a2414] to-[#120e08]',
    file: 'golden-hour.jpg',
  },
  {
    id: 8,
    title: 'Portrait II',
    medium: 'Charcoal on Strathmore',
    year: '2025',
    aspectClass: 'aspect-[3/4]',
    gradient: 'from-[#161418] via-[#201c24] to-[#0e0c10]',
    file: 'portrait-ii.jpg',
  },
  {
    id: 9,
    title: 'The Oak',
    medium: 'Charcoal on paper',
    year: '2025',
    aspectClass: 'aspect-[3/2]',
    gradient: 'from-[#121614] via-[#1c2220] to-[#0a0e0c]',
    file: 'the-oak.jpg',
  },
]

type Artwork = (typeof artworks)[number]

const noiseUrl =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function Placeholder({ gradient }: { gradient: string; file: string }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: noiseUrl }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
    </div>
  )
}

function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left overflow-hidden focus-visible:ring-1 focus-visible:ring-gold"
      aria-label={`Open ${artwork.title}`}
    >
      <div className={`relative ${artwork.aspectClass}`}>
        <Placeholder gradient={artwork.gradient} file={artwork.file} />

        {/* File label for placeholder reference */}
        <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
          <p className="font-sans text-[9px] tracking-widest text-white/15 uppercase">
            {artwork.file}
          </p>
        </div>

        {/* Hover reveal overlay */}
        <div className="absolute inset-0 z-[3] bg-ink/85 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] flex flex-col items-start justify-end p-5">
          <p className="font-serif text-xl text-parchment mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-[400ms]">
            {artwork.title}
          </p>
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-parchment-dim translate-y-2 group-hover:translate-y-0 transition-transform duration-[400ms] delay-[30ms]">
            {artwork.medium} · {artwork.year}
          </p>
          <div className="mt-3 w-0 group-hover:w-6 h-px bg-gold transition-all duration-500 delay-75" />
        </div>
      </div>
    </button>
  )
}

function Lightbox({
  artworks,
  index,
  onClose,
  onPrev,
  onNext,
}: {
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
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-parchment-mute hover:text-parchment transition-colors p-2"
        aria-label="Close"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-parchment-mute hover:text-parchment transition-colors p-3"
          aria-label="Previous artwork"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Next */}
      {index < artworks.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-parchment-mute hover:text-parchment transition-colors p-3"
          aria-label="Next artwork"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full ${artwork.aspectClass} relative overflow-hidden`}>
          <Placeholder gradient={artwork.gradient} file={artwork.file} />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-2xl text-parchment">{artwork.title}</p>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-parchment-dim mt-1">
              {artwork.medium} · {artwork.year}
            </p>
          </div>
          <p className="font-sans text-xs text-parchment-mute flex-shrink-0 mt-1">
            {index + 1} / {artworks.length}
          </p>
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
      if (e.key === 'ArrowRight' && lightboxIndex < artworks.length - 1)
        setLightboxIndex(lightboxIndex + 1)
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
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">Portfolio</p>
          <h2 className="font-serif text-5xl md:text-7xl text-parchment leading-none">The Work</h2>
        </FadeIn>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {artworks.map((artwork, i) => (
            <FadeIn
              key={artwork.id}
              delay={i * 0.04}
              className="break-inside-avoid mb-4"
            >
              <ArtworkCard
                artwork={artwork}
                onClick={() => setLightboxIndex(i)}
              />
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
