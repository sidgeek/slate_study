<template>
  <div class="slate-editor-content">
    <Slate :editor="editor" :render-element="renderElement">
      <Editable class="input-area" :placeholder="'输入一些文本...（支持 [槽位] ）'" />
    </Slate>
    <div class="export">最终文本：{{ outputText }}</div>
  </div>
  </template>

<script setup>
// @ts-nocheck
import { Slate, Editable, useInheritRef } from 'slate-vue3'
import { createEditor } from 'slate-vue3/core'
import { withHistory } from 'slate-vue3/history'
import { withDOM } from 'slate-vue3/dom'
import { h, ref, computed } from 'vue'

function withSlots(ed) {
  const { isInline, isVoid, markableVoid } = ed
  ed.isInline = (el) => el.type === 'slot' ? true : isInline(el)
  ed.isVoid = (el) => el.type === 'slot' ? true : isVoid(el)
  ed.markableVoid = (el) => el.type === 'slot' || markableVoid(el)
  return ed
}

function parseToNodes(text) {
  const children = []
  const regex = /(\[.*?\])/g
  let last = 0
  for (const m of text.matchAll(regex)) {
    if (m.index > last) children.push({ text: text.slice(last, m.index) })
    const label = m[0].slice(1, -1)
    children.push({ type: 'slot', placeholder: label, children: [{ text: '' }] })
    last = m.index + m[0].length
  }
  if (last < text.length) children.push({ text: text.slice(last) })
  return [{ type: 'paragraph', children }]
}

const editor = withHistory(withSlots(withDOM(createEditor())))
editor.children = parseToNodes('Hello Slate，今年 [25] 岁 。')

const slotValues = ref(new Map())

function renderElement(props) {
  const { attributes, children, element } = props
  console.log('>>> 1', props)
  if ((element).type === 'slot') {
    const idx = (editor.children[0]).children.findIndex((n) => n === element)
    return h(
      'span',
      { ...useInheritRef(attributes), contenteditable: 'false', class: 'chip' },
      [
        h('input', {
          class: 'slot-input',
          placeholder: (element).placeholder,
          value: slotValues.value.get(idx) || '',
          onInput: (e) => {
            slotValues.value.set(idx, e.target.value)
          },
        }),
      ],
    )
  }
  return h('p', attributes, children)
}

const outputText = computed(() => {
  const ch = (editor.children[0])?.children || []
  let s = ''
  ch.forEach((node, i) => {
    if (node.type === 'slot') s += slotValues.value.get(i) || node.placeholder || ''
    else if (node.text) s += node.text
  })
  return s
})
</script>

<style scoped>
.slate-editor-content {
  margin: 40px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 120px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  outline: 1px solid #e5e5e5;
  background-color: #fff;
}

.input-area {
  flex: 1;
  outline: none;
  overflow-y: auto;
  color: #333;
  font-size: 14px;
  line-height: 20px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #f7faff;
}

.slot-input {
  border: none;
  outline: none;
  background: transparent;
}

.export {
  margin-top: 12px;
  color: #666;
  font-size: 13px;
}
</style>
