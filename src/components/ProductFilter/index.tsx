'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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

// Constants
const RATINGS = ['4 & up', '3 & up', '2 & up', '1 & up'] as const
const DEFAULT_PRICE_RANGE = '0-1000000'
const SORT_OPTIONS = [
  { value: 'newest-arrivals', label: 'Newest Arrivals' },
  { value: 'price-low-to-high', label: 'Price: Low to High' },
  { value: 'price-high-to-low', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'avg-customer-review', label: 'Average Review' },
] as const

// Types
type Rating = (typeof RATINGS)[number]
type SortOption = (typeof SORT_OPTIONS)[number]['value']

interface Category {
  id: string
  title: string
}

interface FilterState {
  query: string
  category: string
  brand: string
  color: string
  size: string
  tag: string
  price: string
  rating: string
  sort: SortOption
  page: string
}

interface ProductFilterProps {
  categories: Category[]
  sizes: string[]
  colors: string[]
  tags: string[]
  className?: string
  showCard?: boolean
}

// Default filter state
const defaultFilters: FilterState = {
  query: '',
  category: 'all',
  brand: 'all',
  color: 'all',
  size: 'all',
  tag: 'all',
  price: DEFAULT_PRICE_RANGE,
  rating: 'all',
  sort: 'newest-arrivals',
  page: '1',
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

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<FilterState>(() => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    const categoryParam = params.get('category') || 'all'
    const colorParam = params.get('color') || 'all'
    const sizeParam = params.get('size') || 'all'

    // Find category by ID
    const category = categories.find((cat) => cat.id === categoryParam)

    // Find color from URL param
    const color = colors.find((c) => c.toLowerCase() === colorParam.toLowerCase())

    // Find size from URL param
    const size = sizes.find((s) => s.toLowerCase() === sizeParam.toLowerCase())

    return {
      query: params.get('query') || '',
      category: category?.id || 'all',
      brand: params.get('brand') || 'all',
      color: color || 'all',
      size: size || 'all',
      tag: params.get('tag') || 'all',
      price: params.get('price') || DEFAULT_PRICE_RANGE,
      rating: params.get('rating') || 'all',
      sort: (params.get('sort') as SortOption) || 'newest-arrivals',
      page: params.get('page') || '1',
    }
  })

  // Update filters when URL changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    const categoryParam = params.get('category') || 'all'
    const colorParam = params.get('color') || 'all'
    const sizeParam = params.get('size') || 'all'

    // Find category by ID
    const category = categories.find((cat) => cat.id === categoryParam)

    // Find color from URL param
    const color = colors.find((c) => c.toLowerCase() === colorParam.toLowerCase())

    // Find size from URL param
    const size = sizes.find((s) => s.toLowerCase() === sizeParam.toLowerCase())

    const newFilters: FilterState = {
      query: params.get('query') || '',
      category: category?.id || 'all',
      brand: params.get('brand') || 'all',
      color: color || 'all',
      size: size || 'all',
      tag: params.get('tag') || 'all',
      price: params.get('price') || DEFAULT_PRICE_RANGE,
      rating: params.get('rating') || 'all',
      sort: (params.get('sort') as SortOption) || 'newest-arrivals',
      page: params.get('page') || '1',
    }
    setSearchQuery(newFilters.query)
    setFilters(newFilters)
  }, [searchParams, categories, colors, sizes])

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: '1', // Reset page when filter changes
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setFilters(defaultFilters)
    router.push('/products')
  }, [router])

  const applyFilters = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      // Only add non-default values to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          // Skip default values
          if (
            (key === 'price' && value === DEFAULT_PRICE_RANGE) ||
            (key === 'sort' && value === 'newest-arrivals') ||
            (key === 'page' && value === '1')
          ) {
            return
          }

          // Handle special cases
          if (key === 'query') {
            params.set(key, value.trim().toLowerCase())
          } else if (key === 'category' && value !== 'all') {
            // Use category ID directly
            params.set(key, value)
          } else if (key === 'color' && value !== 'all') {
            // Use the original color name from the colors array
            const color = colors.find((c) => c.toLowerCase() === value.toLowerCase())
            if (color) {
              params.set(key, color.toLowerCase())
            }
          } else if (key === 'size' && value !== 'all') {
            // Use the original size from the sizes array
            const size = sizes.find((s) => s.toLowerCase() === value.toLowerCase())
            if (size) {
              params.set(key, size.toLowerCase())
            }
          } else {
            params.set(key, value)
          }
        }
      })

      // Always include sort and page if they have non-default values
      if (filters.sort !== 'newest-arrivals') {
        params.set('sort', filters.sort)
      }
      if (filters.page !== '1') {
        params.set('page', filters.page)
      }

      const queryString = params.toString()
      const url = queryString ? `/products?${queryString}` : '/products'
      router.push(url)
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters, router, categories, colors, sizes])

  // Get active filters for badges
  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(
      ([key, value]) => value && value !== 'all' && key !== 'page' && key !== 'sort',
    )
  }, [filters])

  const FilterContent = useCallback(
    () => (
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
                    onClick={() => handleFilterChange(key as keyof FilterState, 'all')}
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
            onChange={(e) => {
              const query = e.target.value
              setSearchQuery(query)
              handleFilterChange('query', query)
            }}
            placeholder="Search products..."
            className="w-full"
          />
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
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <Select
            value={filters.color}
            onValueChange={(value) => handleFilterChange('color', value)}
          >
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
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
    [
      activeFilters,
      clearFilters,
      filters,
      handleFilterChange,
      searchQuery,
      categories,
      colors,
      sizes,
      tags,
    ],
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
