'use client'

import Image from 'next/image'
import ImageHover from '../image-hover'

const ProductImage = ({ images }: { images: string[] }) => {
  // If there's no image, return a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {images.length > 1 ? (
        <ImageHover
          src={images[0] ?? ''}
          hoverSrc={images[1] ?? images[0] ?? ''}
          alt="Product Image"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <Image
          src={images[0] ?? ''}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          alt="Product Image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority
        />
      )}
    </div>
  )
}

export default ProductImage
