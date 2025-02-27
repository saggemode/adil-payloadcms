'use client'

import React from 'react'
import { useFilter } from '@/providers/Filter'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

const Filters = ({ categories }: { categories: string[] }) => {
  const { categoryFilters, sort, setCategoryFilters, setSort } = useFilter()

  const handleCategories = (categoryId: string) => {
    setCategoryFilters((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  return (
    <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:gap-10 sm:flex-col sm:gap-5">
      <div>
        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Product Categories
        </h6>
        <div className="mt-5 flex flex-wrap gap-4">
          {categories.map((category) => (
            <div className="flex items-center space-x-2" key={category}>
              <Checkbox
                checked={categoryFilters.includes(category)}
                onCheckedChange={() => handleCategories(category)}
              />
              <label className="text-gray-700 dark:text-gray-300">{category}</label>
            </div>
          ))}
        </div>

        <hr className="my-5 border-gray-300 dark:border-gray-600" />
        <h6 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sort By</h6>
        <RadioGroup className="mt-5 flex flex-col gap-4" value={sort} onValueChange={setSort}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="-createdAt" />
            <label className="text-gray-700 dark:text-gray-300">Latest</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createdAt" />
            <label className="text-gray-700 dark:text-gray-300">Oldest</label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

export default Filters
