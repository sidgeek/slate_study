// src/Tiptap.tsx
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Slot from './extensions/Slot'

function toDoc(text: string) {
  const content: any[] = []
  const regex = /(\[[^\]]*\])/g
  let last = 0
  for (const m of text.matchAll(regex)) {
    if (m.index! > last) content.push({ type: 'text', text: text.slice(last, m.index!) })
    const label = m[0].slice(1, -1)
    content.push({ type: 'slot', attrs: { label } })
    last = m.index! + m[0].length
  }
  if (last < text.length) content.push({ type: 'text', text: text.slice(last) })
  return { type: 'doc', content: [{ type: 'paragraph', content }] }
}
import { useMemo } from 'react'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit, Slot],
    content: toDoc('Hello Tiptap，my name is [jack], it\'s [3] years old。'),
  })

  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor])

  return (
    <EditorContext.Provider value={providerValue}>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </EditorContext.Provider>
  )
}

export default Tiptap
