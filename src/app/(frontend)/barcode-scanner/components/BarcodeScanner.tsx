'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type BarcodeScannerProps = {
  onScan?: (barcode: string) => void
  redirectToProduct?: boolean
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScan,
  redirectToProduct = true 
}) => {
  const [isScanning, setIsScanning] = useState(false)
  const [barcode, setBarcode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  // Start barcode scanner
  const startScanner = async () => {
    setError('')
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support camera access')
      return
    }

    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Could not access camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  // Stop scanner
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScanner()
      }
    }
  }, [isScanning])

  // Simulate a barcode scan for development/testing
  const simulateScan = () => {
    // Generate a sample UPC-A barcode
    const sampleBarcodes = [
      '036000291452', // Coca-Cola
      '021130126026', // Campbell's Soup
      '022000005349', // Heinz Ketchup
      '012000161155', // Pepsi
      '884912959381'  // Sample electronics
    ]
    
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)]
    if (randomBarcode) {
      handleBarcodeDetected(randomBarcode)
    }
  }

  // Handle barcode detection
  const handleBarcodeDetected = async (code: string) => {
    setBarcode(code)
    stopScanner()
    
    if (onScan) {
      onScan(code)
    }
    
    if (redirectToProduct) {
      setIsLoading(true)
      try {
        // Call our API to look up the product
        const response = await fetch(`/api/barcode-lookup?barcode=${code}`)
        const data = await response.json()
        
        if (data.success && data.product) {
          // Product found, redirect to product page
          router.push(`/products/${data.product.slug}`)
        } else {
          // No product found
          setError('No product found with this barcode')
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Error looking up barcode:', err)
        setError('Error looking up product')
        setIsLoading(false)
      }
    }
  }

  // Handle manual barcode entry
  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcode.trim()) {
      handleBarcodeDetected(barcode)
    }
  }

  return (
    <div className="barcode-scanner">
      <h2 className="text-xl font-semibold mb-4">Scan Product Barcode</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isScanning ? (
        <div className="flex flex-col space-y-4">
          <button 
            onClick={startScanner}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            {isLoading ? 'Loading...' : 'Start Camera Scanner'}
          </button>
          
          <div className="text-center my-2">OR</div>
          
          <form onSubmit={handleManualEntry} className="flex space-x-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode manually"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button 
              type="submit"
              disabled={!barcode.trim() || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
            >
              Search
            </button>
          </form>
          
          <button 
            onClick={simulateScan}
            className="text-blue-600 underline text-sm"
          >
            Simulate a scan (for testing)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border-2 border-gray-300 rounded overflow-hidden aspect-video max-w-md mx-auto">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2/3 h-1/4 border-2 border-red-500 rounded-lg opacity-70" />
            </div>
          </div>
          
          <button 
            onClick={stopScanner}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded w-full"
          >
            Cancel
          </button>
        </div>
      )}
      
      {barcode && !isScanning && !isLoading && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>Barcode: <span className="font-mono">{barcode}</span></p>
          {error && <p className="text-red-600 mt-1">{error}</p>}
        </div>
      )}
    </div>
  )
}

export default BarcodeScanner 