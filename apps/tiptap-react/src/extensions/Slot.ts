import { Node, nodeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import SlotView from '../views/SlotView'

export interface SlotAttrs {
  label: string
  value?: string
}

const BRACKET_INPUT_REGEX = /\[([^\]]*?)\]$/

const Slot = Node.create({
  name: 'slot',
  inline: true,
  group: 'inline',
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: '',
      },
      value: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'span[data-slot]' },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['span', { 'data-slot': 'true', ...HTMLAttributes }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SlotView)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: BRACKET_INPUT_REGEX,
        type: this.type,
        getAttributes: (match: RegExpMatchArray) => {
          const label = (match?.[1] ?? '').trim()
          return { label }
        },
      }),
    ]
  },
})

export default Slot
