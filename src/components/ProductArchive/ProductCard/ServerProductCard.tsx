import { getFlashSaleForProduct } from '@/actions/flashSaleAction'
import { ClientProductCard } from './ClientProductCard'
import { Product } from '@/payload-types'

interface ServerProductCardProps {
  product: Product
}

export async function ServerProductCard({ product }: ServerProductCardProps) {
  const flashSale = await getFlashSaleForProduct(product.id?.toString() ?? '')
  const isFlashSale = Boolean(flashSale.success && flashSale.data)
  const discountAmount = flashSale.success ? flashSale.data?.discountAmount || 0 : 0

  return (
    <ClientProductCard
      product={product}
      isFlashSale={isFlashSale}
      discountPercent={discountAmount}
    />
  )
}
