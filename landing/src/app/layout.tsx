import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: {
    default: 'ShopChat.vn - AI-Powered Sales Assistant for Vietnamese Businesses',
    template: '%s | ShopChat.vn'
  },
  description: 'Transform your customer service with AI. ShopChat.vn helps Vietnamese businesses automate customer support, increase conversion rates, and provide 24/7 shopping experiences.',
  keywords: [
    'AI chatbot', 'customer service', 'e-commerce', 'Vietnam', 
    'sales assistant', 'automation', 'conversion optimization'
  ],
  authors: [{ name: 'ShopChat.vn Team' }],
  creator: 'ShopChat.vn',
  publisher: 'ShopChat.vn',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://shopchat.vn',
    siteName: 'ShopChat.vn',
    title: 'ShopChat.vn - AI-Powered Sales Assistant',
    description: 'Transform your customer service with AI. Increase conversion rates and provide 24/7 shopping experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopChat.vn - AI-Powered Sales Assistant',
    description: 'Transform your customer service with AI. Increase conversion rates and provide 24/7 shopping experiences.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
