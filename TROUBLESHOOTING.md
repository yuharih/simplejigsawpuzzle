# トラブルシューティングガイド - サイトが見れなくなった場合

数日前には見れていたのに、突然サイトが見れなくなった場合の確認手順です。

## 🔍 考えられる原因

### 1. GitHub Pagesのデプロイが失敗している
- GitHub Actionsのワークフローが失敗している
- ビルドエラーが発生している
- デプロイ設定が変更された

### 2. GitHub Pagesの設定が変更された
- **Source** 設定が変更された
- **Custom domain** 設定が削除された
- **Enforce HTTPS** が無効になった

### 3. DNS設定の問題
- DNS設定が期限切れになった
- DNS設定が誤って削除された
- ドメインプロバイダーの設定が変更された

### 4. リポジトリの設定が変更された
- リポジトリがプライベートになった（GitHub PagesはPublicリポジトリのみ）
- ブランチ名が変更された
- リポジトリ名が変更された

## ✅ 確認手順（優先順）

### ステップ1: GitHubリポジトリの設定を確認

1. **GitHubリポジトリにアクセス**
   - https://github.com/yuharih/simplejigsawpuzzle

2. **Settings > Pages を確認**
   - **Source** が **GitHub Actions** になっているか確認
   - **Custom domain** に `jigsawpuzzlesimple.com` が入力されているか確認
   - **Enforce HTTPS** にチェックが入っているか確認

3. **Actions タブを確認**
   - 最新のデプロイが成功しているか確認
   - エラーが表示されていないか確認
   - デプロイが失敗している場合は、エラーログを確認

### ステップ2: DNS設定を確認

1. **DNS確認ツールで確認**
   - https://www.whatsmydns.net/
   - `jigsawpuzzlesimple.com` を検索
   - Aレコードが正しく表示されているか確認

2. **コマンドラインで確認**
   ```bash
   dig jigsawpuzzlesimple.com +short
   ```
   - GitHub PagesのIPアドレス（185.199.108.153など）が表示されるか確認

### ステップ3: デプロイを手動で再実行

1. **GitHub Actionsで手動実行**
   - **Actions** タブを開く
   - 最新のワークフローを選択
   - **Run workflow** をクリックして再実行

2. **または、コードをプッシュして再デプロイ**
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

### ステップ4: GitHub Pagesの設定を再設定

もし設定が消えている場合：

1. **Settings > Pages** を開く
2. **Custom domain** に `jigsawpuzzlesimple.com` を入力
3. **Save** をクリック
4. **Enforce HTTPS** にチェックを入れる

## 🚨 よくある問題と解決方法

### 問題1: 「DNS check successful」が表示されない

**原因**: DNS設定が正しくない、または期限切れ

**解決方法**:
1. ドメインプロバイダーの管理画面でDNS設定を確認
2. Aレコードが4つすべて設定されているか確認
3. DNS設定を再保存する

### 問題2: GitHub Actionsのデプロイが失敗している

**原因**: ビルドエラー、依存関係の問題

**解決方法**:
1. **Actions** タブでエラーログを確認
2. エラーメッセージに従って修正
3. ローカルで `npm run build` を実行してエラーを確認

### 問題3: リポジトリがプライベートになっている

**原因**: リポジトリの設定が変更された

**解決方法**:
1. **Settings > General** を開く
2. **Danger Zone** セクションで **Change visibility** をクリック
3. **Public** に変更（GitHub Pagesの無料プランでは必須）

### 問題4: カスタムドメインの設定が消えている

**原因**: 設定が誤って削除された、またはリセットされた

**解決方法**:
1. **Settings > Pages** を開く
2. **Custom domain** に `jigsawpuzzlesimple.com` を再入力
3. **Save** をクリック
4. DNS設定が正しいことを確認

## 📋 チェックリスト

以下の項目を順番に確認してください：

- [ ] GitHubリポジトリの **Settings > Pages** で設定を確認
- [ ] **Source** が **GitHub Actions** になっている
- [ ] **Custom domain** に `jigsawpuzzlesimple.com` が入力されている
- [ ] **Enforce HTTPS** にチェックが入っている
- [ ] **Actions** タブで最新のデプロイが成功している
- [ ] DNS設定が正しく反映されている（whatsmydns.netで確認）
- [ ] リポジトリが **Public** になっている
- [ ] 最新のコードがプッシュされている

## 🔧 緊急時の対処法

### 方法1: デプロイを再実行

```bash
# 空のコミットで再デプロイをトリガー
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

### 方法2: GitHub Actionsで手動実行

1. GitHubリポジトリの **Actions** タブを開く
2. 左サイドバーから **Deploy to GitHub Pages** を選択
3. **Run workflow** をクリック
4. **Run workflow** ボタンをクリック

### 方法3: GitHub Pagesの設定をリセット

1. **Settings > Pages** を開く
2. **Custom domain** を一度削除して保存
3. 再度 `jigsawpuzzlesimple.com` を入力して保存
4. **Enforce HTTPS** にチェックを入れる

## 📞 さらに問題が続く場合

1. **GitHubのドキュメントを確認**
   - https://docs.github.com/ja/pages

2. **GitHubサポートに問い合わせ**
   - GitHubリポジトリの **Settings > General** から問い合わせ可能

3. **DNSプロバイダーに問い合わせ**
   - DNS設定が正しいか確認

## 🔍 現在の状況を確認するコマンド

```bash
# DNS設定を確認
dig jigsawpuzzlesimple.com +short

# GitHubリポジトリの状態を確認
git remote -v
git log --oneline -5

# ローカルでビルドが成功するか確認
npm run build
```

## 📝 ログの確認方法

### GitHub Actionsのログ

1. GitHubリポジトリの **Actions** タブを開く
2. 最新のワークフロー実行をクリック
3. **build** ジョブと **deploy** ジョブのログを確認
4. エラーメッセージを確認

### GitHub Pagesの設定ログ

1. **Settings > Pages** を開く
2. **Custom domain** セクションの下に表示されるメッセージを確認
3. エラーメッセージがある場合は、その内容を確認

