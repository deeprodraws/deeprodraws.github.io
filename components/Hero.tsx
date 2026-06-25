'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Mountain moves more (faster parallax) — portrait study moves less (slower)
  const yMain      = useTransform(scrollYProgress, [0, 1], [0, -220])
  const ySecondary = useTransform(scrollYProgress, [0, 1], [0, -110])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen bg-black overflow-hidden flex flex-col"
    >
      {/*
        Mountain landscape — top-right.
        Use natural 4:3 aspect ratio so it reads as landscape, not portrait.
        Wide enough to bleed off the right edge.
      */}
      <motion.div
        style={{ y: yMain }}
        className="absolute top-0 right-0 w-[60vw] md:w-[54vw] z-10 pointer-events-none"
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img
            src="/images/large_mountain.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-black to-transparent" />
        </div>
      </motion.div>

      {/*
        Portrait study — bottom-right.
        Previously hidden on mobile and positioned bottom-left (behind text).
        Now visible on mobile, positioned bottom-right so it never conflicts
        with the left-aligned text block.
      */}
      <motion.div
        style={{ y: ySecondary }}
        className="absolute bottom-0 right-0 w-[42vw] md:w-[22vw] z-10 pointer-events-none"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src="/images/portrait_study.jpeg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            loading="eager"
          />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent" />
        </div>
      </motion.div>

      {/* Text — pushed to bottom-left, well clear of the right-side images */}
      <div className="relative z-20 flex flex-col justify-end flex-1 px-6 md:px-12 pb-14 pt-32">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(5rem,18vw,16rem)] leading-[0.85] text-white"
          >
            I'M DEEPRO
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <p className="font-sans text-sm text-white/45 max-w-xs leading-relaxed">
            I draw charcoal portraits drawn by hand.
            <br />
            Nothing digital. Nothing filtered.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#commission"
              className="font-sans text-[11px] tracking-[0.28em] uppercase px-7 py-3.5 bg-white text-black hover:bg-white/80 transition-colors duration-200 font-semibold min-h-[44px] flex items-center"
            >
              Work With Me
            </a>
            <a
              href="#gallery"
              className="font-sans text-[11px] tracking-[0.28em] uppercase px-7 py-3.5 border border-white/30 text-white/70 hover:border-white hover:text-white transition-colors duration-200 min-h-[44px] flex items-center"
            >
              See the Work
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="font-sans text-[8px] tracking-[0.5em] uppercase text-white/25">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent"
        />
      </motion.div>
    </section>
  )
}
