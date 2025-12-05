# DNS設定確認ツール一覧

DNS設定の反映状況を確認できるWebサイトのリストです。

## 🌍 おすすめツール（優先順）

### 1. **whatsmydns.net** ⭐ 最もおすすめ

**URL**: https://www.whatsmydns.net/

**使い方**:
1. サイトにアクセス
2. 検索ボックスに `jigsawpuzzlesimple.com` を入力
3. **A Record** を選択
4. **Search** をクリック

**特徴**:
- 世界中のDNSサーバーからDNSレコードを確認できる
- 地図上で反映状況を視覚的に確認できる
- 緑色 = 反映済み、赤色 = 未反映
- 無料で使用可能

**確認すべき値**: 
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

のいずれかが表示されていればOKです。

---

### 2. **dnschecker.org**

**URL**: https://dnschecker.org/

**使い方**:
1. サイトにアクセス
2. 検索ボックスに `jigsawpuzzlesimple.com` を入力
3. **Record Type** で **A** を選択
4. **Search** をクリック

**特徴**:
- 世界中のDNSサーバーから確認可能
- 反映状況を一覧で確認できる
- 無料で使用可能

---

### 3. **mxtoolbox.com**

**URL**: https://mxtoolbox.com/DNSLookup.aspx

**使い方**:
1. サイトにアクセス
2. 検索ボックスに `jigsawpuzzlesimple.com` を入力
3. **DNS Lookup** をクリック

**特徴**:
- DNSレコードの詳細情報を確認できる
- Aレコード、CNAMEレコードなどすべて表示
- 無料で使用可能

---

### 4. **nslookup.io**

**URL**: https://www.nslookup.io/

**使い方**:
1. サイトにアクセス
2. 検索ボックスに `jigsawpuzzlesimple.com` を入力
3. **Lookup** をクリック

**特徴**:
- シンプルで使いやすい
- DNSレコードを一覧で表示
- 無料で使用可能

---

### 5. **digwebinterface.com**

**URL**: https://www.digwebinterface.com/

**使い方**:
1. サイトにアクセス
2. **Hostnames or IP addresses** に `jigsawpuzzlesimple.com` を入力
3. **Record types** で **A** を選択
4. **Dig** をクリック

**特徴**:
- digコマンドをWebで実行できる
- 詳細なDNS情報を確認可能
- 無料で使用可能

---

## 📋 確認手順（推奨）

### ステップ1: whatsmydns.net で確認

1. https://www.whatsmydns.net/ にアクセス
2. `jigsawpuzzlesimple.com` を検索
3. **A Record** を選択
4. 地図上で緑色（反映済み）が増えているか確認
5. 表示されているIPアドレスが `185.199.108.153` などGitHub PagesのIPアドレスか確認

### ステップ2: mxtoolbox.com で詳細確認

1. https://mxtoolbox.com/DNSLookup.aspx にアクセス
2. `jigsawpuzzlesimple.com` を検索
3. **A Records** セクションで4つのIPアドレスが表示されているか確認

### ステップ3: GitHub Pagesの設定画面で確認

1. GitHubリポジトリの **Settings** > **Pages** を開く
2. **Custom domain** セクションで以下を確認：
   - ✅ **DNS check successful** と表示されているか
   - ✅ **Certificate is valid** と表示されているか

---

## ✅ 正常に設定されている場合の表示例

### whatsmydns.net の場合

```
jigsawpuzzlesimple.com
A Record

表示されるIPアドレス:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

地図上: 緑色のマーカーが多数表示される
```

### mxtoolbox.com の場合

```
DNS Lookup Results for jigsawpuzzlesimple.com

A Records:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

---

## ⚠️ まだ反映されていない場合

- **設定直後**: 30分〜1時間待ってから再確認
- **1時間経過**: プロバイダーの設定画面で保存が完了しているか確認
- **数時間経過**: プロバイダーのサポートに問い合わせ

---

## 🔍 コマンドラインで確認（Mac/Linux）

ターミナルでも確認できます：

```bash
# シンプルな確認
dig jigsawpuzzlesimple.com +short

# 詳細な確認
dig jigsawpuzzlesimple.com ANY +noall +answer

# 別の方法
nslookup jigsawpuzzlesimple.com
```

正しく設定されていれば、`185.199.108.153` などのIPアドレスが表示されます。

---

## 📝 チェックリスト

DNS設定後、以下のツールで確認してください：

- [ ] whatsmydns.net で確認（世界中のDNSサーバーから）
- [ ] mxtoolbox.com で詳細確認（Aレコードが4つ表示されるか）
- [ ] GitHub Pagesの設定画面で確認（DNS check successful）

すべてチェックが付いたら、`https://jigsawpuzzlesimple.com` にアクセスしてサイトが表示されるか確認してください。

