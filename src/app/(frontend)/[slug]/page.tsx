import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Gutter } from '@payloadcms/ui'
import Categories from '@/components/Categories'
import { getAllCategories } from '@/actions/productAction'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  const categories = await getAllCategories()

  return (
    <article className="pt-16 pb-24">
      {slug === 'home' ? (
        <section>
          <PageClient />

          <PayloadRedirects disableNotFound url={url} />

          {draft && <LivePreviewListener />}
          <RenderHero {...hero} />
          <Gutter className="flex flex-col gap-[100px] mt-[100px] md:gap-[60px]">
            <Categories categories={categories} />
            <h5>categories</h5>
          </Gutter>
        </section>
      ) : (
        <>
          <PageClient />

          <PayloadRedirects disableNotFound url={url} />

          {draft && <LivePreviewListener />}

          <RenderHero {...hero} />
          <RenderBlocks blocks={layout} />
        </>
      )}
    </article>
  )

  // return (
  //   <article className="pt-16 pb-24">
  //     {slug === 'home' ? (
  //       <section>
  //         <PageClient />

  //         <PayloadRedirects disableNotFound url={url} />

  //         {draft && <LivePreviewListener />}
  //         <RenderHero {...hero} />
  //         <Gutter className="flex flex-col gap-[100px] mt-[100px] md:gap-[60px]">
  //           <Categories categories={categories} />
  //           {/* <h5>categories</h5> */}
  //         </Gutter>
  //       </section>
  //     ) : (
  //       <>
  //         <PageClient />

  //         <PayloadRedirects disableNotFound url={url} />

  //         {draft && <LivePreviewListener />}

  //         <RenderHero {...hero} />
  //         <RenderBlocks blocks={layout} />
  //       </>
  //     )}
  //   </article>
  // )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
