'use client'

import dynamic from 'next/dynamic'

// Import the AppDownloadPrompt dynamically with ssr disabled
const AppDownloadPrompt = dynamic(() => import('./AppDownloadPrompt'), {
  ssr: false
})

export default function AppDownloadWrapper() {
  return <AppDownloadPrompt />
} 