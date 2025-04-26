'use client'
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useCategoriesWithProducts } from '@/hooks/useCategories';

// Define Category interface
interface Category {
  id: string;
  title: string;
  slug: string;
}

export const FeaturedCategories = () => {
  const { data, isLoading } = useCategoriesWithProducts();
  const categories = data?.docs || [];

  // Category icons mapping (emoji based)
  const categoryIcons: Record<string, string> = {
    'electronics': '📱',
    'clothing': '👕',
    'home': '🏠',
    'kitchen': '🍳',
    'beauty': '💄',
    'toys': '🧸',
    'sports': '⚽',
    'automotive': '🚗',
    'jewelry': '💍',
    'garden': '🌱',
    'office': '💼',
    'books': '📚',
    'health': '💊',
    'pet-supplies': '🐾',
    'baby': '👶',
    'furniture': '🛋️',
  };

  // Fallback icon if category doesn't match our mapping
  const getIcon = (slug: string) => {
    for (const key in categoryIcons) {
      if (slug.toLowerCase().includes(key)) {
        return categoryIcons[key];
      }
    }
    return '🛍️'; // Default shopping bag icon
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of categories to find what you need
        </p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {categories.length > 0 ? (
          categories.slice(0, 16).map((category: Category) => (
            <Link 
              href={`/categories/${category.slug}`} 
              key={category.id}
              className="group"
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 h-full">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {getIcon(category.slug)}
                  </div>
                  <h3 className="text-xs font-medium line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <span className="text-xs text-blue-600 mt-1 hidden group-hover:block">
                    View All →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No categories available.</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link 
          href="/categories"
          className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center"
        >
          View All Categories
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}; 