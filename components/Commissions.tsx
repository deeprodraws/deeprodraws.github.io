'use client'

import { useState } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from './FadeIn'

const inputBase =
  'w-full bg-ink-mid border border-ink-border text-parchment placeholder-parchment-mute font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-gold/40 transition-colors duration-200'

const labelBase =
  'block font-sans text-[10px] tracking-[0.3em] uppercase text-parchment-dim mb-2.5'

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
        strokeWidth="1.5"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function Commissions() {
  const [state, handleSubmit] = useForm('mojbybkg')
  const [fileName, setFileName] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name ?? '')
  }

  return (
    <section id="commission" className="bg-ink py-28 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="mb-14">
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-4">
            Get in Touch
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-parchment mb-5 leading-tight">
            Commission
            <br />
            a Piece
          </h2>
          <p className="font-sans text-sm text-parchment-dim leading-relaxed max-w-sm">
            Every piece is drawn by hand. Fill out the form and I'll be in touch within 48 hours to
            discuss the details.
          </p>
        </FadeIn>

        <AnimatePresence mode="wait">
          {state.succeeded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-14 h-14 border border-gold rounded-full flex items-center justify-center mx-auto mb-7">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c8a45e"
                  strokeWidth="1.5"
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-3xl text-parchment mb-3">Inquiry Received</h3>
              <p className="font-sans text-sm text-parchment-dim leading-relaxed">
                Thank you. I'll be in touch within 48 hours.
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
                    <label htmlFor="fullName" className={labelBase}>
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      required
                      placeholder="Your name"
                      className={inputBase}
                    />
                    <ValidationError field="fullName" errors={state.errors} className="font-sans text-xs text-red-400 mt-1" />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelBase}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className={inputBase}
                    />
                    <ValidationError field="email" errors={state.errors} className="font-sans text-xs text-red-400 mt-1" />
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.13}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="type" className={labelBase}>
                      Type of Commission
                    </label>
                    <SelectWrapper>
                      <select
                        id="type"
                        name="type"
                        required
                        defaultValue=""
                        className={`${inputBase} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        <option value="Portrait">Portrait</option>
                        <option value="Pet Portrait">Pet Portrait</option>
                        <option value="Landscape">Landscape</option>
                        <option value="Other">Other</option>
                      </select>
                    </SelectWrapper>
                  </div>
                  <div>
                    <label htmlFor="size" className={labelBase}>
                      Size Preference
                    </label>
                    <SelectWrapper>
                      <select
                        id="size"
                        name="size"
                        required
                        defaultValue=""
                        className={`${inputBase} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select size
                        </option>
                        <option value="9x12">9×12 in</option>
                        <option value="18x24">18×24 in</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </SelectWrapper>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.18}>
                <div>
                  <label htmlFor="description" className={labelBase}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={5}
                    placeholder="Tell me about the piece — who or what, the mood, any details you want captured..."
                    className={`${inputBase} resize-none`}
                  />
                  <ValidationError field="description" errors={state.errors} className="font-sans text-xs text-red-400 mt-1" />
                </div>
              </FadeIn>

              <FadeIn delay={0.23}>
                <div>
                  <label htmlFor="reference" className={labelBase}>
                    Reference Image (optional)
                  </label>
                  <label
                    htmlFor="reference"
                    className="w-full border border-dashed border-ink-border hover:border-gold/35 transition-colors duration-300 cursor-pointer flex items-center gap-3 px-4 py-4"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-parchment-mute flex-shrink-0"
                    >
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
                      name="reference"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFile}
                      className="sr-only"
                    />
                  </label>
                </div>
              </FadeIn>

              <ValidationError errors={state.errors} className="font-sans text-xs text-red-400" />

              <FadeIn delay={0.28}>
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full bg-parchment text-ink font-sans text-[11px] tracking-[0.25em] uppercase py-4 hover:bg-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? 'Sending…' : 'Submit Inquiry'}
                </button>
                <p className="font-sans text-xs text-parchment-mute text-center mt-5">
                  Starting at $150 · Final pricing discussed after inquiry
                </p>
              </FadeIn>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
