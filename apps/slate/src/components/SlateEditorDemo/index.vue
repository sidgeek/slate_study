<template>
  <Slate :editor="editor">
    <Editable :placeholder="'输入一些文本...'" />
  </Slate>
</template>

<script setup>
import { Slate, Editable } from 'slate-vue3'
import { createEditor } from 'slate-vue3/core'
import { withHistory } from 'slate-vue3/history'
import { withDOM } from 'slate-vue3/dom'

const editor = withHistory(withDOM(createEditor()))
editor.children = [
  { type: 'paragraph', children: [{ text: 'Hello Slate' }] },
]
</script>
