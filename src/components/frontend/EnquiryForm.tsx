'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'

import { submitEnquiry, type FormState } from '@/lib/actions'

const initialState: FormState = { status: 'idle' }

const inputClass =
  'min-h-11 w-full rounded-sm border border-espresso/20 bg-white px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:border-gold'

type Props = {
  formType: 'contact' | 'events'
}

export function EnquiryForm({ formType }: Props) {
  const t = useTranslations('forms')
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState)

  if (state.status === 'success') {
    return (
      <div className="rounded-lg border border-gold/50 bg-cream p-8 text-center">
        <p className="font-serif text-xl text-espresso">{t('success')}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="formType" value={formType} />
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label htmlFor={`${formType}-name`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
          {t('name')} *
        </label>
        <input id={`${formType}-name`} name="name" required autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor={`${formType}-email`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
          {t('email')} *
        </label>
        <input id={`${formType}-email`} type="email" name="email" required autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor={`${formType}-phone`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
          {t('phone')}
        </label>
        <input id={`${formType}-phone`} type="tel" name="phone" autoComplete="tel" className={inputClass} />
      </div>

      {formType === 'events' ? (
        <>
          <div>
            <label htmlFor="events-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
              {t('eventDate')}
            </label>
            <input id="events-date" type="date" name="eventDate" className={inputClass} />
          </div>
          <div>
            <label htmlFor="events-guests" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
              {t('guests')}
            </label>
            <input id="events-guests" type="number" name="guests" min={1} className={inputClass} />
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
            {t('subject')}
          </label>
          <input id="contact-subject" name="subject" className={inputClass} />
        </div>
      )}

      <div className="sm:col-span-2">
        <label htmlFor={`${formType}-message`} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-espresso/70">
          {t('message')} *
        </label>
        <textarea id={`${formType}-message`} name="message" required rows={5} className={inputClass} />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-gold px-8 text-xs font-semibold uppercase tracking-[0.14em] text-espresso transition-colors duration-300 hover:bg-gold-dark disabled:opacity-60 sm:w-auto"
        >
          {pending ? t('sending') : t('send')}
        </button>
        {state.status === 'error' && (
          <p className="mt-3 text-sm text-clay" role="alert">
            {state.message ?? t('error')}
          </p>
        )}
      </div>
    </form>
  )
}
