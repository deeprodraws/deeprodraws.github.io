import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PrintDetail from '@/components/PrintDetail'
import { prints } from '@/data/prints'

export function generateStaticParams() {
  return prints.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const print = prints.find((p) => p.slug === params.slug)
  return {
    title: print ? `${print.title} Print — DeeproDraws` : 'Print — DeeproDraws',
    description: print?.description || 'Order a charcoal art print from DeeproDraws.',
  }
}

export default function PrintPage({ params }: { params: { slug: string } }) {
  const print = prints.find((p) => p.slug === params.slug)
  if (!print) notFound()

  return (
    <>
      <Navigation />
      <PrintDetail print={print!} />
      <Footer />
    </>
  )
}
