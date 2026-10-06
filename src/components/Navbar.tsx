'use client'


import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState, Fragment } from 'react'

import { Link, usePathname } from '@/i18n/navigation'
import { NAV_LINKS, PRIMARY_NAV_LINKS } from '@/lib/constants'

import { CloseIcon, ExternalIcon, MenuIcon } from './ui/icons'

type Props = {
  bookingUrl: string
  virtualTourUrl: string
  logoUrl?: string
}

export function Navbar({
  bookingUrl,
  virtualTourUrl,
  logoUrl = '/logo.png',
}: Props) {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the overlay on navigation and lock body scroll while open
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] isolate transition-all duration-500 ${
          solid
            ? 'bg-espresso/95 backdrop-blur-md border-b border-gold/20 shadow-lg'
            : 'border-b border-transparent bg-gradient-to-b from-espresso/80 via-espresso/35 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center" aria-label="River Bank Jungle Resort — Home">
            <Image
              src={logoUrl}
              alt="River Bank Jungle Resort"
              width={116}
              height={60}
              priority
              className="h-11 w-auto drop-shadow-[0_1px_6px_rgba(42,33,26,0.5)] md:h-13"
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main navigation">
            {PRIMARY_NAV_LINKS.map((link) => (
              <Fragment key={link.key}>
                {link.key === 'contact' && (
                  <a
                    href={virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-underline pb-1 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors hover:text-gold"
                  >
                    360 Tours
                  </a>
                )}
                <Link
                  href={link.href}
                  prefetch={true}
                  data-active={pathname === link.href}
                  className={`nav-underline pb-1 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:text-gold ${
                    pathname === link.href ? 'text-gold' : 'text-ivory'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-10 items-center gap-2 border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 sm:px-5 sm:text-[10.5px] sm:tracking-[0.22em] ${
                solid
                  ? 'border-gold bg-gold text-espresso hover:bg-gold-dark hover:text-ivory'
                  : 'border-gold/90 bg-gold/90 text-espresso backdrop-blur-sm hover:bg-gold hover:text-espresso'
              }`}
            >
              {t('bookNow')}
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? t('closeMenu') : t('menu')}
              className="inline-flex h-11 w-11 items-center justify-center text-ivory transition-colors hover:text-gold focus:outline-none"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu fixed inset-0 top-20 z-[90] flex flex-col overflow-y-auto bg-espresso md:top-24 ${
          open ? 'pointer-events-auto opacity-100 visible' : 'pointer-events-none opacity-0 invisible'
        }`}
        data-open={open}
        aria-hidden={!open}
        style={{ opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden' }}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-10"
        >
          {[{ href: '/', key: 'home' as const }, ...NAV_LINKS].map((link) => {
            const isPrimary = PRIMARY_NAV_LINKS.some((p) => p.href === link.href)
            return (
              <div key={link.key} className={`mobile-menu-item ${isPrimary ? 'lg:hidden' : ''}`}>
                <Link
                  href={link.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className={`block px-8 py-2.5 text-center font-serif text-[1.7rem] transition-colors hover:text-gold active:text-gold-dark ${
                    pathname === link.href ? 'text-gold' : 'text-ivory'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </div>
            )
          })}
          <div className="mobile-menu-item mt-6 flex flex-col items-center gap-4 lg:hidden">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-gold-dark"
            >
              {t('bookNow')}
            </a>
            <a
              href={virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold hover:text-ivory"
            >
              {t('virtualTour')} <ExternalIcon />
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
