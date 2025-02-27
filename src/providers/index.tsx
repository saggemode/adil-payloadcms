import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './Auth'
import { FilterProvider } from './Filter'
import ClientProviders from './ClientProvider/client-providers'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FilterProvider>
          <HeaderThemeProvider>
            {/* {children} */}
            <ClientProviders>{children}</ClientProviders>
          </HeaderThemeProvider>
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
