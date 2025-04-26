import React from 'react'
import BarcodeScanner from './components/BarcodeScanner'

export const metadata = {
  title: 'Barcode Scanner',
  description: 'Scan product barcodes to find products',
}

export default function BarcodeScannerPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Product Barcode Scanner</h1>
      <p className="text-gray-600 mb-8">
        Scan a product barcode to quickly find items in our store. 
        You can use your device&apos;s camera or enter a barcode manually.
      </p>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <BarcodeScanner />
      </div>
    </div>
  )
}
 