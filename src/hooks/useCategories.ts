import { useQuery } from '@tanstack/react-query'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  })
}

// Client-safe function to fetch categories
async function fetchCategoriesWithProducts() {
  try {
    // Using fetch API instead of direct server imports
    const response = await fetch('/api/categories?depth=1&limit=16');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export function useCategoriesWithProducts() {
  return useQuery({
    queryKey: ['categoriesWithProducts'],
    queryFn: fetchCategoriesWithProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
