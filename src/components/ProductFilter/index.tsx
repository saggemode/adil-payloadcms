'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarIcon, XIcon, FilterX } from 'lucide-react'
import { cn } from '@/utilities/ui'

const RATINGS = ['4 & up', '3 & up', '2 & up', '1 & up']

interface ProductFilterProps {
  categories: string[]
  sizes: string[]
  colors: string[]
  tags: string[]
  className?: string
  showCard?: boolean
}

export default function ProductFilter({
  categories,
  sizes,
  colors,
  tags,
  className,
  showCard = true,
}: ProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('query') || '')

  const [filters, setFilters] = useState({
    query: searchParams?.get('query') || '',
    category: searchParams?.get('category') || 'all',
    brand: searchParams?.get('brand') || 'all',
    color: searchParams?.get('color') || 'all',
    size: searchParams?.get('size') || 'all',
    tag: searchParams?.get('tag') || 'all',
    price: searchParams?.get('price') || '0-1000000',
    rating: searchParams?.get('rating') || 'all',
    sort: searchParams?.get('sort') || 'newest-arrivals',
    page: searchParams?.get('page') || '1',
  })

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      handleFilterChange('query', query)
      applyFilters()
    }, 500),
    [],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Update filters when URL changes
  useEffect(() => {
    const query = searchParams?.get('query') || ''
    setSearchQuery(query)
    setFilters({
      query,
      category: searchParams?.get('category') || 'all',
      brand: searchParams?.get('brand') || 'all',
      color: searchParams?.get('color') || 'all',
      size: searchParams?.get('size') || 'all',
      tag: searchParams?.get('tag') || 'all',
      price: searchParams?.get('price') || '0-1000000',
      rating: searchParams?.get('rating') || 'all',
      sort: searchParams?.get('sort') || 'newest-arrivals',
      page: searchParams?.get('page') || '1',
    })
  }, [searchParams])

  // Debounce function
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: '1', // Reset page when filter changes
    }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    const defaultFilters = {
      query: '',
      category: 'all',
      brand: 'all',
      color: 'all',
      size: 'all',
      tag: 'all',
      price: '0-1000000',
      rating: 'all',
      sort: 'newest-arrivals',
      page: '1',
    }
    setFilters(defaultFilters)
    router.push('/products')
  }

  const applyFilters = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      // Only add non-default values to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          // Handle price range specially
          if (key === 'price' && value === '0-1000000') {
            return // Skip default price range
          }
          // Ensure query is properly encoded
          if (key === 'query') {
            params.set(key, value.trim().toLowerCase())
          } else {
            params.set(key, value)
          }
        }
      })

      // Ensure proper encoding of parameters
      const queryString = params.toString()
      const url = queryString ? `/products?${queryString}` : '/products'
      await router.push(url)
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get active filters for badges
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && key !== 'page' && key !== 'sort',
  )

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Active Filters</label>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
              <FilterX className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {value}
                <XIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleFilterChange(key, 'all')}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Products</label>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full"
        />
      </div>

      {/* Tag Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tag</label>
        <Select value={filters.tag} onValueChange={(value) => handleFilterChange('tag', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Color</label>
        <Select value={filters.color} onValueChange={(value) => handleFilterChange('color', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {colors.map((color) => (
              <SelectItem key={color.toLowerCase()} value={color.toLowerCase()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  {color}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Size</label>
        <Select value={filters.size} onValueChange={(value) => handleFilterChange('size', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {sizes.map((size) => (
              <SelectItem key={size} value={size.toLowerCase()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <Slider
          defaultValue={[0, 1000000]}
          value={[
            Number(filters.price.split('-')[0] || '0'),
            Number(filters.price.split('-')[1] || '1000000'),
          ]}
          max={1000000}
          step={10}
          onValueChange={(value: [number, number]) => {
            const formattedPrice = `${Math.floor(value[0])}-${Math.floor(value[1])}`
            handleFilterChange('price', formattedPrice)
          }}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>₦{Number(filters.price.split('-')[0] || '0').toLocaleString()}</span>
          <span>₦{Number(filters.price.split('-')[1] || '1000000').toLocaleString()}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <Select
          value={filters.rating}
          onValueChange={(value) => handleFilterChange('rating', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {RATINGS.map((rating) => (
              <SelectItem key={rating} value={rating.split(' ')[0] as string}>
                <div className="flex items-center">
                  <span>{rating}</span>
                  <StarIcon className="w-4 h-4 ml-1 text-yellow-400" />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest-arrivals">Newest Arrivals</SelectItem>
            <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
            <SelectItem value="best-selling">Best Selling</SelectItem>
            <SelectItem value="avg-customer-review">Average Review</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  if (!showCard) {
    return <FilterContent />
  }

  return (
    <Card className={cn('p-4', className)}>
      <CardContent className="space-y-4">
        <FilterContent />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={clearFilters} disabled={isLoading}>
          Reset
        </Button>
        <Button onClick={applyFilters} disabled={isLoading}>
          {isLoading ? 'Applying...' : 'Apply Filters'}
        </Button>
      </CardFooter>
    </Card>
  )
}
