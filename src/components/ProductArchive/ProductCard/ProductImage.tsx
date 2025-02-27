'use client'

import Image from 'next/image'
import ImageHover from '../image-hover'

const ProductImage = ({ images }: { images: string[] }) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5 w-full">
      {images.length > 1 ? (
        <div className="relative w-full h-96 lg:h-auto">
          <ImageHover
            src={images[0] ?? ''}
            hoverSrc={images[1] ?? images[0] ?? ''}
            alt="Product Image"
          />
        </div>
      ) : (
        <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit items-center lg:justify-start justify-center">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-full lg:w-72 h-96 lg:h-96 rounded-md overflow-hidden"
            >
              <Image
                src={image}
                fill
                className="object-cover hover:scale-110 transition-all duration-500"
                alt="Product Image"
                priority
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImage
