'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const parallaxX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 0.5 })
  const parallaxY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 0.5 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * -24)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * -24)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Full-bleed background image — Ken Burns drift + scroll parallax + cursor parallax */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.img
          src="/images/large_mountain.jpeg"
          alt=""
          aria-hidden
          fetchPriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ x: parallaxX, y: parallaxY }}
          initial={{ scale: 1.2 }}
          animate={{ scale: [1.2, 1.08, 1.14, 1.08] }}
          transition={{ duration: 28, times: [0, 0.35, 0.7, 1], repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      {/* Dark overlay — deepens slightly on scroll to keep text legible as it parallaxes */}
      <motion.div className="absolute inset-0 bg-black" aria-hidden style={{ opacity: overlayOpacity }} />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex flex-col justify-center flex-1 px-6 md:px-12 pt-24 pb-20"
      >
        <div className="overflow-hidden">
          <h1 className="font-serif text-[clamp(5rem,18vw,16rem)] leading-[0.85] text-white flex flex-wrap">
            {["I'M", 'DEEPRO'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: 140, opacity: 0, filter: 'blur(16px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, delay: 0.15 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-[0.25em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
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
              data-cursor="Contact"
              className="font-sans text-[11px] tracking-[0.28em] uppercase px-7 py-3.5 bg-white text-black hover:bg-white/80 transition-colors duration-200 font-semibold min-h-[44px] flex items-center"
            >
              Work With Me
            </a>
            <a
              href="#gallery"
              data-cursor="Explore"
              className="font-sans text-[11px] tracking-[0.28em] uppercase px-7 py-3.5 border border-white/30 text-white/70 hover:border-white hover:text-white transition-colors duration-200 min-h-[44px] flex items-center"
            >
              See the Work
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
