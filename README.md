# タスク管理アプリ


## 🚀 デプロイ済みアプリ

**フロントエンド**: http://edwardlearningappstack-frontendbucketefe2e19c-get0n8apx1x7.s3-website-ap-northeast-1.amazonaws.com

**API**: https://yerayyikh0.execute-api.ap-northeast-1.amazonaws.com

## 📋 機能

- ✅ タスクの追加
- ✅ タスクの表示
- ✅ タスクの完了/未完了切り替え
- ✅ タスクの削除

## 🛠 技術スタック

### フロントエンド
- **React** + **TypeScript** + **Vite**
- モダンなUI/UXデザイン
- レスポンシブデザイン

### バックエンド
- **Hono** (高速軽量なWebフレームワーク)
- **AWS Lambda** (サーバーレス)
- **API Gateway** (HTTP API)

### データベース
- **Neon PostgreSQL** (サーバーレスDB)
- **Drizzle ORM** (型安全なORM)

### インフラ
- **AWS CDK** (Infrastructure as Code)
- **S3** (静的サイトホスティング)

## 📁 プロジェクト構成

```
├── src/                    # バックエンドコード
│   ├── db/                # データベース設定
│   ├── routes/            # API ルート
│   └── lambda.ts          # Lambda関数
├── frontend/              # フロントエンドコード
│   ├── src/
│   │   ├── components/    # Reactコンポーネント
│   │   ├── services/      # API呼び出し
│   │   └── hooks/         # カスタムフック
│   └── dist/              # ビルド済みファイル
└── infra/                 # AWS CDKコード
    └── lib/               # インフラ定義
```

## 🚀 開発環境のセットアップ

### 必要なもの
- **Bun** (パッケージマネージャー)
- **Node.js** 18+
- **Neon** データベースアカウント

### 手順

1. **リポジトリをクローン**
```bash
git clone <このリポジトリのURL>
cd ai-first-dev-test-1
```

2. **依存関係をインストール**
```bash
bun install
cd frontend && bun install
cd ../infra && bun install
```

3. **環境変数を設定**
```bash
# .env ファイルを作成
DATABASE_URL=your_neon_database_url
```

4. **データベースのセットアップ**
```bash
# スキーマをプッシュ
bun run db:push
```

5. **開発サーバーの起動**
```bash
# バックエンド
bun run dev

# フロントエンド（別ターミナル）
cd frontend && bun run dev
```

## 📦 デプロイ

### AWS CDKでのデプロイ
```bash
cd infra
bun run build
bun run deploy
```

## 🔧 主要なコマンド

```bash
# バックエンド開発サーバー
bun run dev

# フロントエンドビルド
cd frontend && bun run build

# データベーススキーマ更新
bun run db:push

# インフラデプロイ
cd infra && bun run deploy
```

## 🗄 データベース

### Drizzle ORM を使用
- 型安全なクエリ
- 自動型生成
- マイグレーション管理

### テーブル構成
- `users`: ユーザー情報
- `tasks`: タスク情報（ユーザーとの関連付け）

## 📱 API エンドポイント

- `GET /api/tasks` - タスク一覧取得
- `POST /api/tasks` - タスク作成
- `PUT /api/tasks/:id` - タスク更新
- `DELETE /api/tasks/:id` - タスク削除





