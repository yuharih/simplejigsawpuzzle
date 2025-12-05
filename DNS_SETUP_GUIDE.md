# DNS設定ガイド - jigsawpuzzlesimple.com

このドキュメントは、`jigsawpuzzlesimple.com` をGitHub Pagesに接続するためのDNS設定手順です。

## 現在の状況

- **エラー**: `InvalidDNSError` - DNSレコードが取得できません
- **原因**: ドメインプロバイダー側でDNS設定が完了していない、または設定が間違っています
- **GitHubユーザー名**: `yuharih`
- **リポジトリ名**: `simplejigsawpuzzle`

## 解決手順

### ステップ1: ドメインプロバイダーの管理画面にアクセス

ドメイン `jigsawpuzzlesimple.com` を購入したプロバイダー（お名前.com、ムームードメイン、GoDaddy、Google Domainsなど）の管理画面にログインしてください。

### ステップ2: DNS設定画面を開く

ドメイン管理画面で以下のいずれかのメニューを探してください：
- **DNS設定**
- **DNSレコード設定**
- **ネームサーバー設定**
- **DNS管理**

### ステップ3: Aレコードを追加（ルートドメイン用）

`jigsawpuzzlesimple.com`（ルートドメイン）をGitHub Pagesに接続するため、**4つのAレコード**を追加してください。

#### 設定値（4つすべて追加）

| レコードタイプ | ホスト名 | 値（IPアドレス） | TTL |
|------------|---------|----------------|-----|
| A | `@` または空白 | `185.199.108.153` | 3600 |
| A | `@` または空白 | `185.199.109.153` | 3600 |
| A | `@` または空白 | `185.199.110.153` | 3600 |
| A | `@` または空白 | `185.199.111.153` | 3600 |

**重要**: 
- ホスト名は `@` または空白（ルートドメインを表す）
- 4つすべてのIPアドレスを追加してください（冗長性のため）
- TTLは3600（1時間）が推奨です

### ステップ4: CNAMEレコードを追加（wwwサブドメイン用・オプション）

`www.jigsawpuzzlesimple.com` も使いたい場合は、CNAMEレコードを追加してください。

| レコードタイプ | ホスト名 | 値 | TTL |
|------------|---------|-----|-----|
| CNAME | `www` | `yuharih.github.io` | 3600 |

### ステップ5: GitHub Pagesの設定を確認

1. GitHubリポジトリ `https://github.com/yuharih/simplejigsawpuzzle` にアクセス
2. **Settings** > **Pages** を開く
3. **Custom domain** セクションで `jigsawpuzzlesimple.com` が入力されているか確認
4. 入力されていない場合は、`jigsawpuzzlesimple.com` を入力して **Save** をクリック

### ステップ6: DNS設定の反映を待つ

- DNS設定の変更は**数分〜数時間**で反映されます
- 最大48時間かかることがありますが、通常は数時間以内です
- 反映状況は以下のコマンドで確認できます：

```bash
# DNSレコードの確認
dig jigsawpuzzlesimple.com +short

# 正しく設定されていれば、以下のIPアドレスのいずれかが表示されます：
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153
```

### ステップ7: GitHub Pagesの検証を確認

DNS設定が反映されると、GitHub Pagesの設定画面で以下が表示されます：

- ✅ **DNS check successful** - DNS設定が正しく検証されました
- ✅ **Certificate is valid** - SSL証明書が有効です

この状態になったら、**Enforce HTTPS** にチェックを入れてください。

## プロバイダー別の設定例

### お名前.com の場合

1. ドメイン一覧から `jigsawpuzzlesimple.com` を選択
2. **DNS関連機能の設定** をクリック
3. **DNSレコード設定を利用する** を選択
4. **Aレコード** を4つ追加（上記のIPアドレス）
5. **設定する** をクリック

### ムームードメイン の場合

1. ドメイン一覧から `jigsawpuzzlesimple.com` を選択
2. **DNS設定** タブを開く
3. **Aレコード** を4つ追加（上記のIPアドレス）
4. **設定を反映** をクリック

### GoDaddy の場合

1. マイプロダクトから `jigsawpuzzlesimple.com` を選択
2. **DNS** タブを開く
3. **レコード** セクションで **追加** をクリック
4. **Aレコード** を4つ追加（上記のIPアドレス）
5. **保存** をクリック

## トラブルシューティング

### エラー: "InvalidDNSError" が続く

1. **DNS設定が正しいか再確認**
   - 4つのAレコードがすべて追加されているか
   - IPアドレスが正確か（コピペミスがないか）
   - ホスト名が `@` または空白になっているか

2. **DNS設定の反映を待つ**
   - 設定変更後、最低30分〜1時間待ってから再確認
   - `dig jigsawpuzzlesimple.com +short` でDNSレコードが表示されるか確認

3. **GitHub Pagesの設定を確認**
   - Custom domain に `jigsawpuzzlesimple.com` が正しく入力されているか
   - 誤って `www.jigsawpuzzlesimple.com` になっていないか

### DNSレコードが表示されない

```bash
# DNS設定を確認
dig jigsawpuzzlesimple.com ANY +noall +answer

# 何も表示されない場合、DNS設定がまだ反映されていません
# プロバイダーの設定画面で保存が完了しているか確認してください
```

### 設定後もエラーが続く場合

1. ドメインプロバイダーのサポートに問い合わせ
2. GitHub Pagesのドキュメントを確認: https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site

## 確認コマンド

設定が完了したら、以下のコマンドで確認できます：

```bash
# DNSレコードの確認
dig jigsawpuzzlesimple.com +short

# 詳細なDNS情報
dig jigsawpuzzlesimple.com ANY +noall +answer

# 別の方法
nslookup jigsawpuzzlesimple.com
```

正しく設定されていれば、GitHub PagesのIPアドレス（185.199.108.153など）が表示されます。

## 次のステップ

DNS設定が完了し、GitHub Pagesで「DNS check successful」と表示されたら：

1. **Enforce HTTPS** にチェックを入れる
2. 数分待ってから `https://jigsawpuzzlesimple.com` にアクセス
3. サイトが正常に表示されることを確認

