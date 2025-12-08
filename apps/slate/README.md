# Slate 子应用

用于在 Vue 3 中集成 Slate 的槽位编辑器 Demo。

## 开发

- 安装依赖：`pnpm -F slate install`
- 本地开发：`pnpm -F slate dev`
- 类型检查：`pnpm -F slate typecheck`
- 代码风格检查：`pnpm -F slate lint`

## Git 信息

- 许可证：MIT
- 作者：shilili <18262272638@163.com>
- 主分支：main
- 忽略规则：见 `.gitignore` / `.gitattributes`

## 目录结构

- `src/components/SlotEditor.vue` 编辑器实现
- `src/App.vue` 示例页面与工具栏
- `vite.config.ts`、`tsconfig.json` 构建与 TypeScript 配置
