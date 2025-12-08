<template>
  <div class="slate-editor-content">
    <Slate :editor="editor">
      <Editable  class="input-area" :placeholder="'输入一些文本...'" />
    </Slate>
  </div>
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
</style>
