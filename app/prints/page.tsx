import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { prints } from '@/data/prints'

export const metadata = {
  title: 'Prints — DeeproDraws',
  description: 'Original charcoal work, printed on premium paper and shipped to your door.',
}

export default function PrintsIndexPage() {
  return (
    <>
      <Navigation />
      <main className="bg-black min-h-screen pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-16 border-b border-white/10 pb-16">
            <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">
              Available Now
            </p>
            <h1 className="font-serif text-[clamp(5rem,18vw,14rem)] leading-[0.85] text-white">
              PRINTS
            </h1>
            <p className="font-sans text-sm text-white/45 mt-6 max-w-md leading-relaxed">
              Original charcoal work, printed on premium paper and shipped to your door.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {prints.map((print) => (
              <div key={print.slug} className="group">
                <div className={`${print.aspectClass} relative overflow-hidden mb-4`}>
                  <img
                    src={`/images/${print.image}`}
                    alt={print.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-sm font-semibold text-white leading-tight">
                      {print.title}
                    </p>
                    <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/35 mt-1">
                      Available as print
                    </p>
                  </div>
                  <Link
                    href={`/prints/${print.slug}`}
                    className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 hover:text-white border-b border-white/20 hover:border-white/60 pb-px transition-colors flex-shrink-0 flex items-center min-h-[44px]"
                  >
                    Order This Print
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="font-sans text-xs text-white/30 mt-20 max-w-md leading-relaxed">
            Don&rsquo;t see what you&rsquo;re looking for?{' '}
            <a
              href="https://instagram.com/deeprodraws"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white border-b border-white/25 hover:border-white/60 pb-px transition-colors"
            >
              DM me on Instagram
            </a>{' '}
            — most pieces are available on request.
          </p>

        </div>
      </main>
      <Footer />
    </>
  )
}
