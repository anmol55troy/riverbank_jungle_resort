import React from 'react'
import type { SerializedEditorState } from '@/lib/types'
import { LexicalRenderer } from '@/lib/richtext/render'

type Props = {
  data: SerializedEditorState | null | undefined
  className?: string
}

export function RichText({ data, className = '' }: Props) {
  if (!data) return null
  return <LexicalRenderer data={data} className={className} />
}

