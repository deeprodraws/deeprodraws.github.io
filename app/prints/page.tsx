'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const FORM_ID = '1hfs3vtvfim'

const prints = [
  { id: 1, title: 'The Godfather',        file: 'the_godfather.jpeg',        aspectClass: 'aspect-[5/6]' },
  { id: 2, title: 'Eagle',                file: 'eagle.jpeg',                aspectClass: 'aspect-[5/6]' },
  { id: 3, title: 'What Awaits You Here', file: 'foggy_hills_landscape.jpeg', aspectClass: 'aspect-[4/3]' },
]

const sizes = ['5"×7"', '6"×8"', '8"×10"', '8"×12"', '9"×11"', '11"×14"', 'Custom']

const inputBase =
  'w-full bg-ink-mid border-2 border-ink-border text-parchment placeholder-parchment-mute font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-gold/40 transition-colors duration-200'

const labelBase =
  'block font-sans text-[10px] tracking-[0.3em] uppercase text-parchment-dim mb-2.5 font-semibold'

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-parchment-mute"
        width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function PrintOrderForm({ printTitle }: { printTitle: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState(printTitle)
  const [size, setSize] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSubmitting(true)
    setError('')

    const fd = new FormData()
    fd.append('fi-sender-fullName', name)
    fd.append('fi-sender-email', email)
    fd.append('fi-text-printTitle', title)
    fd.append('fi-select-size', size)
    fd.append('fi-text-shippingAddress', address)
    if (notes) fd.append('fi-text-notes', notes)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const forminit = new (window as any).Forminit()
      const { error: err } = await forminit.submit(FORM_ID, fd)
      if (err) {
        setError(err.message || 'Something went wrong. Please try again.')
      } else {
        setSucceeded(true)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {succeeded ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-10"
        >
          <div className="w-12 h-12 border-2 border-gold rounded-full flex items-center justify-center mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a45e" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="font-serif text-4xl text-parchment mb-3">Got it!</h3>
          <p className="font-sans text-base text-parchment-dim leading-relaxed">
            I'll be in touch within 48 hours with pricing and payment details.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelBase}>Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Email</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelBase}>Print Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className={labelBase}>Size Preference</label>
              <SelectWrapper>
                <select
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={`${inputBase} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Select size</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
          </div>

          <div>
            <label className={labelBase}>Shipping Address</label>
            <input
              type="text"
              required
              placeholder="Street, City, State, ZIP, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputBase}
            />
          </div>

          <div>
            <label className={labelBase}>Additional Notes (optional)</label>
            <textarea
              rows={3}
              placeholder="Any special requests or questions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputBase} resize-none`}
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-parchment text-ink font-sans text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {submitting ? 'Sending...' : 'Request This Print'}
          </button>

          <p className="font-sans text-xs text-parchment-mute leading-relaxed">
            Pricing confirmed after inquiry. Payment handled directly. Fulfilled and shipped through Printful.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default function PrintsPage() {
  return (
    <>
      <Navigation />
      <main className="bg-ink min-h-screen">
        <div className="pt-32 pb-8 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">Prints</p>
            <h1 className="font-serif text-7xl md:text-9xl text-parchment leading-none mb-5">
              Take One Home
            </h1>
            <p className="font-sans text-base text-parchment-dim max-w-md leading-relaxed">
              Original charcoal artwork available as high-quality prints. Request one below and I'll confirm pricing and handle the rest.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-12 pb-28">
          <div className="max-w-6xl mx-auto divide-y-2 divide-ink-border">
            {prints.map((print) => (
              <div key={print.id} className="py-20 first:pt-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div className={`${print.aspectClass} relative overflow-hidden`}>
                    <img
                      src={`/images/${print.file}`}
                      alt={print.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="font-serif text-5xl md:text-6xl text-parchment leading-none mb-8">
                      {print.title}
                    </h2>
                    <PrintOrderForm printTitle={print.title} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
