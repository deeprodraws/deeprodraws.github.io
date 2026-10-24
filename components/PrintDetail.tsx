'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'

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

// How far a finger has to drag (in pixels) to count as a swipe.
const SWIPE_PX = 50

function ArrowIcon({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const lightboxArrowCls =
  'w-12 h-12 rounded-full flex items-center justify-center bg-black/70 border border-white/40 text-white hover:bg-white hover:text-black transition-colors'

function MockupGallery({ print }: { print: Print }) {
  const hasMockups = print.mockups.length > 0
  const slides = hasMockups
    ? print.mockups.map((m) => `/images/mockups/${print.slug}/${m}`)
    : [`/images/${print.image}`]
  const many = slides.length > 1

  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const draggedRef = useRef(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Arrows and swipes wrap around: "next" on the last photo goes to the first.
  const step = (delta: 1 | -1) => {
    if (!many) return
    setDirection(delta)
    setActiveIdx((i) => (i + delta + slides.length) % slides.length)
  }
  const goTo = (idx: number) => {
    if (idx === activeIdx) return
    setDirection(idx > activeIdx ? 1 : -1)
    setActiveIdx(idx)
  }
  const onSwipeEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) step(1)
    else if (info.offset.x > SWIPE_PX) step(-1)
  }

  const open = () => {
    // A swipe ends with a tap-like release; don't treat it as "open".
    if (draggedRef.current) return
    setLightboxOpen(true)
  }
  const close = () => setLightboxOpen(false)

  useEffect(() => {
    if (!lightboxOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen])

  const swipeProps = many
    ? {
        drag: 'x' as const,
        dragConstraints: { left: 0, right: 0 },
        dragElastic: 0.5,
        dragSnapToOrigin: true,
        onDragStart: () => { draggedRef.current = true },
        onDragEnd: onSwipeEnd,
        style: { touchAction: 'pan-y' },
      }
    : {}

  return (
    <>
      <div>
        {/* Photo strip. Photos come in different shapes, so each is shown whole. */}
        <div
          className={`relative overflow-hidden bg-white/[0.04] cursor-none ${hasMockups ? 'aspect-square' : print.aspectClass}`}
          data-cursor="Zoom"
          onPointerDown={() => { draggedRef.current = false }}
          onClick={open}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={activeIdx}
              src={slides[activeIdx]}
              alt={`${print.title}, photo ${activeIdx + 1} of ${slides.length}`}
              draggable={false}
              className={`absolute inset-0 w-full h-full select-none ${hasMockups ? 'object-contain' : 'object-cover'}`}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              {...swipeProps}
            />
          </AnimatePresence>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(true) }}
            aria-label="View photos full screen"
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-black/70 border border-white/30 text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1) }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/70 border border-white/30 text-white hover:bg-black transition-colors"
                aria-label="Previous photo"
              >
                <ArrowIcon dir="prev" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/70 border border-white/30 text-white hover:bg-black transition-colors"
                aria-label="Next photo"
              >
                <ArrowIcon dir="next" />
              </button>
            </>
          )}
        </div>

        {many && (
          <div className="flex justify-center items-center mt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`View photo ${i + 1}`}
                aria-current={i === activeIdx}
                className="w-8 h-8 flex items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === activeIdx ? 'w-5 h-[3px] bg-white' : 'w-[5px] h-[5px] bg-white/35'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen viewer */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${print.title} photos`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
            onClick={close}
          >
            {/* Top bar: photo count and close button */}
            <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-6 shrink-0">
              <p className="font-sans text-xs tracking-[0.3em] text-white/70 tabular-nums" aria-live="polite">
                {many ? `${activeIdx + 1} / ${slides.length}` : ''}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 border border-white/40 text-white hover:bg-white hover:text-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Photo. Tapping the dark area around it closes the viewer. */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-28">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={`lb-${activeIdx}`}
                  src={slides[activeIdx]}
                  alt={`${print.title}, photo ${activeIdx + 1} of ${slides.length}`}
                  draggable={false}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                  {...swipeProps}
                />
              </AnimatePresence>

              {many && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); step(-1) }}
                    aria-label="Previous photo"
                    className={`hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 ${lightboxArrowCls}`}
                  >
                    <ArrowIcon dir="prev" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); step(1) }}
                    aria-label="Next photo"
                    className={`hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 ${lightboxArrowCls}`}
                  >
                    <ArrowIcon dir="next" />
                  </button>
                </>
              )}
            </div>

            {/* On phones the arrows sit below the photo so they never cover it. */}
            {many ? (
              <div className="md:hidden flex items-center justify-center gap-10 py-5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); step(-1) }}
                  aria-label="Previous photo"
                  className={lightboxArrowCls}
                >
                  <ArrowIcon dir="prev" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); step(1) }}
                  aria-label="Next photo"
                  className={lightboxArrowCls}
                >
                  <ArrowIcon dir="next" />
                </button>
              </div>
            ) : (
              <div className="h-6 shrink-0" />
            )}
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
