'use client'

import FadeIn from './FadeIn'

const navLinks = [
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Commission', href: '#commission' },
  { label: 'Prints', href: '#prints' },
]

export default function Footer() {
  return (
    <footer className="bg-ink-light border-t border-ink-border py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-14">
            {/* Brand */}
            <div className="max-w-xs">
              <a
                href="#"
                className="font-serif text-2xl text-parchment hover:text-gold transition-colors duration-300 block mb-2"
              >
                DeeproDraws
              </a>
              <p className="font-sans text-xs text-parchment-mute leading-relaxed">
                Charcoal portraits by hand.
                <br />
                Belmont, CA.
              </p>
            </div>

            {/* Links columns */}
            <div className="flex gap-16 sm:gap-20">
              {/* Social / contact */}
              <div>
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-parchment-mute mb-4">
                  Connect
                </p>
                <div className="space-y-3">
                  <a
                    href="https://instagram.com/deeprodraws"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 font-sans text-sm text-parchment-dim hover:text-parchment transition-colors duration-300"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                    </svg>
                    @deeprodraws
                  </a>
                  <a
                    href="mailto:mikichowdhury@gmail.com"
                    className="flex items-center gap-2.5 font-sans text-sm text-parchment-dim hover:text-parchment transition-colors duration-300"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    mikichowdhury@gmail.com
                  </a>
                  <a
                    href="https://deeprodraws.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 font-sans text-sm text-parchment-dim hover:text-parchment transition-colors duration-300"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    deeprodraws.github.io
                  </a>
                </div>
              </div>

              {/* Navigation */}
              <div>
                <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-parchment-mute mb-4">
                  Navigate
                </p>
                <div className="space-y-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block font-sans text-sm text-parchment-dim hover:text-parchment transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-ink-border pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-sans text-xs text-parchment-mute">
              © 2026 Deepro Chowdhury · DeeproDraws
            </p>
            <p className="font-sans text-xs text-parchment-mute">
              All artwork original and hand-drawn.
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  )
}
