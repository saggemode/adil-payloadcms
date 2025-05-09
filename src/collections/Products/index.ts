import { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateProduct } from './hooks/revalidateProducts'

import { generateBarcode } from './hooks/generateBarcode'
// We'll use a simpler approach without a custom hook for now
// import { validateBarcode } from './hooks/validateBarcode'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { admins } from '@/access/admins'

// Import custom component

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },

  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'price', 'stock', 'brands', 'isPublished', 'barcode'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'products',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'barcode',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        description: 'Product barcode (ISBN, UPC, EAN, etc.)',
        position: 'sidebar',
      },
      validate: (value: any) => {
        if (!value) return true;
        
        // Basic format checking
        const hasOnlyValidChars = /^[0-9-]+$/.test(String(value));
        if (!hasOnlyValidChars) {
          return 'Barcode should contain only numbers and hyphens';
        }
        
        return true;
      },
      index: true, // Make it searchable in the database
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price',
      validate: (value: any) => value >= 0 || 'Price must be a positive number',
    },
    {
      name: 'listPrice',
      type: 'number',
      required: true,
      label: 'Listing Price',
      validate: (value: any) => value >= 0 || 'listing Price must be a positive number',
    },
    {
      name: 'flashSaleId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'flashSaleEndDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'flashSaleDiscount',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Published',
      defaultValue: false,
    },
    {
      name: 'countInStock',
      type: 'number',
      required: true,
      label: 'Stock Quantity',
      validate: (value: any) => value >= 0 || 'Stock quantity must be a positive number',
    },
    {
      name: 'numSales',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'avgRating',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'numReviews',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'ratingDistribution',
      type: 'array',
      fields: [
        {
          name: 'rating',
          type: 'number',
          required: true,
        },
        {
          name: 'count',
          type: 'number',
          required: true,
        },
      ],
    },

    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'images',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
            {
              name: 'tags',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              //hasMany: true,
              relationTo: 'tags',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
             
              //hasMany: true,
              relationTo: 'categories',
            },
            {
              name: 'brands',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              //hasMany: true,
              relationTo: 'brands',
            },
            {
              name: 'colors',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'colors',
            },

            {
              name: 'sizes',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'sizes',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      timezone: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },

    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      //monitorStock
      generateBarcode
    ],
    afterChange: [
      revalidateProduct
    ],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
