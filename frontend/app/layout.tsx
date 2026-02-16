import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Mario's Portfolio",
  description: "Welcome to Mario's Portfolio - A showcase of my work and experience",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/red-eye.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
