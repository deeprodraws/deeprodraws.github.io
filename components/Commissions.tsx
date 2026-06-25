'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'

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

function SelectArrow() {
  return (
    <svg
      className="absolute right-0 bottom-3 pointer-events-none text-white/40"
      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Commissions() {
  const [fullName, setFullName]       = useState('')
  const [email, setEmail]             = useState('')
  const [type, setType]               = useState('')
  const [size, setSize]               = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile]               = useState<File | null>(null)
  const [fileName, setFileName]       = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [succeeded, setSucceeded]     = useState(false)
  const [error, setError]             = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setFileName(f?.name ?? '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSubmitting(true)
    setError('')

    const fd = new FormData()
    fd.append('fi-sender-fullName', fullName)
    fd.append('fi-sender-email', email)
    fd.append('fi-select-type', type)
    fd.append('fi-select-size', size)
    fd.append('fi-text-description', description)
    if (file) fd.append('fi-file-reference', file)

    try {
      const forminit = new window.Forminit()
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
    <section id="commission" className="bg-black py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="mb-16">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">
            Get in Touch
          </p>
          <h2 className="font-serif text-[clamp(5rem,18vw,14rem)] leading-[0.85] text-white">
            WORK WITH ME
          </h2>
          <p className="font-sans text-sm text-white/45 leading-relaxed mt-6 max-w-sm">
            Fill out the form below. I'll get back to you within 48 hours.
          </p>
        </FadeIn>

        <AnimatePresence mode="wait">
          {succeeded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-20"
            >
              <div className="w-12 h-12 border border-white flex items-center justify-center mb-8">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-6xl text-white mb-3">Got it!</h3>
              <p className="font-sans text-sm text-white/45">
                Thanks for reaching out. I'll be in touch within 48 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-10"
            >
              <FadeIn delay={0.06}>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                  <div>
                    <label htmlFor="fullName" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3">
                      Full Name
                    </label>
                    <input
                      id="fullName" type="text" required
                      placeholder="Your name"
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="input-bare"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3">
                      Email
                    </label>
                    <input
                      id="email" type="email" required
                      placeholder="your@email.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="input-bare"
                    />
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                  <div>
                    <label htmlFor="type" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3">
                      Type of Commission
                    </label>
                    <div className="relative">
                      <select
                        id="type" required
                        value={type} onChange={(e) => setType(e.target.value)}
                        className="input-bare appearance-none w-full pr-6"
                      >
                        <option value="" disabled>Select type</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Pet Portrait">Pet Portrait</option>
                        <option value="Landscape">Landscape</option>
                        <option value="Other">Other</option>
                      </select>
                      <SelectArrow />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="size" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3">
                      Size
                    </label>
                    <div className="relative">
                      <select
                        id="size" required
                        value={size} onChange={(e) => setSize(e.target.value)}
                        className="input-bare appearance-none w-full pr-6"
                      >
                        <option value="" disabled>Select size</option>
                        <option value="9x12">9x12 in</option>
                        <option value="18x24">18x24 in</option>
                        <option value="Custom">Custom</option>
                      </select>
                      <SelectArrow />
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.14}>
                <div>
                  <label htmlFor="description" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3">
                    Tell me about it
                  </label>
                  <textarea
                    id="description" required rows={4}
                    placeholder="Who or what, the mood, any details you want captured..."
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="input-bare resize-none"
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <div>
                  <label htmlFor="reference" className="block font-sans text-[9px] tracking-[0.4em] uppercase text-white/40 mb-3">
                    Reference Image (optional)
                  </label>
                  <label
                    htmlFor="reference"
                    className="flex items-center gap-3 py-3 border-b border-white/25 hover:border-white/60 transition-colors cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/35 flex-shrink-0">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="font-sans text-sm text-white/35">
                      {fileName || 'Upload JPG or PNG'}
                    </span>
                    <input id="reference" type="file" accept=".jpg,.jpeg,.png" onChange={handleFile} className="sr-only" />
                  </label>
                </div>
              </FadeIn>

              {error && (
                <p className="font-sans text-xs text-red-400">{error}</p>
              )}

              <FadeIn delay={0.22}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="font-sans text-[11px] tracking-[0.3em] uppercase bg-white text-black px-10 py-4 hover:bg-white/80 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold min-h-[44px]"
                >
                  {submitting ? 'Sending...' : 'Send It'}
                </button>
                <p className="font-sans text-xs text-white/30 mt-5">
                  Starting at $90. We'll talk details after you reach out.
                </p>
              </FadeIn>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
