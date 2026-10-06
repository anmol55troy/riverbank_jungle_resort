import type { Metadata } from 'next'
import { Marcellus, Plus_Jakarta_Sans } from 'next/font/google'
import '../globals.css'

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Admin Console | River Bank Jungle Resort',
  description: 'Administration control panel for River Bank Jungle Resort',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${marcellus.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-gray-50 text-gray-900 font-sans antialiased h-[100dvh] overflow-hidden overscroll-none w-full">
        {children}
      </body>
    </html>
  )
}
