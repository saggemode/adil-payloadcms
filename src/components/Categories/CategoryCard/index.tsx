'use client'
import React from 'react'
import Link from 'next/link'
//import { Category, Media } from '@/payload-types'
import { useFilter } from '@/providers/Filter'

type CategoryCardProps = {
  category: string
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // const media = category.media as Media

  const { setCategoryFilters } = useFilter()

  return (
    <Link
      href="/products"
      className="relative min-h-[360px] w-full flex items-end justify-center p-5 cursor-pointer bg-cover bg-center bg-no-repeat"
      //style={{ backgroundImage: `url(${media.url})` }}
      //style={{ backgroundImage: media ? `url(${media.url})` : 'none' }}
      onClick={() => setCategoryFilters([String(category)])}
    >
      <p className="rounded-lg p-4 w-full text-center bg-white text-black dark:bg-gray-800 dark:text-white">
        {category}
      </p>
    </Link>
  )
}

export default CategoryCard
