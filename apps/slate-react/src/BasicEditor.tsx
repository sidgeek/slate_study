import React, { useMemo, useState, useCallback } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

export function BasicEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState<Descendant[]>([
    { children: [{ text: 'Hello Slate React!' }] } as Descendant,
  ])

  const renderElement = useCallback((props: any) => {
    const { element, attributes, children } = props
    if ((element as any).type === 'paragraph') {
      return <p {...attributes}>{children}</p>
    }
    return <span {...attributes}>{children}</span>
  }, [])

  return (
    <Slate editor={editor} initialValue={value} onChange={setValue}>
      <Editable
        renderElement={renderElement}
        placeholder="在这里输入..."
        spellCheck={false}
      />
    </Slate>
  )
}
