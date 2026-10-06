'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

/**
 * Lightweight, zero-dependency navigation progress bar.
 * Provides instant (<30ms) visual feedback when clicking any link,
 * eliminating the sensation of unresponsive buttons during server transitions.
 */
export function NavigationProgressBar() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const activeUrlRef = useRef<string>(pathname)

  // Complete progress bar when pathname changes
  useEffect(() => {
    if (activeUrlRef.current !== pathname) {
      activeUrlRef.current = pathname
      setProgress(100)
      const hideTimer = setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 250)
      return () => clearTimeout(hideTimer)
    }
  }, [pathname])

  // Global click listener to intercept internal link clicks immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      const targetAttr = anchor.getAttribute('target')
      const download = anchor.getAttribute('download')

      // Ignore external, download, or new-tab links
      if (
        !href ||
        targetAttr === '_blank' ||
        download !== null ||
        href.startsWith('http:') ||
        href.startsWith('https:') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('#')
      ) {
        return
      }

      // Ignore if clicking the exact current page or anchor
      const currentPath = window.location.pathname
      if (href === currentPath || href === window.location.pathname + window.location.search) {
        return
      }

      // Instant start
      setLoading(true)
      setProgress(15)

      if (timerRef.current) clearInterval(timerRef.current)

      // Trickle progress to indicate active background loading
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 85
          }
          return prev + Math.floor(Math.random() * 12) + 6
        })
      }, 200)
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!loading && progress === 0) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gold transition-all duration-200 ease-out shadow-[0_0_12px_rgba(197,155,88,0.9)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  )
}
