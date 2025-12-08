import { useCallback, useState } from 'react'
import { createEditor, Editor, Element, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
// import { ReactEditor } from 'slate-react'

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

export function BasicEditor() {
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]

  const [editor] = useState(() => withReact(createEditor()))

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  return (
    <div className='slate-Container'>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className='input-area'
          renderElement={renderElement}
          onKeyDown={event => {
            console.log('>>> 1', event.key, event.ctrlKey)
            if (event.key === '`' && event.ctrlKey) {
              // Prevent the "`" from being inserted by default.
              event.preventDefault()
              // Otherwise, set the currently selected blocks type to "code".
              Transforms.setNodes(
                editor,
                { type: 'code' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
              )
            }
          }}
        />
      </Slate>
    </div>
  )
}
