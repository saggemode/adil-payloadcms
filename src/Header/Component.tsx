import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getAllCategories } from '@/actions/productAction'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const categories = await getAllCategories()
  
  return <HeaderClient data={headerData} categories={categories} />
}
