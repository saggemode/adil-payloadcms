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
import ProductFilter from './ProductFilter'

interface MobileFiltersProps {
  categories: string[]
  sizes: string[]
  colors: string[]
  tags: string[]
}

const MobileFilters = ({ categories, sizes, colors, tags }: MobileFiltersProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="h-8 w-8 rounded-full bg-[#F0F0F0] text-black p-1 md:hidden"
        >
          <FiSliders className="text-base mx-auto" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <span className="font-bold text-black text-xl">Filters</span>
            <FiSliders className="text-2xl text-black/40" />
          </div>
          <DrawerTitle className="sr-only">Product Filters</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <ProductFilter categories={categories} sizes={sizes} colors={colors} tags={tags} showCard={false} />
        </div>
        <DrawerFooter className="border-t pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileFilters
