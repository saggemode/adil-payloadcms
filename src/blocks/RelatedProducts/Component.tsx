import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'


import { Card } from '@/components/ProductArchive/ProductCard'
import { Product } from '@/payload-types'

export type RelatedProductsProps = {
  className?: string
  docs?: Product[]
  introContent?: SerializedEditorState
}

export const RelatedProducts: React.FC<RelatedProductsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((result, index) => {
          // console.log('Related Product:', doc)
          if (typeof result === 'object' && result !== null) {
            return <Card key={index} doc={result} relationTo="products" showCategories />
          }
          return null
        })}
      </div>
    </div>
  )
}
