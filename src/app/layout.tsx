import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanceiroKai',
  description: 'Controle financeiro pessoal e empresarial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-6 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
