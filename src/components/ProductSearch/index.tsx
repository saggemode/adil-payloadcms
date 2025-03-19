'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Barcode } from 'lucide-react'
import BarcodeScanner from '../BarcodeScanner'
import { useRouter } from 'next/navigation'

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleBarcodeScan = (barcode: string) => {
    router.push(`/search?barcode=${encodeURIComponent(barcode)}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowScanner(!showScanner)}
          className="flex items-center gap-2"
        >
          <Barcode className="h-4 w-4" />
          Scan
        </Button>
      </form>

      {showScanner && (
        <div className="mt-4">
          <BarcodeScanner onScan={handleBarcodeScan} />
        </div>
      )}
    </div>
  )
}
