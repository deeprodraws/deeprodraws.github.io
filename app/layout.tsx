import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DeeproDraws · Charcoal Portraits by Deepro C.',
  description:
    'Charcoal portraits from my hand to your wall. Custom commissions, pet portraits, and fine art prints by Deepro C., based in Belmont, CA.',
  keywords: [
    'charcoal artist',
    'portrait artist',
    'custom portraits',
    'charcoal portraits',
    'Belmont CA',
    'DeeproDraws',
    'Deepro Chowdhury',
    'pet portraits',
  ],
  openGraph: {
    title: 'DeeproDraws · Charcoal Portraits by Deepro C.',
    description: 'Charcoal portraits from my hand to your wall.',
    type: 'website',
    url: 'https://deeprodraws.github.io',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
