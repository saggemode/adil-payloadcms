'use client'

import { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, CameraOff, Loader2 } from 'lucide-react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onError?: (error: Error) => void
}

export default function BarcodeScanner({ onScan, onError }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for camera permissions
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true)
      })
      .catch(() => {
        setHasPermission(false)
      })
  }, [])

  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isScanning])

  const handleScan = (result: any) => {
    if (result) {
      onScan(result?.text)
      setIsScanning(false)
    } else if (result?.error) {
      if (onError) {
        onError(new Error(result.error))
      }
    }
  }

  const handleError = (error: Error) => {
    if (onError) {
      onError(error)
    }
  }

  if (hasPermission === false) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">Camera permission is required for barcode scanning</p>
            <Button
              onClick={() => {
                setHasPermission(null)
                navigator.mediaDevices
                  .getUserMedia({ video: true })
                  .then(() => {
                    setHasPermission(true)
                  })
                  .catch(() => {
                    setHasPermission(false)
                  })
              }}
            >
              Request Permission
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          {isScanning ? (
            <>
              <div className="w-full max-w-md relative">
                <div style={{ width: '100%' }}>
                  <QrReader constraints={{ facingMode: 'environment' }} onResult={handleScan} />
                </div>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-white/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white" />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsScanning(false)
                  setIsLoading(true)
                }}
                className="flex items-center gap-2"
              >
                <CameraOff className="h-4 w-4" />
                Stop Scanning
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setIsScanning(true)
                setIsLoading(true)
              }}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Start Scanning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
