'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'

import { subscribeNewsletter, type FormState } from '@/lib/actions'

const initialState: FormState = { status: 'idle' }

export function NewsletterForm() {
  const t = useTranslations('footer')
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState)

  if (state.status === 'success') {
    return <p className="text-sm text-gold">{t('subscribed')}</p>
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        {t('newsletterPlaceholder')}
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder={t('newsletterPlaceholder')}
        className="min-h-11 w-full rounded-sm border border-ivory/25 bg-transparent px-3 text-sm text-ivory placeholder:text-ivory/50 focus:border-gold"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 shrink-0 rounded-sm bg-gold px-5 text-xs font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:bg-gold-dark disabled:opacity-60"
      >
        {t('subscribe')}
      </button>
      {state.status === 'error' && <p className="text-xs text-clay">{state.message}</p>}
    </form>
  )
}
