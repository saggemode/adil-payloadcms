'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/ui'
import ProductSlider from '@/components/ProductArchive/product-slider'

export default function BrowsingHistoryList({ className }: { className?: string }) {
  const { products } = useBrowsingHistory()
  return (
    products.length !== 0 && (
      <div className="bg-background">
        <Separator className={cn('mb-4', className)} />
        <ProductList title={"Related to items that you've viewed"} type="related" />
        <Separator className="mb-4" />
        <ProductList title={'Your browsing history'} hideDetails type="history" />
      </div>
    )
  )
}

function ProductList({
  title,
  type = 'history',
  hideDetails = false,
}: {
  title: string
  type: 'history' | 'related'
  hideDetails?: boolean
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = React.useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/products/browsing-history?type=${type}&categories=${products
            .map((product) => product.category)
            .join(',')}&ids=${products.map((product) => product.id).join(',')}`,
        )

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const text = await res.text() // Read response as text first
        if (!text) {
          console.warn('Empty response received from API')
          setData([]) // Set empty data to avoid undefined errors
          return
        }

        const data = JSON.parse(text) // Parse the text as JSON
        setData(data)
      } catch (error) {
        console.error('Error fetching browsing history:', error)
      }
    }

    fetchProducts()
  }, [products, type])

  console.log(data)

  return (
    data.length > 0 && <ProductSlider title={title} products={data} hideDetails={hideDetails} />
  )
}


// function ProductList({
//   title,
//   type = 'history',
//   hideDetails = false,
// }: {
//   title: string
//   type: 'history' | 'related'
//   hideDetails?: boolean
// }) {
//   const { products } = useBrowsingHistory()
//   const [data, setData] = React.useState([])
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const res = await fetch(
//         `/api/products/browsing-history?type=${type}&categories=${products
//           .map((product) => product.category)
//           .join(',')}&ids=${products.map((product) => product.id).join(',')}`,
//       )
//       const data = await res.json()
//       setData(data)
//     }
//     fetchProducts()
//   }, [products, type])

//   console.log(data)
//   return (
//     data.length > 0 && <ProductSlider title={title} products={data} hideDetails={hideDetails} />
//   )
// }
