import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DeeproDraws · Charcoal Portraits by Deepro C.',
  icons: {
    icon: [{ url: '/images/favicon.svg', type: 'image/svg+xml' }],
  },
  description:
    'Charcoal portraits by hand. Custom commissions, pet portraits, and fine art prints by Deepro C., based in Belmont, CA.',
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
    description: 'Charcoal portraits by hand.',
    type: 'website',
    url: 'https://deeprodraws.github.io',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Script src="https://forminit.com/sdk/v1/forminit.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
