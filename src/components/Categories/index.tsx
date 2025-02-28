import React from 'react'
import Link from 'next/link'

import CategoryCard from './CategoryCard'
//import { Category } from '@/payload-types'

const Categories = ({ categories }: { categories: string[] }) => {
  console.log('Categories Data in Component:', categories) // ✅ Debugging step

  return (
    <section className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h3 className="font-normal text-lg">Shop by Categories</h3>
        <Link href="/products" className="text-blue-500 hover:underline">
          Show All
        </Link>
      </div>

      <div className="grid gap-8 p-0 grid-cols-1 sm:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category} category={category} />
        ))}
      </div>
    </section>
  )
}

export default Categories
