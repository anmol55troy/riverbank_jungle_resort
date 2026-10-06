import type { ReactNode } from 'react'

import { RiverRule } from './RiverRule'

type Props = {
  label?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'center' | 'left'
  dark?: boolean
  as?: 'h1' | 'h2'
  /** Right-hand column content — creates the asymmetric editorial split */
  aside?: ReactNode
  className?: string
}

/**
 * Editorial section heading. Default is a left-hung two-column split:
 * kicker + display title on the left, supporting prose on the right.
 */
export function SectionHeading({
  label,
  title,
  intro,
  align = 'left',
  dark = false,
  as = 'h2',
  aside,
  className,
}: Props) {
  const Tag = as

  if (align === 'center') {
    return (
      <div className={`mb-12 text-center md:mb-20 ${className || ''}`}>
        {label && <p className={dark ? 'kicker-light mb-4' : 'kicker mb-4'}>{label}</p>}
        <Tag
          className={`display text-balance text-[clamp(2rem,4.2vw,3.4rem)] ${dark ? '!text-ivory' : ''}`}
        >
          {title}
        </Tag>
        <RiverRule className="mx-auto mt-6" tone={dark ? 'light' : 'gold'} />
        {intro && (
          <p
            className={`mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-[1.75] ${
              dark ? 'text-ivory/75' : 'text-espresso/75'
            }`}
          >
            {intro}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`mb-12 md:mb-20 ${className || ''}`}>
      <div className="grid gap-x-10 gap-y-5 md:grid-cols-12">
        <div className={intro || aside ? 'md:col-span-7' : 'max-w-3xl md:col-span-12'}>
          {label && <p className={dark ? 'kicker-light mb-4' : 'kicker mb-4'}>{label}</p>}
          <Tag
            className={`display text-balance text-[clamp(2rem,4.2vw,3.4rem)] ${dark ? '!text-ivory' : ''}`}
          >
            {title}
          </Tag>
        </div>
        {(intro || aside) && (
          /* Bottom-aligned so the prose sits on the title's last baseline
             rather than drifting below the section rule. */
          <div className="md:col-span-5 md:self-end">
            {intro && (
              <p
                className={`max-w-md text-pretty text-[15px] leading-[1.75] ${
                  dark ? 'text-ivory/75' : 'text-espresso/75'
                }`}
              >
                {intro}
              </p>
            )}
            {aside}
          </div>
        )}
      </div>
      <RiverRule className="mt-8" tone={dark ? 'light' : 'gold'} />
    </div>
  )
}
