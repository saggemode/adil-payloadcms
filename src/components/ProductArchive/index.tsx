import React from 'react'
import { Card } from './ProductCard' // Assuming Card is a component
import { Product } from '@/payload-types' // Import the Product type

export type Props = {
  products: Product[] // Use the correct type here
}

export const ProductArchive: React.FC<Props> = (props) => {
  const { products } = props

  return (
    <>
      {products?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return <Card key={index} doc={result} relationTo="products" showCategories />
        }
        return null
      })}
    </>
  )
}
