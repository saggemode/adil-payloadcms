'use client'

import { SearchIcon, History } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/constants'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface SearchClientProps {
  categories: { id: string; title: string }[]
}

const MAX_RECENT_SEARCHES = 5;

const SearchClient: React.FC<SearchClientProps> = ({ categories }) => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    }
  }, [])

  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter(item => item !== query)
      ].slice(0, MAX_RECENT_SEARCHES);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return;
    
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)

    saveSearchToHistory(searchQuery);
    router.push(`/products?${params.toString()}`)
    setOpen(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query)
    
    const params = new URLSearchParams()
    params.set('q', query)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    
    router.push(`/products?${params.toString()}`)
    setOpen(false)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-stretch h-10 relative" role="search">
      <Select value={selectedCategory} onValueChange={setSelectedCategory} name="category">
        <SelectTrigger 
          className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-md"
          aria-label="Select category"
        >
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full focus-visible:ring-offset-0"
            placeholder={`Search ${APP_NAME}`}
            name="q"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            aria-label="Search products"
            aria-expanded={open}
          />
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-4rem)] md:w-[40rem] p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {searchQuery.length > 0 && (
                <CommandGroup heading="Search">
                  <CommandItem
                    onSelect={() => {
                      setSearchQuery(searchQuery)
                      handleSearch({ preventDefault: () => {} } as React.FormEvent)
                    }}
                  >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search for &ldquo;{searchQuery}&rdquo;
                  </CommandItem>
                </CommandGroup>
              )}
              
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  <div className="flex justify-between items-center px-2 py-1">
                    <span className="text-xs text-muted-foreground">Recent searches</span>
                    <button 
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      type="button"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((query, index) => (
                    <CommandItem 
                      key={index}
                      onSelect={() => handleRecentSearchClick(query)}
                    >
                      <History className="mr-2 h-4 w-4" />
                      {query}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Search"
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  )
}

export default SearchClient
