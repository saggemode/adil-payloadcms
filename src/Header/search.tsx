'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/constants'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface SearchClientProps {
  categories: string[]
}

const SearchClient: React.FC<SearchClientProps> = ({ categories }) => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)

    router.push(`/products?${params.toString()}`)
    setOpen(false)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-stretch h-10 relative">
      <Select value={selectedCategory} onValueChange={setSelectedCategory} name="category">
        <SelectTrigger className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-md">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
            placeholder={`Search ${APP_NAME}`}
            name="q"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
          />
        </PopoverTrigger>
        {searchQuery.length > 0 && (
          <PopoverContent className="w-[calc(100vw-4rem)] md:w-[40rem] p-0" align="start">
            <Command>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem
                  onSelect={() => {
                    setSearchQuery(searchQuery)
                    handleSearch({ preventDefault: () => {} } as React.FormEvent)
                  }}
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search for &ldquo;{searchQuery}&rdquo;
                </CommandItem>
                {/* Add recent searches or popular suggestions here */}
              </CommandGroup>
            </Command>
          </PopoverContent>
        )}
      </Popover>

      <button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2"
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  )
}

export default SearchClient
