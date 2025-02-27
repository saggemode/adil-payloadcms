
import React from 'react'
import { Card, ProductCard } from './ProductCard'

export type Props = {
  products: ProductCard[]
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
