import type { Metadata } from 'next'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React, { Suspense } from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import ClientCompareBar from '@/components/ClientCompareBar'
import { APP_NAME, APP_DESCRIPTION } from '@/constants'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import Script from 'next/script'

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}

// Loading Component
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Loading...</div>
    </div>
  )
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#33A1E6" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <Providers>
            <Suspense fallback={<LoadingScreen />}>
              <Header className="fixed  top-0 left-0 right-0 z-50 bg-background/80 before:absolute before:inset-0 before:bg-background/90 before:-z-10 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80" />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
              <ClientCompareBar />
            </Suspense>
          </Providers>
        </ErrorBoundary>
        <Script src="/js/pwa-register.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph({
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: 'website'
  }),
  twitter: {
    card: 'summary_large_image',
    creator: '@auxdoriz',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default'
  }
}
