# カスタムドメインの設定手順

GitHub Pagesでカスタムドメインを使用する手順です。

## 前提条件

- ドメインを購入済みであること
- ドメインのDNS設定にアクセスできること

## 手順

### 1. GitHubリポジトリでカスタムドメインを設定

1. GitHubリポジトリのページで **Settings** タブを開く
2. 左サイドバーの **Pages** をクリック
3. **Custom domain** セクションで、購入したドメインを入力
   - 例: `example.com` または `www.example.com`
4. **Save** をクリック

### 2. DNS設定（ドメインプロバイダー側）

ドメインプロバイダー（お名前.com、ムームードメインなど）のDNS設定で、以下のCNAMEレコードまたはAレコードを追加します。

#### サブドメイン（www.example.com）を使用する場合

**CNAMEレコード**を追加：
- **ホスト名**: `www`
- **値**: `yuharih.github.io`
- **TTL**: 3600（デフォルト）

#### ルートドメイン（example.com）を使用する場合

**Aレコード**を追加（GitHub PagesのIPアドレス）：
- **ホスト名**: `@` または空白
- **値**: 以下のIPアドレスのいずれか：
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **TTL**: 3600（デフォルト）

**注意**: 4つのIPアドレスすべてを追加することを推奨します（冗長性のため）

### 3. HTTPSの有効化

1. GitHubがDNS設定を検証するまで数分〜数時間待ちます
2. **Settings > Pages** で **Enforce HTTPS** にチェックを入れる
3. これにより、HTTPS接続が強制されます

### 4. Viteの設定を更新

カスタムドメインを使用する場合、`vite.config.ts`のベースパスを`/`に変更する必要があります：

```typescript
const base = process.env.BASE_URL || '/'
```

### 5. 設定をコミット・プッシュ

```bash
git add vite.config.ts
git commit -m "Update: カスタムドメイン用にベースパスを変更"
git push origin main
```

### 6. 動作確認

1. ブラウザでカスタムドメインにアクセス
2. サイトが正常に表示されることを確認
3. **Settings > Pages** で「DNS check successful」と表示されることを確認

## トラブルシューティング

### DNS設定が反映されない

- DNS設定の変更が反映されるまで最大48時間かかることがあります
- 通常は数時間以内に反映されます
- `dig example.com` または `nslookup example.com` コマンドでDNS設定を確認できます

### HTTPSが有効にならない

- DNS設定が正しく反映されているか確認
- **Enforce HTTPS** のチェックが有効になっているか確認
- 数時間待ってから再度確認

### 404エラーが表示される

- `vite.config.ts`のベースパスが`/`になっているか確認
- 変更後、再度ビルド・デプロイされているか確認

## 参考リンク

- [GitHub Pages カスタムドメインの公式ドキュメント](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site)
