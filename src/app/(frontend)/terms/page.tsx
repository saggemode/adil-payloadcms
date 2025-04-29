import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for using our e-commerce platform',
}

async function getTerms() {
  const payload = await getPayload({ config: configPromise })
  
  const terms = await payload.find({
    collection: 'terms',
    limit: 1,
    sort: '-lastUpdated',
  })

  return terms.docs[0]
}

export default async function TermsPage() {
  const terms = await getTerms()

  if (!terms) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{terms.title}</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <RenderBlocks blocks={terms.layout} />
          </div>
          <div className="mt-8 text-sm text-gray-500">
            Last updated: {new Date(terms.lastUpdated).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 