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
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function Commissions() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')
  const [size, setSize] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState('')

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
    <section id="commission" className="bg-ink py-28 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="mb-14">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">
            Get in Touch
          </p>
          <h2 className="font-serif text-7xl md:text-8xl text-parchment mb-5 leading-none">
            Work With Me
          </h2>
          <p className="font-sans text-base text-parchment-dim leading-relaxed max-w-sm">
            Fill out the form below. I'll get back to you within 48 hours.
          </p>
        </FadeIn>

        <AnimatePresence mode="wait">
          {succeeded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-14 h-14 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-7">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a45e" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-5xl text-parchment mb-3">Got it!</h3>
              <p className="font-sans text-base text-parchment-dim leading-relaxed">
                Thanks for reaching out. I'll be in touch within 48 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <FadeIn delay={0.08}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className={labelBase}>Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelBase}>Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.13}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="type" className={labelBase}>Type of Commission</label>
                    <SelectWrapper>
                      <select
                        id="type"
                        required
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={`${inputBase} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>Select type</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Pet Portrait">Pet Portrait</option>
                        <option value="Landscape">Landscape</option>
                        <option value="Other">Other</option>
                      </select>
                    </SelectWrapper>
                  </div>
                  <div>
                    <label htmlFor="size" className={labelBase}>Size</label>
                    <SelectWrapper>
                      <select
                        id="size"
                        required
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className={`${inputBase} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>Select size</option>
                        <option value="9x12">9x12 in</option>
                        <option value="18x24">18x24 in</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </SelectWrapper>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <div>
                  <label htmlFor="description" className={labelBase}>Tell me about it</label>
                  <textarea
                    id="description"
                    required
                    rows={5}
                    placeholder="Who or what, the mood, any details you want captured..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputBase} resize-none`}
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.23}>
                <div>
                  <label htmlFor="reference" className={labelBase}>Reference Image (optional)</label>
                  <label
                    htmlFor="reference"
                    className="w-full border-2 border-dashed border-ink-border hover:border-gold/35 transition-colors duration-300 cursor-pointer flex items-center gap-3 px-4 py-4"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-parchment-mute flex-shrink-0">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="font-sans text-sm text-parchment-mute">
                      {fileName || 'Upload JPG or PNG'}
                    </span>
                    <input
                      id="reference"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFile}
                      className="sr-only"
                    />
                  </label>
                </div>
              </FadeIn>

              {error && (
                <p className="font-sans text-xs text-red-400">{error}</p>
              )}

              <FadeIn delay={0.28}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-parchment text-ink font-sans text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {submitting ? 'Sending...' : 'Send It'}
                </button>
                <p className="font-sans text-sm text-parchment-mute text-center mt-5">
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
