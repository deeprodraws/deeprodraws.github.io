'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="hero"
      className="grain-overlay relative min-h-screen flex flex-col items-center justify-center bg-ink overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gold/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.025] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Vertical rule above heading */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/30 to-transparent origin-top"
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-8"
        >
          Charcoal · Belmont, CA
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-[clamp(3.5rem,13vw,10.5rem)] leading-[0.88] tracking-tight text-parchment mb-8"
        >
          Deepro C.
        </motion.h1>

        {/* Rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="w-16 h-px bg-gold/50 mx-auto mb-8 origin-center"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-serif text-[clamp(1rem,2.2vw,1.4rem)] italic text-parchment-dim mb-14 leading-relaxed"
        >
          Charcoal portraits from my hand to your wall.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#commission"
            className="font-sans text-[11px] tracking-[0.25em] uppercase px-8 py-4 bg-parchment text-ink hover:bg-gold transition-colors duration-300 min-w-[200px] text-center"
          >
            Commission a Piece
          </a>
          <a
            href="#gallery"
            className="font-sans text-[11px] tracking-[0.25em] uppercase px-8 py-4 border border-ink-border text-parchment-dim hover:text-parchment hover:border-parchment/20 transition-colors duration-300 min-w-[200px] text-center"
          >
            View Gallery
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-sans text-[9px] tracking-[0.45em] uppercase text-parchment-mute">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-parchment-mute to-transparent"
        />
      </motion.div>
    </section>
  )
}
