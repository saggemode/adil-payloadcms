import React from 'react'
import Link from 'next/link'
import { getAllCategories } from '@/actions/categoryAction'
import { Media } from '@/components/Media'

export async function FeaturedCategories() {
  const categories = await getAllCategories()

  if (!categories?.docs?.length) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through our carefully curated collection of products across various categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.docs.map((category) => {
            if (typeof category === 'string') return null

            const { title, media, slug,id } = category

            return (
              <Link
                key={category.id}
                href={`/products?category=${id}`}
                className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-square relative">
                  {media && typeof media !== 'string' ? (
                    <Media
                      resource={media}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-semibold text-white text-center px-4">{title}</h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
