import React from 'react'
import { FlashSale } from '@/payload-types'
import { getActiveFlashSales } from '@/actions/flashSaleAction'
import Link from 'next/link'
import { formatDistanceToNow, isBefore } from 'date-fns'
import { CountdownTimer } from './CountdownTimer'

export async function FlashSaleSection() {
  const { data: flashSales, success, error } = await getActiveFlashSales()

  if (!success) {
    console.error('Error fetching flash sales:', error)
    return null
  }

  if (!flashSales?.length) {
    console.log('No flash sales found')
    return null
  }

  return (
    <div className="bg-red-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          {flashSales.map((sale) => {
            const isActive = sale.status === 'active'
            const startDate = new Date(sale.startDate)
            const now = new Date()
            const hasStarted = isBefore(startDate, now)

            return (
              <div
                key={sale.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-red-600">{sale.name}</h3>
                    {!hasStarted && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {sale.discountType === 'percentage'
                      ? `${sale.discountAmount}% OFF`
                      : `$${sale.discountAmount} OFF`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {hasStarted ? (
                      <>
                        Ends in <CountdownTimer endDate={sale.endDate} />
                      </>
                    ) : (
                      <>Starts in {formatDistanceToNow(startDate, { addSuffix: true })}</>
                    )}
                  </p>
                </div>
                <Link
                  href="/products"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    hasStarted
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {hasStarted ? 'Shop Now' : 'View Details'}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
