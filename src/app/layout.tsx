import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CareSphere — Women\'s Health & UTI Awareness Platform',
    template: '%s | CareSphere',
  },
  description:
    'CareSphere is a personalized health education platform focused on women\'s wellness and UTI awareness. Understand symptoms, build prevention habits, learn about your health, and get AI-powered guidance.',
  keywords: [
    'women\'s health',
    'UTI awareness',
    'cycle tracking',
    'PCOS education',
    'PCOD awareness',
    'health education',
    'symptom tracking',
    'AI health assistant',
  ],
  authors: [{ name: 'CareSphere Health Team' }],
  openGraph: {
    title: 'CareSphere — Women\'s Health & UTI Awareness',
    description: 'Understand your health. Prevent issues. Learn & care for yourself.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
}

import { GlobalErrorHandler } from '@/components/common/GlobalErrorHandler'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/select-role"
      signUpFallbackRedirectUrl="/select-role"
      afterSignOutUrl="/"
    >
      <html
        lang="en"
        data-scroll-behavior="smooth"
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable}`}
      >
        <body className="antialiased" suppressHydrationWarning>
          <GlobalErrorHandler />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
