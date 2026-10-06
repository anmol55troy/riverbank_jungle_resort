'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { SerializedEditorState } from '@/lib/types'

import { RichText } from './RichText'
import { ChevronDown } from './icons'

export type FAQItem = {
  id: string | number
  question: string
  answer: SerializedEditorState
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | number | null>(items[0]?.id ?? null)
  const reduced = useReducedMotion()

  return (
    <div className="divide-y divide-espresso/10 rounded-lg bg-white shadow-card">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-serif text-lg text-espresso transition-colors hover:text-gold-dark md:px-7"
              >
                {item.question}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  initial={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? { height: 0, opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 text-sm md:px-7">
                    <RichText data={item.answer} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
