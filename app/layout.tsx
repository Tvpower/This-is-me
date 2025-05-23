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
      <body>{children}</body>
    </html>
  )
}
