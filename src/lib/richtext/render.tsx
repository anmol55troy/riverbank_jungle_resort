import React from 'react'
import type { SerializedEditorState, SerializedLexicalNode } from '../types'

// Lexical Text Node format bitmask constants
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6

interface LexicalNodeBase extends SerializedLexicalNode {
  text?: string
  format?: number
  children?: LexicalNodeBase[]
  tag?: string
  listType?: string
  url?: string
  newTab?: boolean
  fields?: {
    url?: string
    newTab?: boolean
  }
}

function renderTextNode(node: LexicalNodeBase, key: number | string): React.ReactNode {
  let content: React.ReactNode = node.text || ''

  if (node.format) {
    const f = Number(node.format)
    if (f & IS_BOLD) content = <strong>{content}</strong>
    if (f & IS_ITALIC) content = <em>{content}</em>
    if (f & IS_UNDERLINE) content = <u>{content}</u>
    if (f & IS_STRIKETHROUGH) content = <del>{content}</del>
    if (f & IS_CODE) content = <code>{content}</code>
    if (f & IS_SUBSCRIPT) content = <sub>{content}</sub>
    if (f & IS_SUPERSCRIPT) content = <sup>{content}</sup>
  }

  return <React.Fragment key={key}>{content}</React.Fragment>
}

function renderChildren(children?: LexicalNodeBase[]): React.ReactNode {
  if (!children || !Array.isArray(children)) return null
  return children.map((child, idx) => renderNode(child, idx))
}

function renderNode(node: LexicalNodeBase, index: number | string): React.ReactNode {
  if (!node || typeof node !== 'object') return null

  switch (node.type) {
    case 'text':
      return renderTextNode(node, index)

    case 'paragraph': {
      // Empty paragraph check: if no children or empty text, render br or empty p
      const children = renderChildren(node.children)
      return <p key={index}>{children}</p>
    }

    case 'heading': {
      const Tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h2'
      return <Tag key={index}>{renderChildren(node.children)}</Tag>
    }

    case 'list': {
      const isOrdered = node.listType === 'number' || node.tag === 'ol'
      const Tag = isOrdered ? 'ol' : 'ul'
      return <Tag key={index}>{renderChildren(node.children)}</Tag>
    }

    case 'listitem': {
      return <li key={index}>{renderChildren(node.children)}</li>
    }

    case 'quote':
    case 'blockquote': {
      return <blockquote key={index}>{renderChildren(node.children)}</blockquote>
    }

    case 'link': {
      const url = node.fields?.url || node.url || '#'
      const newTab = node.fields?.newTab || node.newTab
      return (
        <a
          key={index}
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
        >
          {renderChildren(node.children)}
        </a>
      )
    }

    case 'horizontalrule':
      return <hr key={index} className="my-6 border-espresso/20" />

    default:
      // Fallback: render any children
      if (node.children) {
        return <React.Fragment key={index}>{renderChildren(node.children)}</React.Fragment>
      }
      return null
  }
}

export function LexicalRenderer({
  data,
  className = '',
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data?.root?.children) return null

  return (
    <div className={`rich-text ${className}`.trim()}>
      {data.root.children.map((node, index) => renderNode(node, index))}
    </div>
  )
}
