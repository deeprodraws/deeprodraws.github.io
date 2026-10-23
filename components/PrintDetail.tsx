'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// The store server that creates Square checkouts. For testing the Buy button
// against the server on your laptop, put
//   NEXT_PUBLIC_STORE_API_URL=http://localhost:3001
// in a file called .env.local in this folder.
const STORE_API_URL = process.env.NEXT_PUBLIC_STORE_API_URL || 'https://deeprodraws-server.onrender.com'

const MAX_QUANTITY = 10

const labelCls = 'block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3'

type Print = {
  slug: string
  title: string
  image: string
  aspectClass: string
  description: string[]
  startingPrice: string
  mockups: string[]
  sizes: { key: string; label: string; priceCents: number; price: string }[]
}

function MockupGallery({ print }: { print: Print }) {
  const slides =
    print.mockups.length > 0
      ? print.mockups.map((m) => `/images/mockups/${print.slug}/${m}`)
      : [`/images/${print.image}`]

  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goTo = (idx: number) => {
    if (idx === activeIdx) return
    setDirection(idx > activeIdx ? 1 : -1)
    setActiveIdx(idx)
  }

  const prev = () => goTo(Math.max(0, activeIdx - 1))
  const next = () => goTo(Math.min(slides.length - 1, activeIdx + 1))

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, activeIdx])

  return (
    <>
      <div>
        {/* Gallery strip */}
        <div
          className={`relative overflow-hidden bg-white/5 cursor-none ${print.mockups.length > 0 ? 'aspect-[4/5]' : print.aspectClass}`}
          data-cursor="Zoom"
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={activeIdx}
              src={slides[activeIdx]}
              alt={`${print.title} mockup ${activeIdx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>

          {/* Expand hint */}
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/50 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                disabled={activeIdx === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/90 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                disabled={activeIdx === slides.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/90 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
        </div>

        {slides.length > 1 && (
          <div className="flex justify-center items-center gap-[5px] mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`View image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx ? 'w-[14px] h-[3px] bg-white' : 'w-[3px] h-[3px] bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/97 flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>

            {activeIdx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Previous"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {activeIdx < slides.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Next"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <motion.img
              key={`lb-${activeIdx}`}
              src={slides[activeIdx]}
              alt={`${print.title} mockup ${activeIdx + 1}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[90svh] max-w-full w-auto object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function FreeShippingBadge() {
  return (
    <span className="inline-flex items-center gap-2 border border-white/60 px-3 py-1.5 font-sans text-[10px] tracking-[0.25em] uppercase text-white font-semibold">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2" />
        <circle cx="18.5" cy="18.5" r="2" />
      </svg>
      Free U.S. shipping
    </span>
  )
}

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`

function BuyBox({ print }: { print: Print }) {
  const [sizeKey, setSizeKey] = useState(print.sizes[0].key)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const size = print.sizes.find((s) => s.key === sizeKey) ?? print.sizes[0]
  const total = formatPrice(size.priceCents * quantity)

  // If the customer leaves Square's page with the Back button, the browser can
  // restore this page exactly as it was, still saying "Opening checkout".
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  // Only the print, size, and quantity are sent. The server looks up the
  // price itself, so nothing on this page can change what gets charged.
  const buy = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${STORE_API_URL}/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: print.slug, size: sizeKey, quantity }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || 'Could not start checkout. Please try again in a moment.')
      }
      window.location.href = data.checkout_url
    } catch (e) {
      setLoading(false)
      // A TypeError means the server couldn't be reached at all.
      setError(
        e instanceof Error && !(e instanceof TypeError)
          ? e.message
          : 'Could not reach checkout. Please try again in a moment.'
      )
    }
  }

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className={labelCls}>Size</legend>
        <div className="grid grid-cols-3 gap-2">
          {print.sizes.map((s) => {
            const selected = s.key === sizeKey
            return (
              <label
                key={s.key}
                className={`cursor-pointer border px-2 py-3 text-center transition-colors duration-200 min-h-[44px] has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-white has-[:focus-visible]:outline-offset-2 ${
                  selected ? 'border-white bg-white text-black' : 'border-white/20 text-white/70 hover:border-white/50'
                }`}
              >
                <input
                  type="radio"
                  name={`size-${print.slug}`}
                  value={s.key}
                  checked={selected}
                  onChange={() => setSizeKey(s.key)}
                  className="sr-only"
                />
                <span className="block font-sans text-xs font-semibold leading-snug">{s.label}</span>
                <span className={`block font-sans text-[11px] mt-1 tabular-nums ${selected ? 'text-black/60' : 'text-white/40'}`}>
                  {s.price}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div>
        <p className={labelCls} id={`qty-${print.slug}`}>Quantity</p>
        <div className="flex items-center border border-white/20 w-fit" role="group" aria-labelledby={`qty-${print.slug}`}>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center font-sans text-sm text-white tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Increase quantity"
            className="w-11 h-11 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={buy}
          disabled={loading}
          data-cursor="Buy"
          className="w-full sm:w-auto font-sans text-[11px] tracking-[0.3em] uppercase bg-white text-black px-10 py-4 hover:bg-white/80 transition-colors duration-200 disabled:opacity-60 disabled:cursor-wait font-semibold min-h-[44px] tabular-nums"
        >
          {loading ? 'Opening secure checkout…' : `Buy now · ${total}`}
        </button>

        {error && (
          <p role="alert" className="font-sans text-xs text-red-400 mt-4">{error}</p>
        )}

        <div className="mt-5">
          <FreeShippingBadge />
        </div>
        <p className="font-sans text-xs text-white/30 mt-3 leading-relaxed max-w-sm">
          Secure checkout by Square. Each print is made to order and shipped flat, ready to frame.
        </p>
      </div>
    </div>
  )
}

export default function PrintDetail({ print }: { print: Print }) {
  return (
    <main className="bg-black min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-12">
          <a href="/prints" className="hover:text-white transition-colors">Prints</a>
          <span className="mx-2 text-white/15">/</span>
          {print.title}
        </p>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: mockup gallery */}
          <MockupGallery print={print} />

          {/* Right: info + buy box */}
          <div>
            <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.88] text-white mb-6">
              {print.title.toUpperCase()}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-8">
              <p className="font-sans text-sm text-white/40">
                From <span className="text-white">{print.startingPrice}</span>
              </p>
              <FreeShippingBadge />
            </div>

            {print.description.length > 0 && (
              <div className="space-y-4 mb-10 max-w-md">
                {print.description.map((paragraph, i) => (
                  <p key={i} className="font-sans text-sm text-white/55 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-10">
              <BuyBox print={print} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
