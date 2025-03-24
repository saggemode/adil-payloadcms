'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Barcode } from 'lucide-react'
import BarcodeScanner from '../BarcodeScanner'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

export default function ProductSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [showScanner, setShowScanner] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Update URL when debounced search query changes
  useCallback(() => {
    if (debouncedSearchQuery) {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('q', debouncedSearchQuery)
      params.set('page', '1') // Reset to first page on new search
      router.push(`/search?${params.toString()}`)
    }
  }, [debouncedSearchQuery, router, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('q', searchQuery.trim())
      params.set('page', '1') // Reset to first page on new search
      router.push(`/search?${params.toString()}`)
    }
  }

  const handleBarcodeScan = (barcode: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('barcode', barcode)
    params.set('page', '1') // Reset to first page on new barcode scan
    router.push(`/search?${params.toString()}`)
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
