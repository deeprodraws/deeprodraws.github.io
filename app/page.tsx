import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import Achievements from '@/components/Achievements'
import Commissions from '@/components/Commissions'
import Prints from '@/components/Prints'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-ink min-h-screen">
      <Navigation />
      <Hero />
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
