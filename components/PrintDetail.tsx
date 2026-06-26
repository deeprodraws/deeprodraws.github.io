'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window {
    Forminit: new () => {
      submit(
        formId: string,
        payload: FormData
      ): Promise<{
        data?: { hashId: string; date: string }
        redirectUrl?: string
        error?: { error: string; code: number; message: string }
      }>
    }
  }
}

const FORM_ID = '1hfs3vtvfim'

const SIZES = ['8×10"', '11×14"', '16×20"', 'Custom']

const labelCls = 'block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3'

type Print = {
  slug: string
  title: string
  image: string
  aspectClass: string
  description: string
  startingPrice: string
  mockups: string[]
}

function SelectArrow() {
  return (
    <svg
      className="absolute right-0 bottom-3 pointer-events-none text-white/35"
      width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
          className="relative overflow-hidden bg-white/5 aspect-[4/5] cursor-zoom-in"
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

function PrintOrderForm({ print }: { print: Print }) {
  const [fullName, setFullName]     = useState('')
  const [email, setEmail]           = useState('')
  const [size, setSize]             = useState('')
  const [address, setAddress]       = useState('')
  const [notes, setNotes]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded]   = useState(false)
  const [error, setError]           = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const fd = new FormData()
    fd.append('fi-sender-fullName', fullName)
    fd.append('fi-sender-email', email)
    fd.append('fi-text-printTitle', print.title)
    fd.append('fi-select-size', size)
    fd.append('fi-text-shippingAddress', address)
    if (notes) fd.append('fi-text-notes', notes)

    try {
      const forminit = new window.Forminit()
      const { error: err } = await forminit.submit(FORM_ID, fd)
      if (err) {
        setError(err.message || `Something went wrong. Email me at mikichowdhury@gmail.com`)
      } else {
        setSucceeded(true)
      }
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : `Something went wrong. Email me at mikichowdhury@gmail.com`
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="py-10"
      >
        <div className="w-10 h-10 border border-white flex items-center justify-center mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-serif text-4xl text-white mb-3">Got it!</p>
        <p className="font-sans text-sm text-white/45 leading-relaxed max-w-sm">
          I'll follow up within 48 hours with payment details.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor={`name-${print.slug}`} className={labelCls}>Full Name</label>
          <input
            id={`name-${print.slug}`} type="text" required
            placeholder="Your name"
            value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="input-bare"
          />
        </div>
        <div>
          <label htmlFor={`email-${print.slug}`} className={labelCls}>Email</label>
          <input
            id={`email-${print.slug}`} type="email" required
            placeholder="your@email.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="input-bare"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`size-${print.slug}`} className={labelCls}>Size Preference</label>
        <div className="relative">
          <select
            id={`size-${print.slug}`} required
            value={size} onChange={(e) => setSize(e.target.value)}
            className="input-bare appearance-none w-full pr-6"
          >
            <option value="" disabled>Select size</option>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <SelectArrow />
        </div>
      </div>

      <div>
        <label htmlFor={`address-${print.slug}`} className={labelCls}>Shipping Address</label>
        <textarea
          id={`address-${print.slug}`} required rows={2}
          placeholder="Street, city, state, zip, country"
          value={address} onChange={(e) => setAddress(e.target.value)}
          className="input-bare resize-none"
        />
      </div>

      <div>
        <label htmlFor={`notes-${print.slug}`} className={labelCls}>Notes (optional)</label>
        <textarea
          id={`notes-${print.slug}`} rows={2}
          placeholder="Any special requests or framing preferences…"
          value={notes} onChange={(e) => setNotes(e.target.value)}
          className="input-bare resize-none"
        />
      </div>

      {error && (
        <p className="font-sans text-xs text-red-400">{error}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="font-sans text-[11px] tracking-[0.3em] uppercase bg-white text-black px-10 py-4 hover:bg-white/80 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold min-h-[44px]"
        >
          {submitting ? 'Sending…' : 'Request This Print'}
        </button>
        <p className="font-sans text-xs text-white/25 mt-4 leading-relaxed">
          Payment handled directly after inquiry. Fulfilled and shipped through Printful.
        </p>
      </div>
    </form>
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

          {/* Right: info + form */}
          <div>
            <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.88] text-white mb-6">
              {print.title.toUpperCase()}
            </h1>

            {print.description && (
              <p className="font-sans text-sm text-white/55 leading-relaxed mb-8 max-w-sm">
                {print.description}
              </p>
            )}

            {/* Sizes */}
            <div className="mb-6">
              <p className={labelCls.replace('mb-3', 'mb-4')}>Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <span key={s} className="font-sans text-xs text-white/60 border border-white/20 px-3 py-1.5">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <p className="font-sans text-sm text-white/40 mb-10">
              {print.startingPrice
                ? <>Starting at <span className="text-white">{print.startingPrice}</span></>
                : 'Pricing confirmed after inquiry'}
            </p>

            <div className="border-t border-white/10 pt-10">
              <p className={labelCls}>Order This Print</p>
              <PrintOrderForm print={print} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
