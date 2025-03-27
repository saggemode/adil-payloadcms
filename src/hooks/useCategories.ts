import { useQuery } from '@tanstack/react-query'
import { getAllCategories } from '@/actions/categoryAction'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  })
}
