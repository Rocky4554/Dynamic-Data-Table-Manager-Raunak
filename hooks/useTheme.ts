import { useState, useMemo } from 'react'
import { createTheme } from '@mui/material'

export const useTheme = () => {
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

  const toggleTheme = () => setDarkMode(!darkMode)

  return { theme, darkMode, toggleTheme }
}