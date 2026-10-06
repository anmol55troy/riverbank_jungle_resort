'use client'

import React, { useState } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  EditorState,
} from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import type { SerializedEditorState } from '@/lib/types'

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [blockType, setBlockType] = useState('paragraph')

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
    setBlockType('paragraph')
  }

  const formatHeading = (level: 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(level))
      }
    })
    setBlockType(level)
  }

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    setBlockType('ul')
  }

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    setBlockType('ol')
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
    setBlockType('quote')
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <select
        value={blockType}
        onChange={(e) => {
          const val = e.target.value
          if (val === 'paragraph') formatParagraph()
          else if (val === 'h2' || val === 'h3') formatHeading(val)
          else if (val === 'ul') formatBulletList()
          else if (val === 'ol') formatNumberedList()
          else if (val === 'quote') formatQuote()
        }}
        className="text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 font-medium cursor-pointer focus:outline-none"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="ul">Bullet List</option>
        <option value="ol">Numbered List</option>
        <option value="quote">Quote</option>
      </select>

      <div className="h-4 w-[1px] bg-gray-900/20 mx-1" />

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-900 font-bold text-xs cursor-pointer min-w-6 text-center"
        title="Bold"
      >
        B
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-900 italic text-xs cursor-pointer min-w-6 text-center"
        title="Italic"
      >
        I
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-900 underline text-xs cursor-pointer min-w-6 text-center"
        title="Underline"
      >
        U
      </button>

      <div className="h-4 w-[1px] bg-gray-900/20 mx-1" />

      <button
        type="button"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-900 text-xs cursor-pointer"
        title="Undo"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-900 text-xs cursor-pointer"
        title="Redo"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
      </button>
    </div>
  )
}

export interface RichTextEditorProps {
  name: string
  defaultValue?: SerializedEditorState | null
  error?: boolean
}

export function RichTextEditor({ name, defaultValue, error }: RichTextEditorProps) {
  const [jsonValue, setJsonValue] = useState<string>(() => {
    if (!defaultValue) return ''
    try {
      return typeof defaultValue === 'string' ? defaultValue : JSON.stringify(defaultValue)
    } catch {
      return ''
    }
  })

  const initialConfig = {
    namespace: 'AdminRichText',
    theme: {
      paragraph: 'mb-2 text-sm leading-relaxed',
      heading: {
        h2: 'text-lg font-serif font-semibold text-gray-900 mt-3 mb-1',
        h3: 'text-base font-serif font-medium text-gray-900 mt-2 mb-1',
      },
      list: {
        ul: 'list-disc pl-5 mb-2 text-sm',
        ol: 'list-decimal pl-5 mb-2 text-sm',
      },
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
      },
      quote: 'border-l-2 border-gold pl-3 italic text-gray-500 my-2 text-sm',
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    editorState: defaultValue ? (editor: unknown) => {
      try {
        const lexicalEditor = editor as { parseEditorState: (s: unknown) => unknown, setEditorState: (s: unknown) => void }
        const parsed = lexicalEditor.parseEditorState(defaultValue)
        lexicalEditor.setEditorState(parsed)
      } catch (e) {
        console.error('Error parsing initial editor state:', e)
      }
    } : undefined,
    onError: (err: Error) => {
      console.error('Lexical Error:', err)
    },
  }

  const handleOnChange = (editorState: EditorState) => {
    editorState.read(() => {
      const json = JSON.stringify(editorState.toJSON())
      setJsonValue(json)
    })
  }

  return (
    <div
      className={`rounded-lg border bg-white transition-colors focus-within:ring-2 focus-within:ring-espresso/20 ${
        error ? 'border-rose-400 focus-within:border-rose-600' : 'border-gray-300 focus-within:border-gray-300'
      }`}
    >
      <input type="hidden" name={name} value={jsonValue} />
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative p-3 min-h-[160px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[140px] text-sm text-gray-900 font-sans" />
            }
            placeholder={
              <div className="pointer-events-none absolute top-3 left-3 text-gray-900/40 text-sm">
                Enter description or article content...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={handleOnChange} />
        </div>
      </LexicalComposer>
    </div>
  )
}
