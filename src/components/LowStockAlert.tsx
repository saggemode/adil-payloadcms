'use client'

import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useStockNotifications } from '@/hooks/useStockNotifications'

interface LowStockAlertProps {
  productId: string
  productName: string
  currentStock: number
  threshold: number
  maxStock: number
  onRestockAction?: () => void
}

export const LowStockAlert = ({
  productId,
  productName,
  currentStock,
  threshold,
  maxStock,
  onRestockAction,
}: LowStockAlertProps) => {
  const { setStockThreshold, enableWebSocket } = useStockNotifications()
  
  // Calculate stock percentage
  const stockPercentage = Math.round((currentStock / maxStock) * 100)
  
  // Determine alert level based on stock percentage
  let alertLevel = 'normal'
  if (stockPercentage <= 15) {
    alertLevel = 'critical'
  } else if (stockPercentage <= 30) {
    alertLevel = 'warning'
  }
  
  const handleSubscribe = () => {
    // Set threshold and enable monitoring
    setStockThreshold(threshold)
    enableWebSocket()
    
    // Provide visual feedback (replaced toast with console log)
    console.log(`Monitoring set for ${productName}`);
  }
  
  return (
    <div className="border rounded-md p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">{productName}</h3>
        {currentStock <= threshold && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            alertLevel === 'critical' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            Low Stock
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>{currentStock} units left</span>
          <span>{stockPercentage}%</span>
        </div>
        
        <Progress 
          value={stockPercentage} 
          className={`h-2 ${
            alertLevel === 'critical' 
              ? 'bg-red-100 [&>div]:bg-red-600' 
              : alertLevel === 'warning' 
                ? 'bg-amber-100 [&>div]:bg-amber-600' 
                : 'bg-blue-100 [&>div]:bg-blue-600'
          }`}
        />
      </div>
      
      <div className="mt-3 flex space-x-2">
        {onRestockAction && (
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={onRestockAction}
          >
            Restock
          </Button>
        )}
        <Button 
          size="sm" 
          variant="secondary" 
          className="text-xs"
          onClick={handleSubscribe}
        >
          Monitor Stock
        </Button>
      </div>
    </div>
  )
}

export const LowStockAlertDashboard = () => {
  const lowStockItems = [
    { id: '1', name: 'Nike Air Force 1', stock: 5, threshold: 10, maxStock: 100 },
    { id: '2', name: 'Adidas Ultraboost', stock: 8, threshold: 15, maxStock: 150 },
    { id: '3', name: 'Travel Duffel Bag', stock: 3, threshold: 20, maxStock: 200 },
    { id: '4', name: 'Foot Measuring Device', stock: 12, threshold: 25, maxStock: 120 },
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Low Stock Alerts</h2>
        <Button size="sm" variant="outline">Settings</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {lowStockItems.map(item => (
          <LowStockAlert 
            key={item.id}
            productId={item.id}
            productName={item.name}
            currentStock={item.stock}
            threshold={item.threshold}
            maxStock={item.maxStock}
            onRestockAction={() => console.log(`Restock ${item.name}`)}
          />
        ))}
      </div>
      
      <Button className="w-full" variant="outline">
        View All Inventory
      </Button>
    </div>
  )
} 