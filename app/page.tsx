import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import Achievements from '@/components/Achievements'
import Commissions from '@/components/Commissions'
import Prints from '@/components/Prints'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navigation />
      <Hero />
      <Marquee />
      <Gallery />
      <About />
      <Achievements />
      <Commissions />
      <Prints />
      <Testimonials />
      <Footer />
    </main>
  )
}
