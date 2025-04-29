import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './Auth'
import { FilterProvider } from './Filter'
import ClientProviders from './ClientProvider/client-providers'
import QueryProvider from './QueryProvider/QueryProvider'
import { CompareProvider } from '@/contexts/CompareContext'
import { WishlistProvider } from '@/contexts/WishlistContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <FilterProvider>
            <HeaderThemeProvider>
              <ClientProviders>
                <CompareProvider>
                  <WishlistProvider>
                    {children}
                  </WishlistProvider>
                </CompareProvider>
              </ClientProviders>
            </HeaderThemeProvider>
          </FilterProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
