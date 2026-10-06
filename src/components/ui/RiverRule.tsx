type Props = {
  className?: string
  /** 'gold' on light sections, 'light' on espresso sections */
  tone?: 'gold' | 'light'
  width?: number
}

/**
 * The signature motif: a meandering river line. Where scroll-driven CSS
 * animation is supported it draws itself in as it enters view; everywhere
 * else it is simply drawn. Previously this pulled framer-motion into every
 * page that rendered a SectionHeading.
 */
export function RiverRule({ className = '', tone = 'gold', width = 168 }: Props) {
  /* Light sections need the deeper sage to read at all; espresso sections
     need the pale one. Previously both branches returned the same value. */
  const stroke = tone === 'gold' ? 'var(--color-gold-dark)' : 'var(--color-gold)'

  return (
    <svg
      viewBox="0 0 168 12"
      width={width}
      height={12}
      fill="none"
      aria-hidden="true"
      className={`river-rule ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0 8C18 8 22 3 40 3s22 6 40 6 22-6 40-6 26 5 48 5"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}
