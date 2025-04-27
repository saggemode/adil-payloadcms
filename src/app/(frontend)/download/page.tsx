'use client'

import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Download, Smartphone, CornerDownRight } from 'lucide-react'

type InstallPromptEvent = Event & {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AppDownloadPage() {
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other')
  const [installable, setInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null)

  useEffect(() => {
    // Detect user's operating system
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    if (/android/i.test(userAgent)) {
      setOs('android')
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setOs('ios')
    } else {
      setOs('other')
    }

    // Check if the app is installable (PWA)
    const beforeInstallPromptHandler = (e: Event) => {
      // Prevent default behavior
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e as InstallPromptEvent)
      setInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      // Show the installation prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Installation error:', error)
    } finally {
      // Clear the deferredPrompt
      setDeferredPrompt(null)
      setInstallable(false)
    }
  }

  const renderAppStoreButton = () => {
    if (os === 'ios') {
      return (
        <Button className="w-full md:w-auto flex items-center gap-2 bg-black text-white hover:bg-gray-800">
          <Download className="h-5 w-5" />
          Download on App Store
        </Button>
      )
    } else if (os === 'android') {
      return (
        <Button className="w-full md:w-auto flex items-center gap-2 bg-[#0F9D58] hover:bg-[#0B8043] text-white">
          <Download className="h-5 w-5" />
          Get it on Google Play
        </Button>
      )
    } else {
      return null
    }
  }

  return (
    <div className="max-w-frame mx-auto px-4 xl:px-0 py-10 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Download Our App</h1>
      <Separator className="mb-10" />
      
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Shop Smarter with Our Mobile App</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Enjoy a seamless shopping experience with faster checkout, exclusive app-only deals, and real-time order tracking.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Smartphone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Better Mobile Experience</h3>
                <p className="text-gray-600 dark:text-gray-400">Optimized interface designed specifically for mobile users</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CornerDownRight className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Offline Access</h3>
                <p className="text-gray-600 dark:text-gray-400">Browse products and view your past orders even without internet connection</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Download className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Faster Checkout</h3>
                <p className="text-gray-600 dark:text-gray-400">Save your payment details for quick and easy purchases</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            {installable && (
              <Button 
                onClick={handleInstall} 
                className="w-full md:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-5 w-5" />
                Install Web App
              </Button>
            )}
            
            {renderAppStoreButton()}
            
            <div className="text-center md:text-left mt-4 md:mt-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Or scan this QR code:</div>
              <div className="w-32 h-32 bg-gray-200 mx-auto md:mx-0 rounded-md flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">App Screenshot</span>
          </div>
        </div>
      </div>
    </div>
  )
} 