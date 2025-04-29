import { CollectionConfig } from 'payload'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { FormBlock } from '@/blocks/Form/config'
import { Archive } from '@/blocks/ArchiveBlock/config'

const Terms: CollectionConfig = {
  slug: 'terms',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Content, MediaBlock, CallToAction, FormBlock, Archive],
      required: true,
    },
    {
      name: 'lastUpdated',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Terms 