import React, { useEffect, useRef } from 'react'
import type { NodeViewProps } from '@tiptap/react'

export default function SlotView(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const label = (node.attrs?.label as string) || ''
  const value = (node.attrs?.value as string) || ''

  useEffect(() => {
    if (selected) inputRef.current?.focus()
  }, [selected])

  return (
    <span contentEditable={false} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 6px', border: '1px solid #d9d9d9', borderRadius: 6, background: '#f7faff' }}>
      <input
        ref={inputRef}
        placeholder={label || '输入'}
        value={value}
        onChange={(e) => updateAttributes({ value: e.target.value })}
        style={{ border: 'none', outline: 'none', background: 'transparent' }}
      />
    </span>
  )
}
