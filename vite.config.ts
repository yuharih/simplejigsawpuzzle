import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages用のベースパス
// カスタムドメインを使用する場合は "/" に設定
// リポジトリ名のサブパスを使用する場合は "/リポジトリ名/" に設定
const base = process.env.BASE_URL || '/'

export default defineConfig({
  base,
  plugins: [react()],
})

