import React from 'react'
import { Card } from './ProductCard'
import { Product } from '@/payload-types'

export type Props = {
  products: Product[]
}

export const ProductArchive: React.FC<Props> = (props) => {
  const { products } = props

  return (
    <>
      {products?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return <Card key={index} product={result} />
        }
        return null
      })}
    </>
  )
}
