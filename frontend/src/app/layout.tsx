'use client'
import { NextUIProvider } from '@nextui-org/react'
import './global.css'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  )
}
