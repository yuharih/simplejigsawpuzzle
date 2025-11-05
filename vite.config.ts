import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages用のベースパス
// リポジトリ名に応じて変更してください
// 例: リポジトリ名が "simplejigsawpuzzle" の場合、"/simplejigsawpuzzle/"
// ルートドメイン（username.github.io）の場合、"/" に変更してください
const base = process.env.BASE_URL || '/simplejigsawpuzzle/'

export default defineConfig({
  base,
  plugins: [react()],
})

