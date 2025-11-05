'use client'

import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { useState, useMemo } from 'react'

interface ProvidersProps {
  children: ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  )

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  )
}

export default Providers