'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Gallery',      href: '#gallery' },
  { label: 'About',        href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Prints',       href: '/prints' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // On subpages, resolve anchor links back to the homepage
  const resolveHref = (href: string) =>
    href.startsWith('#') && pathname !== '/' ? `/${href}` : href

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
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-black border-b border-white/15' : 'bg-transparent'
        }`}
      >
        <a
          href="/"
          className="font-serif text-2xl text-white hover:text-white/60 transition-colors duration-200 tracking-widest"
        >
          DEEPRODRAWS
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={resolveHref(link.href)}
              className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href={resolveHref('#commission')}
            className="font-sans text-[10px] tracking-[0.3em] uppercase px-5 py-2.5 border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 font-semibold min-h-[44px] flex items-center"
          >
            Work With Me
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 flex flex-col gap-[5px] z-[60] min-w-[44px] min-h-[44px] items-center justify-center"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={resolveHref(link.href)}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                className="font-serif text-6xl text-white hover:text-white/50 transition-colors duration-200 min-h-[44px] flex items-center"
              >
                {link.label.toUpperCase()}
              </motion.a>
            ))}
            <motion.a
              href={resolveHref('#commission')}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="font-sans text-xs tracking-[0.3em] uppercase border border-white text-white px-8 py-4 hover:bg-white hover:text-black transition-colors duration-200 min-h-[44px] flex items-center"
            >
              Work With Me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
