import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { FlashSaleTimer } from '@/components/FlashSale/FlashSaleTimer'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatPrice } from '@/utilities/formatPrice'
import { ProductCard } from '@/components/ProductArchive/ProductCard'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function FlashSalePage({ params: paramsPromise }: PageProps) {
  const payload = await getPayload({ config: configPromise })
  const { id } = await paramsPromise

  const sale = await payload.findByID({
    collection: 'flash-sales',
    id,
    depth: 2,
  })

  if (!sale) {
    notFound()
  }

  const progress = ((sale.soldQuantity || 0) / sale.totalQuantity) * 100

  return (
    <main className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{sale.name}</h1>
          <Badge variant="destructive" className="text-lg">
            {sale.discountPercent}% OFF
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <FlashSaleTimer startDate={sale.startDate} endDate={sale.endDate} />
          <div className="text-sm text-muted-foreground">
            {sale.soldQuantity || 0} of {sale.totalQuantity} items sold
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Description */}
      {sale.description && (
        <div className="prose dark:prose-invert max-w-none">
          <p>{sale.description}</p>
        </div>
      )}

      {/* Sale Info */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-full">
          <h2 className="text-2xl font-bold mb-4">Sale Items</h2>
        </div>
        {Array.isArray(sale.products) &&
          sale.products.map((product: any) => <ProductCard key={product.id} product={product} />)}
      </div>

      {/* Terms and Conditions */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Flash sale prices are valid only during the sale period</li>
          <li>Limited to available stock only</li>
          {(sale.minimumPurchase ?? 0) > 0 && (
            <li>Minimum purchase amount: ₦{formatPrice(sale.minimumPurchase ?? 0)}</li>
          )}
          {(sale.itemLimit ?? 0) > 0 && <li>Maximum {sale.itemLimit} items per customer</li>}
          <li>Cannot be combined with other offers or promotions</li>
        </ul>
      </div>
    </main>
  )
}
