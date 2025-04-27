'use client'

import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'
import { FiSliders } from 'react-icons/fi'
import { Button } from './ui/button'
import AdvancedProductFilter from './AdvancedProductFilter'

interface MobileFiltersProps {
  categories: { id: string; title: string }[]
  brands: { id: string; title: string }[]
  sizes: string[]
  colors: string[]
  tags: string[]
  maxPrice?: number
}

const MobileFilters = ({ categories, brands, sizes, colors, tags, maxPrice }: MobileFiltersProps) => {
  return (
    <AdvancedProductFilter
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      tags={tags}
      maxPrice={maxPrice}
      isMobile={true}
    />
  )
}

export default MobileFilters
