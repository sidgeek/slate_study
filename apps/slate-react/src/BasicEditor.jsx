import { useCallback, useState } from 'react'
import { createEditor, Editor, Element, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
// import { ReactEditor } from 'slate-react'

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor)
    return marks ? marks.bold === true : false
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    if (isActive) {
      Editor.removeMark(editor, 'bold')
    } else {
      Editor.addMark(editor, 'bold', true)
    }
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
    )
  },
}

const withPlaceholders = (editor) => {
  const { isInline, isVoid } = editor
  editor.isInline = element => element.type === 'slot' ? true : isInline(element)
  editor.isVoid = element => element.type === 'slot' ? true : isVoid(element)
  return editor
}

const splitTextWithPlaceholder = (text) => {
  const result = []
  const regex = /\[[^\]]*\]/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    const start = match.index
    const end = start + match[0].length
    const before = text.slice(lastIndex, start)
    result.push({ text: before })
    const inner = match[0].slice(1, -1)
    result.push({ type: 'slot', placeholder: inner, children: [{ text: '' }] })
    lastIndex = end
  }
  if (result.length === 0) {
    return [{ text }]
  }
  const after = text.slice(lastIndex)
  result.push({ text: after })
  return result
}

const initialValue = [
  {
    type: 'paragraph',
    children: splitTextWithPlaceholder('A line of text in a [test] code [test2] block.'),
  },
]

// Define a React component renderer for our code blocks.
const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>
}

const InlineInputElement = (props) => {
  return (
    <span {...props.attributes} contentEditable={false}>
      <input className='inline-input' placeholder={props.element.placeholder} style={{ width: 120 }} />
      {props.children}
    </span>
  )
}

// Define a React component to render leaves with bold text.
const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

export function BasicEditor() {
  const [editor] = useState(() => withPlaceholders(withReact(createEditor())))

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'slot':
        return <InlineInputElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    <div className='slate-Container'>
      <div>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor)
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleCodeBlock(editor)
          }}
        >
          Code Block
        </button>
      </div>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className='input-area'
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }

            switch (event.key) {
              // When "`" is pressed, keep our existing code block logic.
              case '`': {
                event.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
                break
              }

              // When "B" is pressed, bold the text in the selection.
              case 'b': {
                event.preventDefault()
                CustomEditor.toggleBoldMark(editor)
                break
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}
