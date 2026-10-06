'use client'

import React from 'react'
import { logoutAction } from '@/lib/services/auth'
import type { User } from '@/lib/types'

export interface HeaderProps {
  user: User
  onOpenSidebar?: () => void
}

export function Header({ user, onOpenSidebar }: HeaderProps) {
  return (
    <header className="h-16 border-b border-espresso/10 bg-ivory/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg text-espresso/70 hover:bg-espresso/5 cursor-pointer"
            aria-label="Open navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cream border border-espresso/20 flex items-center justify-center font-serif text-espresso text-xs font-semibold">
            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-espresso leading-tight">{user.name || 'Admin'}</p>
            <p className="text-[11px] text-espresso/60 leading-tight">{user.email}</p>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-espresso/15 hidden sm:block" />

        {/* Logout Button */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-espresso/70 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Log out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  )
}
