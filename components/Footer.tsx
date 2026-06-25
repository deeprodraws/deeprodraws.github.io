'use client'

import FadeIn from './FadeIn'

const navLinks = [
  { label: 'Gallery',      href: '#gallery' },
  { label: 'About',        href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Prints',       href: '/prints' },
  { label: 'Work With Me', href: '#commission' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-10 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          {/* Giant wordmark */}
          <a
            href="/"
            className="block font-serif leading-none text-white hover:text-white/60 transition-colors duration-200 mb-12"
            style={{ fontSize: 'clamp(4rem,16vw,13rem)' }}
          >
            DEEPRODRAWS
          </a>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Contact */}
            <div className="flex flex-col gap-3">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25 mb-1">Connect</p>
              <a
                href="https://instagram.com/deeprodraws"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-sans text-sm text-white/50 hover:text-white transition-colors duration-200 min-h-[44px]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                @deeprodraws
              </a>
              <a
                href="mailto:mikichowdhury@gmail.com"
                className="flex items-center gap-2.5 font-sans text-sm text-white/50 hover:text-white transition-colors duration-200 min-h-[44px]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                mikichowdhury@gmail.com
              </a>
            </div>

            {/* Nav */}
            <div className="flex flex-col gap-2">
              <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/25 mb-1">Navigate</p>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6">
            <p className="font-sans text-xs text-white/20">
              © 2026 Deepro Chowdhury · DeeproDraws
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
