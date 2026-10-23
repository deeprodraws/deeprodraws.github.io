import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Thank You — DeeproDraws',
  description: 'Thanks for your order.',
  robots: { index: false },
}

// Square sends customers here after they pay. Anyone can type this address,
// so the page only says thanks: orders are placed by the server's webhook,
// never by visiting this page.
export default function ThankYouPage() {
  return (
    <>
      <Navigation />
      <main className="bg-black min-h-screen pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-white/30 mb-4">
            Order received
          </p>
          <h1 className="font-serif text-[clamp(5rem,18vw,12rem)] leading-[0.85] text-white">
            THANK YOU
          </h1>

          <div className="mt-10 max-w-md space-y-4 font-sans text-sm text-white/55 leading-relaxed">
            <p>Your print is on its way to being made. Every one is printed to order, just for you.</p>
            <p>Square has emailed your receipt. If anything looks wrong with your order, reply to that email or write to me directly.</p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href="/prints"
              className="font-sans text-[11px] tracking-[0.28em] uppercase px-7 py-3.5 bg-white text-black hover:bg-white/80 transition-colors duration-200 font-semibold min-h-[44px] flex items-center"
            >
              See More Prints
            </a>
            <a
              href="mailto:mikichowdhury@gmail.com"
              className="font-sans text-[11px] tracking-[0.28em] uppercase px-7 py-3.5 border border-white/30 text-white/70 hover:border-white hover:text-white transition-colors duration-200 min-h-[44px] flex items-center"
            >
              Email Me
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
