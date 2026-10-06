type Props = {
  data: Record<string, unknown> | null
}

export function JsonLd({ data }: Props) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
