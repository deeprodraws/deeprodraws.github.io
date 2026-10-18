import type { Metadata } from 'next'
import NewsletterSignup from '@/components/NewsletterSignup'

export const metadata: Metadata = {
  title: 'Hello · DeeproDraws',
  description: 'Hand-drawn charcoal portraits of the ones you love, people and pets.',
}

const work = [
  { file: 'cavapoo.jpg', alt: 'Teddy, charcoal portrait of a cavapoo' },
  { file: 'lying_dog.jpg', alt: 'Food on my Mind, charcoal drawing of a dog lying down' },
  { file: 'cat_in_a_basket.jpg', alt: 'Curled, charcoal drawing of a cat in a basket' },
  { file: 'portrait_study.jpg', alt: 'Portrait Study, charcoal portrait' },
]

export default function HelloPage() {
  return (
    <main className="bg-black min-h-[100dvh] px-6 pt-7 pb-8 flex flex-col">
      <a
        href="/"
        className="self-start font-serif text-2xl text-white hover:text-white/60 transition-colors duration-200 tracking-widest"
      >
        DEEPRODRAWS
      </a>

      <section className="mt-11">
        <h1 className="font-serif text-[clamp(3.75rem,18vw,5.5rem)] leading-[0.88] text-white">
          Nice to
          <br />
          meet you.
        </h1>
        <p className="font-sans text-[15px] text-white/55 leading-relaxed mt-5 max-w-[30ch]">
          Hand-drawn charcoal portraits of the ones you love, people and pets.
        </p>
      </section>

      <section className="mt-9">
        <a
          href="/#commission"
          className="w-full min-h-[56px] px-4 py-4 flex items-center justify-center text-center bg-white text-black hover:bg-white/80 transition-colors duration-200 font-sans text-[12px] tracking-[0.18em] uppercase font-semibold"
        >
          Turn your pet into a portrait
        </a>
        <p className="font-sans text-[13px] text-white/45 text-center mt-3">
          A one-of-a-kind holiday gift. Starts at $90.
        </p>
      </section>

      <section className="mt-10 -mx-6 bg-white text-black px-5 pt-5 pb-6 text-center">
        <p className="font-serif leading-none flex items-baseline justify-center gap-[0.3em] text-[clamp(1.6rem,8.4vw,2.4rem)]">
          <span>ONLY</span>
          <span className="text-[clamp(5rem,28vw,8rem)] leading-[0.8] px-[0.04em]">6</span>
          <span>HOLIDAY SPOTS</span>
        </p>
        <p className="font-sans text-[12px] tracking-[0.28em] uppercase font-semibold text-black/60 mt-3">
          Order by December 5
        </p>
      </section>

      <NewsletterSignup />

      <p className="font-sans text-[12px] text-white/35 leading-relaxed mt-7">
        Recognized in the 2025 Congressional Art Competition and the San Mateo County Award of
        Excellence. Every piece drawn by hand, nothing digital.
      </p>

      <section className="mt-7">
        <div className="grid grid-cols-4 gap-1.5">
          {work.map((w) => (
            <img
              key={w.file}
              src={`/images/thumbs/${w.file}`}
              alt={w.alt}
              width={360}
              height={360}
              loading="lazy"
              className="w-full aspect-square object-cover"
            />
          ))}
        </div>
        <a
          href="/"
          className="inline-flex items-center min-h-[44px] mt-1 font-sans text-[12px] text-white/50 hover:text-white transition-colors"
        >
          <span className="border-b border-white/25 pb-px">See more at deeprodraws.com</span>
        </a>
      </section>

      <footer className="mt-auto pt-8">
        <div className="border-t border-white/10 pt-6 flex flex-col">
          <a
            href="https://instagram.com/deeprodraws"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 font-sans text-sm text-white/50 hover:text-white transition-colors duration-200 min-h-[44px]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            mikichowdhury@gmail.com
          </a>
          <p className="font-sans text-xs text-white/20 mt-4">© 2026 Deepro Chowdhury · DeeproDraws</p>
        </div>
      </footer>
    </main>
  )
}
