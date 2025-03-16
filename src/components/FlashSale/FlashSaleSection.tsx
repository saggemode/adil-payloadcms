import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ClientFlashSaleSection } from './ClientFlashSaleSection'

export default async function FlashSaleSection() {
  const payload = await getPayload({ config: configPromise })
  const { docs: activeSales } = await payload.find({
    collection: 'flash-sales',
    where: {
      and: [
        {
          startDate: {
            less_than: new Date().toISOString(),
          },
        },
        {
          endDate: {
            greater_than: new Date().toISOString(),
          },
        },
      ],
    },
    depth: 2,
  })

  if (!activeSales.length) return null

  return <ClientFlashSaleSection activeSales={activeSales} />
}
