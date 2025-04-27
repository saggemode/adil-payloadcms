'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import useDeviceType from '@/hooks/use-device-type'

// The component has TypeScript issues, so we'll use a simplified version
// that just redirects to the download page instead of trying to handle installation directly
const AppDownloadPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const deviceType = useDeviceType()

  useEffect(() => {
    // Only show on mobile devices
    if (deviceType !== 'mobile') return

    // Check if the user has seen the prompt before
    const hasSeenPrompt = localStorage.getItem('app_prompt_seen')
    if (!hasSeenPrompt) {
      // Show the prompt after 5 seconds
      const timer = setTimeout(() => {
        try {
          setShowPrompt(true)
          // Mark as seen for 7 days
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 7)
          localStorage.setItem('app_prompt_seen', expiryDate.toISOString())
        } catch (error) {
          console.error('Error showing prompt:', error)
        }
      }, 5000)
      
      return () => clearTimeout(timer)
    } else {
      // Check if the saved date has expired
      const expiryDate = new Date(hasSeenPrompt)
      if (new Date() > expiryDate) {
        localStorage.removeItem('app_prompt_seen')
      }
    }
  }, [deviceType])

  const handleInstall = () => {
    // Redirect to download page instead of handling install directly
    window.location.href = '/download'
  }

  const handleDismiss = () => {
    try {
      setShowPrompt(false)
    } catch (error) {
      console.error('Error hiding prompt:', error)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 shadow-lg z-50 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Get the app experience</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Add to home screen for a better shopping experience</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get App
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AppDownloadPrompt 