# kakeibo-app

レシート読み込み家計簿 Web アプリケーションです。

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | React 18 + Vite |
| バックエンド | Node.js + Express |
| AI 解析 | Claude API (claude-haiku-4-5-20251001) |
| グラフ | Chart.js + react-chartjs-2 |
| 永続化 | localStorage |

## 機能

- レシート画像のアップロード（クリック or ドラッグ＆ドロップ）
- Claude API による商品名・金額・日付の自動読み取り
- カテゴリ自動分類（食費・外食・日用品・交通費・娯楽・医療・衣料・その他）
- カテゴリ別円グラフ・月別棒グラフ表示
- ローカルストレージへのデータ永続化

## ディレクトリ構成

```
kakeibo-app/
├── .env                    # APIキー（.gitignore 済み・自分で作成）
├── .env.example            # 必要な環境変数のテンプレート
├── .gitignore
├── package.json            # ルート: concurrently でまとめて起動
├── server/
│   ├── package.json
│   └── index.js            # Express + Anthropic SDK
└── client/
    ├── package.json
    ├── vite.config.js       # /api → localhost:3001 にプロキシ
    └── src/
        ├── App.jsx / App.css
        ├── main.jsx
        ├── hooks/
        │   └── useExpenses.js   # localStorage 永続化フック
        ├── utils/
        │   └── categories.js    # カテゴリ定義（色・アイコン）
        └── components/
            ├── ReceiptUploader.jsx
            ├── ExpenseList.jsx
            ├── Charts.jsx
            └── CategorySummary.jsx
```

## セットアップ

```bash
# 1. 依存パッケージのインストール
npm run install:all

# 2. .env を作成して APIキーを設定
cp .env.example .env
# .env を開き ANTHROPIC_API_KEY=sk-ant-... を記入

# 3. 開発サーバー起動（サーバー + クライアント同時起動）
npm run dev
# → フロントエンド: http://localhost:5173
# → バックエンド:   http://localhost:3001
```

## Git 運用ルール

### コード変更のたびに GitHub へプッシュする

コードを変更したら、必ず以下の手順で GitHub にプッシュしてください。

```bash
git add <変更ファイル>
git commit -m "変更内容を簡潔に説明するメッセージ"
git push origin <ブランチ名>
```

- **ブランチ戦略**: `main` ブランチを本番相当として扱う。機能追加・修正は `feature/xxx` や `fix/xxx` ブランチを切って作業する
- **コミット単位**: 1 つの変更（機能追加・バグ修正・リファクタ）につき 1 コミット
- **コミットメッセージ**: 変更の「何を」「なぜ」が伝わる日本語または英語で記述する
- **プッシュタイミング**: ローカルでの変更が完了したら**その都度**プッシュし、作業内容を GitHub に反映する
- **force push は禁止**: `main` ブランチへの `--force` プッシュは行わない

### ブランチ命名規則

| 種別 | プレフィックス例 |
|------|----------------|
| 機能追加 | `feature/add-expense-form` |
| バグ修正 | `fix/date-format-bug` |
| リファクタ | `refactor/expense-model` |
| ドキュメント | `docs/update-readme` |

## 開発ガイドライン

- `.env` ファイル（APIキー含む）は絶対にコミットしない
- コメントは日本語で記載する
- バックエンド経由でのみ Claude API を呼び出す（ブラウザから直接キーを使わない）
