# GitHub Pagesへのデプロイ手順

このアプリをGitHub Pagesで公開する手順です。

## 事前準備

1. GitHubアカウントを持っていること
2. Gitがインストールされていること

## 手順

### 1. GitHubリポジトリの作成

1. GitHubにログインして、新しいリポジトリを作成します
2. リポジトリ名を決定します（例: `supersimplejigsawpuzzle`）
3. **公開（Public）**リポジトリとして作成してください（GitHub Pagesの無料プランでは必須）

### 2. リポジトリにコードをプッシュ

ターミナルでプロジェクトディレクトリに移動して、以下のコマンドを実行：

```bash
# Gitリポジトリの初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加（YOUR_USERNAMEとREPO_NAMEを実際の値に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# メインブランチを設定
git branch -M main

# プッシュ
git push -u origin main
```

### 3. リポジトリ名に合わせて設定を調整

リポジトリ名が `supersimplejigsawpuzzle` 以外の場合、`vite.config.ts` の base を変更してください：

```typescript
// 例: リポジトリ名が "my-puzzle-app" の場合
const base = process.env.BASE_URL || '/my-puzzle-app/'
```

**ルートドメイン（username.github.io）を使う場合**：
```typescript
const base = process.env.BASE_URL || '/'
```

### 4. GitHub Pagesの設定

1. GitHubリポジトリのページで **Settings** タブを開く
2. 左サイドバーの **Pages** をクリック
3. **Source** セクションで：
   - **Deploy from a branch** を選択
   - **Branch** を `gh-pages` に設定（GitHub Actionsを使う場合は不要）
   - または **GitHub Actions** を選択（推奨）

### 5. GitHub Actionsで自動デプロイ（推奨）

このリポジトリには `.github/workflows/deploy.yml` が含まれています。

1. コードをプッシュすると、自動的にGitHub Actionsが実行されます
2. **Actions** タブでビルドとデプロイの進行状況を確認できます
3. デプロイが完了すると、**Settings > Pages** で公開URLが表示されます

### 6. 公開URLの確認

デプロイが完了すると、以下のURLでアプリにアクセスできます：

```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

例：
```
https://yukariharada.github.io/supersimplejigsawpuzzle/
```

## トラブルシューティング

### 画像が表示されない

- `public/images/` フォルダに画像ファイルが存在することを確認
- ビルド後、`dist/images/` に画像がコピーされているか確認

### 404エラーが表示される

- `vite.config.ts` の `base` 設定が正しいか確認
- リポジトリ名とURLパスが一致しているか確認

### デプロイが失敗する

- GitHubリポジトリの **Settings > Pages** で **Source** が正しく設定されているか確認
- **Actions** タブでエラーログを確認

## 手動デプロイ（代替方法）

GitHub Actionsを使わない場合：

```bash
# ビルド
npm run build

# gh-pagesパッケージをインストール（初回のみ）
npm install --save-dev gh-pages

# package.jsonにdeployスクリプトを追加
# "deploy": "gh-pages -d dist"

# デプロイ
npm run deploy
```

この方法を使う場合は、`package.json` に以下を追加してください：

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

