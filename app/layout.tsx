import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Delivery Disposition Dashboard',
  description: 'ACC broadLogRcp-style delivery disposition matrix',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
