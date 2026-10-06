'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { loginAction } from '@/lib/services/auth'
import { Button } from '@/app/admin/_components/ui/Button'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: '' })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-ivory">
      <div className="w-full max-w-md bg-white rounded-3xl border border-espresso/15 shadow-card p-8 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Subtle decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-espresso via-gold to-espresso" />

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-espresso items-center justify-center text-gold font-serif font-bold text-2xl shadow-sm mb-2">
            R
          </div>
          <h1 className="font-serif text-2xl font-light text-espresso tracking-tight">
            River Bank Jungle Resort
          </h1>
          <p className="text-xs uppercase tracking-widest text-espresso/60 font-sans">
            Admin Console Login
          </p>
        </div>

        {/* Error notification */}
        {state.error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
            <svg className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="admin@riverbankjungleresort.com.np"
              className="w-full rounded-xl border border-espresso/20 bg-ivory/50 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-espresso focus:bg-white focus:ring-2 focus:ring-espresso/15 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-espresso/20 bg-ivory/50 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-espresso focus:bg-white focus:ring-2 focus:ring-espresso/15 transition-all"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 text-sm rounded-xl font-medium tracking-wide shadow-md"
              isLoading={isPending}
            >
              Sign In to Console
            </Button>
          </div>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-espresso/50 hover:text-espresso transition-colors"
          >
            ← Back to Resort Website
          </Link>
        </div>
      </div>
    </div>
  )
}
