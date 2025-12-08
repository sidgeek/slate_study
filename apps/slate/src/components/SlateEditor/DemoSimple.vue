<template>
  <div class="demo-container">
    
    <div class="demo-section">      
      <SlateEditor 
        ref="editorRef"
        :initial-value="initialValue"
        placeholder="请输入内容，使用 [占位符] 格式创建输入框"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { SlateEditor } from "./index.js";

const editorRef = ref();
const currentValue = ref("");
const initialValue = ref(
  "我的名字是 ${时间范围}，今年 [年龄] 岁，住在 [城市]。"
);

const handleChange = (value) => {
  currentValue.value = value;
  console.log("编辑器内容变化：", value);
};

const handleFocus = () => {
  console.log("编辑器获得焦点");
};

const handleBlur = () => {
  console.log("编辑器失去焦点");
};

const setTemplate1 = () => {
  const template = "我的名字是[姓名]，今年[年龄]岁，住在[城市]。";
  editorRef.value?.initEditor(template);
};

const setTemplate2 = () => {
  const template = "这是一款[产品名称]，价格是[价格]元，适合[目标用户]使用。";
  editorRef.value?.initEditor(template);
};

const clearEditor = () => {
  editorRef.value?.initEditor("");
};

const getCurrentValue = () => {
  const value = editorRef.value?.getInputValue();
  alert(`当前编辑器内容：${value}`);
};
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

ul {
  margin: 0;
  padding-left: 20px;
  margin-bottom: 8px;
  line-height: 1.5;
}

code {
  background: #fefefe;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  color: #d63384;
}
</style>
