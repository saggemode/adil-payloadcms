'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  StarIcon, 
  XIcon, 
  FilterIcon, 
  FilterX, 
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  Tag
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet'

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

// Function to get default price range based on maxPrice
const getDefaultPriceRange = (maxPrice: number) => `0-${maxPrice}`

// Types
type SortOption = typeof SORT_OPTIONS[number]['value']
type Rating = typeof RATINGS[number]

interface Category {
  id: string | number
  title: string
}

interface Brand {
  id: string | number
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
  inStock: boolean
  onSale: boolean
  featured: boolean
}

interface AdvancedProductFilterProps {
  categories: Category[]
  brands: Brand[]
  sizes: string[]
  colors: string[]
  tags: string[]
  maxPrice?: number
  className?: string
  isMobile?: boolean
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
  inStock: false,
  onSale: false,
  featured: false
}

export default function AdvancedProductFilter({
  categories,
  brands,
  sizes,
  colors,
  tags,
  maxPrice = 1000000,
  className,
  isMobile = false,
  showCard = true
}: AdvancedProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    price: getDefaultPriceRange(maxPrice)
  })
  const [isOpen, setIsOpen] = useState(false)
  
  // Add debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Add debounce function
  const debounce = useCallback((fn: () => void, delay: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      fn()
      debounceTimerRef.current = null
    }, delay)
  }, [])

  // Add mounted check to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
    const query = searchParams?.get('query') || ''
    setSearchQuery(query)
  }, [searchParams])

  // Move initial filter setup to useEffect
  useEffect(() => {
    if (!mounted) return

    const params = new URLSearchParams(searchParams?.toString() || '')
    
    // Extract and validate all filter parameters
    setFilters({
      query: params.get('query') || '',
      category: params.get('category') || 'all',
      brand: params.get('brand') || 'all',
      color: params.get('color') || 'all',
      size: params.get('size') || 'all',
      tag: params.get('tag') || 'all',
      price: params.get('price') || getDefaultPriceRange(maxPrice),
      rating: params.get('rating') || 'all',
      sort: (params.get('sort') as SortOption) || 'newest-arrivals',
      page: params.get('page') || '1',
      inStock: params.get('inStock') === 'true',
      onSale: params.get('onSale') === 'true',
      featured: params.get('featured') === 'true'
    })
  }, [searchParams, mounted, maxPrice])

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: '1', // Reset page when filter changes
      };
      
      // Use debounce to avoid too many requests during rapid changes
      debounce(() => {
        const params = new URLSearchParams();
        
        // Only add non-default values to URL
        Object.entries(newFilters).forEach(([paramKey, paramValue]) => {
          // Skip empty values and default values
          if (
            paramValue === '' || 
            paramValue === 'all' || 
            (paramKey === 'price' && paramValue === getDefaultPriceRange(maxPrice)) ||
            (paramKey === 'sort' && paramValue === 'newest-arrivals') ||
            (paramKey === 'page' && paramValue === '1') ||
            (typeof paramValue === 'boolean' && paramValue === false)
          ) {
            return;
          }

          // Handle special cases
          if (paramKey === 'query') {
            params.set(paramKey, typeof paramValue === 'string' ? paramValue.trim().toLowerCase() : String(paramValue));
          } else {
            params.set(paramKey, String(paramValue));
          }
        });

        const queryString = params.toString();
        const url = queryString ? `/products?${queryString}` : '/products';
        router.push(url);
      }, 400); // 400ms debounce delay
      
      return newFilters;
    });
  }, [router, maxPrice, debounce]);

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
        // Skip empty values and default values
        if (
          value === '' || 
          value === 'all' || 
          (key === 'price' && value === getDefaultPriceRange(maxPrice)) ||
          (key === 'sort' && value === 'newest-arrivals') ||
          (key === 'page' && value === '1') ||
          (typeof value === 'boolean' && value === false)
        ) {
          return
        }

        // Handle special cases
        if (key === 'query') {
          params.set(key, typeof value === 'string' ? value.trim().toLowerCase() : String(value));
        } else {
          params.set(key, String(value));
        }
      })

      const queryString = params.toString()
      const url = queryString ? `/products?${queryString}` : '/products'
      router.push(url)
      
      // If mobile, close the sheet after applying filters
      if (isMobile) {
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filters, router, isMobile, maxPrice])

  // Get active filters for badges
  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      // Include boolean values that are true
      if (typeof value === 'boolean') {
        return value === true
      }
      
      // Include non-default values
      return value && 
        value !== 'all' && 
        key !== 'page' && 
        key !== 'sort' &&
        !(key === 'price' && value === getDefaultPriceRange(maxPrice))
    })
  }, [filters, maxPrice])

  const FilterContent = () => {
    // Default open accordion items based on viewport
    const defaultOpenItems = isMobile 
      ? ['search', 'sort', 'categories', 'price', 'brands', 'colors', 'sizes', 'tags', 'rating', 'availability'] 
      : ['search', 'sort', 'categories', 'price'];
    
    return (
      <div className="space-y-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-2">
                <FilterIcon size={16} />
                <span>Active Filters</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                <FilterX className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => {
                // Format the label based on the filter type
                const label = key
                
                // Format boolean values
                if (typeof value === 'boolean') {
                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      {key === 'inStock' ? 'In Stock' : 
                       key === 'onSale' ? 'On Sale' : 
                       key === 'featured' ? 'Featured' : key}
                      <XIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange(key as keyof FilterState, false)}
                      />
                    </Badge>
                  )
                }
                
                // Format price range
                if (key === 'price') {
                  const [min, max] = (value as string).split('-')
                  return (
                    <Badge key={key} variant="secondary" className="flex items-center gap-1">
                      Price: ₦{Number(min).toLocaleString()} - ₦{Number(max).toLocaleString()}
                      <XIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleFilterChange('price', getDefaultPriceRange(maxPrice))}
                      />
                    </Badge>
                  )
                }
                
                // Format other values
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    <XIcon
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange(key as keyof FilterState, 'all')}
                    />
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Accordion Filters */}
        <Accordion type="multiple" defaultValue={defaultOpenItems}>
          {/* Search Filter */}
          <AccordionItem value="search">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Search size={16} />
                <span>Search</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>

          {/* Sort Options */}
          <AccordionItem value="sort">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} />
                <span>Sort By</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>

          {/* Categories Filter */}
          <AccordionItem value="categories">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span>Categories</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
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
                    <SelectItem key={`cat-${category.id}`} value={String(category.id)}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">₦</span>
                <span>Price Range</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0, maxPrice]}
                  value={[
                    Number(filters.price.split('-')[0] || '0'),
                    Number(filters.price.split('-')[1] || maxPrice.toString()),
                  ]}
                  max={maxPrice}
                  step={10000}
                  onValueChange={(value: [number, number]) => {
                    const formattedPrice = `${Math.floor(value[0])}-${Math.floor(value[1])}`
                    handleFilterChange('price', formattedPrice)
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₦{Number(filters.price.split('-')[0] || '0').toLocaleString()}</span>
                  <span>₦{Number(filters.price.split('-')[1] || maxPrice.toString()).toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands Filter */}
          <AccordionItem value="brands">
            <AccordionTrigger className="py-3">
              <span>Brands</span>
            </AccordionTrigger>
            <AccordionContent>
              <Select
                value={filters.brand}
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={`brand-${brand.id}`} value={String(brand.id)}>
                      {brand.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Colors Filter */}
          <AccordionItem value="colors">
            <AccordionTrigger className="py-3">
              <span>Colors</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filters.color === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('color', 'all')}
                >
                  All
                </Badge>
                {colors.map((color) => (
                  <div 
                    key={color.toLowerCase()} 
                    className={cn(
                      "p-3 rounded-full border cursor-pointer",
                      filters.color === color.toLowerCase() ? "ring-2 ring-offset-2 ring-primary" : ""
                    )}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleFilterChange('color', color.toLowerCase())}
                    title={color}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sizes Filter */}
          <AccordionItem value="sizes">
            <AccordionTrigger className="py-3">
              <span>Sizes</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={filters.size === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('size', 'all')}
                >
                  All
                </Badge>
                {sizes.map((size) => (
                  <Badge 
                    key={size} 
                    variant={filters.size === size.toLowerCase() ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('size', size.toLowerCase())}
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Tags Filter */}
          <AccordionItem value="tags">
            <AccordionTrigger className="py-3">
              <span>Tags</span>
            </AccordionTrigger>
            <AccordionContent>
              <Select
                value={filters.tag}
                onValueChange={(value) => handleFilterChange('tag', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {tags.filter(Boolean).map((tag) => (
                    <SelectItem key={tag} value={tag.toLowerCase()}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Rating Filter */}
          <AccordionItem value="rating">
            <AccordionTrigger className="py-3">
              <span>Rating</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {RATINGS.map((rating) => {
                  const stars = parseInt(rating.split(' ')[0] || '0')
                  return (
                    <div 
                      key={rating}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                        filters.rating === stars.toString() ? "bg-gray-100 dark:bg-gray-800" : ""
                      )}
                      onClick={() => handleFilterChange('rating', stars.toString())}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={cn(
                              "w-4 h-4", 
                              i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-sm">{rating}</span>
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Availability Options */}
          <AccordionItem value="availability">
            <AccordionTrigger className="py-3">
              <span>Availability</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock" 
                    checked={filters.inStock}
                    onCheckedChange={(checked) => 
                      handleFilterChange('inStock', checked === true)
                    }
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="on-sale" 
                    checked={filters.onSale}
                    onCheckedChange={(checked) => 
                      handleFilterChange('onSale', checked === true)
                    }
                  />
                  <label
                    htmlFor="on-sale"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    On Sale
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={filters.featured}
                    onCheckedChange={(checked) => 
                      handleFilterChange('featured', checked === true)
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  // Mobile view uses a sheet drawer
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto pb-20" side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filters apply automatically as you select them
              </SheetDescription>
            </SheetHeader>
            <div className="pt-4 pb-16">
              <FilterContent />
            </div>
            <SheetFooter className="sticky bottom-0 bg-background pt-2 border-t mt-auto">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {/* Show active filter count as badge */}
        {activeFilters.length > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-2 font-normal"
          >
            {activeFilters.length} active
          </Badge>
        )}
      </>
    )
  }

  // Desktop view uses a card
  return (
    <Card className={cn('sticky top-24', className)}>
      <CardContent>
        <FilterContent />
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      </CardFooter>
    </Card>
  )
}