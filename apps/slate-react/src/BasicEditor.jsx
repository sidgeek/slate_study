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

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    <div className='slate-Container'>
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
                const [match] = Editor.nodes(editor, {
                  match: n => n.type === 'code',
                })
                Transforms.setNodes(
                  editor,
                  { type: match ? 'paragraph' : 'code' },
                  {
                    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
                  }
                )
                break
              }

              // When "B" is pressed, bold the text in the selection.
              case 'b': {
                event.preventDefault()
                Editor.addMark(editor, 'bold', true)
                break
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}
