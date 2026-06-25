'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const FORM_ID = '1hfs3vtvfim'

const prints = [
  { id: 1, title: 'The Godfather',        file: 'the_godfather.jpeg',        aspect: 'aspect-[5/6]' },
  { id: 2, title: 'Eagle',                file: 'eagle.jpeg',                aspect: 'aspect-[5/6]' },
  { id: 3, title: 'What Awaits You Here', file: 'foggy_hills_landscape.jpeg', aspect: 'aspect-[4/3]' },
]

const sizes = ['5"×7"', '6"×8"', '8"×10"', '8"×12"', '9"×11"', '11"×14"', 'Custom']

const labelCls = 'block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3'

function SelectArrow() {
  return (
    <svg className="absolute right-0 bottom-3 pointer-events-none text-white/35" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PrintOrderForm({ printTitle }: { printTitle: string }) {
  const [fullName, setFullName]        = useState('')
  const [email, setEmail]              = useState('')
  const [title, setTitle]              = useState(printTitle)
  const [size, setSize]                = useState('')
  const [shippingAddress, setShipping] = useState('')
  const [notes, setNotes]              = useState('')
  const [submitting, setSubmitting]    = useState(false)
  const [succeeded, setSucceeded]      = useState(false)
  const [error, setError]              = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSubmitting(true)
    setError('')

    const fd = new FormData()
    fd.append('fi-sender-fullName', fullName)
    fd.append('fi-sender-email', email)
    fd.append('fi-text-printTitle', title)
    fd.append('fi-select-size', size)
    fd.append('fi-text-shippingAddress', shippingAddress)
    if (notes) fd.append('fi-text-notes', notes)

    try {
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
          I'll be in touch within 48 hours with pricing and payment details.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor={`name-${printTitle}`} className={labelCls}>Full Name</label>
          <input id={`name-${printTitle}`} type="text" required placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-bare" />
        </div>
        <div>
          <label htmlFor={`email-${printTitle}`} className={labelCls}>Email</label>
          <input id={`email-${printTitle}`} type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-bare" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor={`title-${printTitle}`} className={labelCls}>Print Title</label>
          <input id={`title-${printTitle}`} type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-bare" />
        </div>
        <div>
          <label htmlFor={`size-${printTitle}`} className={labelCls}>Size Preference</label>
          <div className="relative">
            <select id={`size-${printTitle}`} required value={size} onChange={(e) => setSize(e.target.value)} className="input-bare appearance-none w-full pr-6">
              <option value="" disabled>Select size</option>
              {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <SelectArrow />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor={`address-${printTitle}`} className={labelCls}>Shipping Address</label>
        <textarea id={`address-${printTitle}`} required rows={2} placeholder="Street, city, state, zip, country" value={shippingAddress} onChange={(e) => setShipping(e.target.value)} className="input-bare resize-none" />
      </div>

      <div>
        <label htmlFor={`notes-${printTitle}`} className={labelCls}>Additional Notes (optional)</label>
        <textarea id={`notes-${printTitle}`} rows={2} placeholder="Any details, special requests, framing preferences..." value={notes} onChange={(e) => setNotes(e.target.value)} className="input-bare resize-none" />
      </div>

      {error && <p className="font-sans text-xs text-red-400">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="font-sans text-[11px] tracking-[0.3em] uppercase bg-white text-black px-10 py-4 hover:bg-white/80 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold min-h-[44px]"
        >
          {submitting ? 'Sending...' : 'Request This Print'}
        </button>
        <p className="font-sans text-xs text-white/25 mt-4 leading-relaxed">
          Pricing confirmed after inquiry. Payment handled directly. Fulfilled and shipped through Printful.
        </p>
      </div>
    </form>
  )
}

export default function PrintsPage() {
  return (
    <>
      <Navigation />
      <main className="bg-black min-h-screen pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 border-b border-white/10 pb-16">
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">
              Available Now
            </p>
            <h1 className="font-serif text-[clamp(5rem,18vw,14rem)] leading-[0.85] text-white">
              PRINTS
            </h1>
            <p className="font-sans text-sm text-white/45 mt-6 max-w-md leading-relaxed">
              Inquire below to order. Pricing confirmed after your request. Prints fulfilled through Printful and shipped directly to you.
            </p>
          </div>

          {prints.map((print, i) => (
            <section
              key={print.id}
              id={`print-${print.id}`}
              className={`${i > 0 ? 'border-t border-white/10 pt-20' : ''} mb-20`}
            >
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className={`${print.aspect} relative overflow-hidden w-full`}>
                  <img
                    src={`/images/${print.file}`}
                    alt={print.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <div>
                  <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-white mb-10">
                    {print.title.toUpperCase()}
                  </h2>
                  <PrintOrderForm printTitle={print.title} />
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
