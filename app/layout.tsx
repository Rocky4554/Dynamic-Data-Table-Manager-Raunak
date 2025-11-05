import type { Metadata } from 'next'
import './globals.css'
import Providers from '../components/Provider'

export const metadata: Metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'Manage, edit, import and export your data with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}