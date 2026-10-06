'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { ToastProvider } from '../ui/Toast'
import type { User } from '@/lib/types'

export interface AdminShellProps {
  user: User
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex h-[100dvh] overflow-hidden bg-ivory text-espresso font-sans">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="relative z-10 w-64 h-full shadow-2xl">
              <Sidebar onClose={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden h-14 border-b border-espresso/10 bg-ivory/80 backdrop-blur-md px-4 flex items-center shrink-0 z-10 sticky top-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 -ml-2 rounded-lg text-espresso/70 hover:bg-espresso/5 cursor-pointer"
              aria-label="Open navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-serif text-sm font-semibold text-espresso ml-2">Admin Console</span>
          </div>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
