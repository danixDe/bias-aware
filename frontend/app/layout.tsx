import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'FairHire — Bias-Aware Resume Screening',
  description: 'AI-powered resume screening that detects bias and gives every candidate honest, transparent feedback.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
