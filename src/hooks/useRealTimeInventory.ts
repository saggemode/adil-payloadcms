import { useState, useEffect, useCallback } from 'react'
import { useSocket } from './useSocket'
import { toast } from './use-toast'

interface InventoryItem {
  id: string
  name: string
  stockQuantity: number
  lowStockThreshold: number
  maxStock: number
  category: string
}

interface UseRealTimeInventoryOptions {
  threshold?: number
  categoryFilter?: string
  enableAlerts?: boolean
}

export function useRealTimeInventory({
  threshold = 20,
  categoryFilter,
  enableAlerts = true,
}: UseRealTimeInventoryOptions = {}) {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { socket, isConnected } = useSocket()

  // Fetch initial low stock items
  const fetchLowStockItems = useCallback(async () => {
    try {
      setLoading(true)
      
      // Build URL with query params
      const url = new URL('/api/inventory', window.location.origin)
      url.searchParams.append('threshold', threshold.toString())
      if (categoryFilter) {
        url.searchParams.append('category', categoryFilter)
      }
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setLowStockItems(result.data)
      } else {
        setError(result.error || 'Unknown error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory data')
      console.error('Error fetching low stock items:', err)
    } finally {
      setLoading(false)
    }
  }, [threshold, categoryFilter])

  // Handle real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return
    
    // Listen for inventory updates
    const handleInventoryUpdate = (data: { 
      product: InventoryItem, 
      previousStock: number, 
      newStock: number 
    }) => {
      setLowStockItems(prev => {
        // Check if the product is already in the list
        const exists = prev.some(item => item.id === data.product.id)
        
        // If product is now below threshold and wasn't in the list, add it
        if (!exists && data.newStock <= threshold) {
          // Show notification if alerts are enabled
          if (enableAlerts) {
            toast({
              title: 'Low Stock Alert',
              description: `${data.product.name} is now below the stock threshold with ${data.newStock} units remaining.`,
              variant: 'destructive',
            })
          }
          
          return [...prev, data.product]
        }
        
        // If product is in the list, update it
        if (exists) {
          return prev.map(item => {
            if (item.id === data.product.id) {
              // If stock went from above threshold to below, show alert
              if (enableAlerts && data.previousStock > threshold && data.newStock <= threshold) {
                toast({
                  title: 'Low Stock Alert',
                  description: `${data.product.name} is now below the stock threshold with ${data.newStock} units remaining.`,
                  variant: 'destructive',
                })
              }
              
              // Remove item if stock is now above threshold
              if (data.newStock > threshold) {
                return null
              }
              
              // Update the item with new data
              return { 
                ...item, 
                stockQuantity: data.newStock 
              }
            }
            return item
          }).filter(Boolean) as InventoryItem[]
        }
        
        return prev
      })
    }
    
    socket.on('inventory:update', handleInventoryUpdate)
    
    return () => {
      socket.off('inventory:update', handleInventoryUpdate)
    }
  }, [socket, isConnected, threshold, enableAlerts])

  // Load initial data
  useEffect(() => {
    fetchLowStockItems()
  }, [fetchLowStockItems])

  // Function to manually refresh data
  const refreshInventory = () => {
    fetchLowStockItems()
  }

  // Function to update stock quantity
  const updateStock = async (productId: string, stockChange: number, reason?: string) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          stockChange,
          reason,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update stock')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error')
      }
      
      return result.data
    } catch (err) {
      console.error('Error updating stock:', err)
      throw err
    }
  }

  // Function to update threshold settings
  const updateThreshold = async (productId: string, newThreshold: number) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          threshold: newThreshold,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update threshold')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error')
      }
      
      return result.data
    } catch (err) {
      console.error('Error updating threshold:', err)
      throw err
    }
  }

  return {
    lowStockItems,
    loading,
    error,
    refreshInventory,
    updateStock,
    updateThreshold,
    connected: isConnected,
  }
} 