import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = { title: 'GigOS', description: 'God-tier gig worker OS' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen`}>
        <nav className="border-b border-zinc-800 px-6 py-3 flex items-center gap-6">
          <span className="text-cyan-400 font-bold text-lg tracking-widest">GigOS</span>
          <a href="/" className="text-sm text-zinc-400 hover:text-zinc-50">Dashboard</a>
          <a href="/domains" className="text-sm text-zinc-400 hover:text-zinc-50">Domains</a>
          <a href="/field-local" className="text-sm text-zinc-400 hover:text-zinc-50">Field & Local</a>
          <a href="/tasks" className="text-sm text-zinc-400 hover:text-zinc-50">Tasks</a>
        </nav>
        <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
      </body>
    </html>
  )
}
