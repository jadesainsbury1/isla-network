import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ISLA — The Concierge Network | Ibiza 2026',
  description: 'The commission tracking platform for Ibiza concierges and venues. Track every euro you are owed. Never lose a commission again. Free for concierges. From 500 per year for venues.',
  keywords: 'concierge commission tracking Ibiza, Ibiza venue network 2026, concierge platform Ibiza, commission management hospitality, Ibiza GRM platform, venue concierge software Ibiza, ISLA network',
  openGraph: {
    title: 'ISLA — The Concierge Network | Ibiza 2026',
    description: 'Never lose a commission again. The infrastructure layer for Ibiza hospitality professionals.',
    url: 'https://islanetwork.es',
    siteName: 'ISLA — The Concierge Network',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISLA — The Concierge Network | Ibiza 2026',
    description: 'Never lose a commission again. Free for concierges. From 500/yr for venues.',
  },
  metadataBase: new URL('https://islanetwork.es'),
  alternates: { canonical: 'https://islanetwork.es' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap' rel='stylesheet' />
      </head>
      <body>{children}</body>
    </html>
  )
}
