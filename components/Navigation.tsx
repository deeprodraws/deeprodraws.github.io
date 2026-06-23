'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Prints', href: '#prints' },
  { label: 'Commission', href: '#commission' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'bg-ink/95 backdrop-blur-md border-b border-ink-border'
            : 'bg-transparent'
        }`}
      >
        <a
          href="#"
          className="font-serif text-xl text-parchment hover:text-gold transition-colors duration-300"
        >
          DeeproDraws
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, -1).map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-parchment-dim hover:text-parchment transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#commission"
            className="font-sans text-[11px] tracking-[0.25em] uppercase px-5 py-2.5 bg-parchment text-ink hover:bg-gold transition-colors duration-300"
          >
            Commission
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 flex flex-col gap-[5px] z-[60]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            className={`block w-6 h-px bg-parchment transition-all duration-300 origin-center ${
              mobileOpen ? 'rotate-45 translate-y-[8.5px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-parchment transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-parchment transition-all duration-300 origin-center ${
              mobileOpen ? '-rotate-45 -translate-y-[8.5px]' : ''
            }`}
          />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="font-serif text-4xl text-parchment hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-xs tracking-[0.3em] uppercase text-parchment-mute mt-4"
            >
              Belmont, CA
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
