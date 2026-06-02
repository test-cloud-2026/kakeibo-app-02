const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// プロジェクトルートの .env を読み込む
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// メモリ上に画像データを保持するマルチパートパーサー（最大10MB）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Anthropic クライアントを初期化
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// フロントエンド（Vite dev server）からのリクエストのみ許可
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// レシート画像を受け取り、Claude API で内容を解析するエンドポイント
app.post('/api/analyze-receipt', upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '画像ファイルが必要です' });
  }

  // 対応する画像形式のみ許可
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'JPEG・PNG・GIF・WebP 形式の画像のみ対応しています' });
  }

  const imageBase64 = req.file.buffer.toString('base64');
  const mediaType = req.file.mimetype;
  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `このレシート画像を読み取り、以下の JSON 形式のみで返答してください。説明文やマークダウン記法は不要です。

{
  "date": "YYYY-MM-DD形式（不明な場合は今日の日付: ${today}）",
  "store": "店舗名（不明な場合は「不明」）",
  "items": [
    {
      "name": "商品名",
      "price": 金額の数値（税込み）,
      "category": "カテゴリ名"
    }
  ],
  "total": 合計金額の数値
}

カテゴリは以下から必ず1つ選択してください：
- 食費（食料品・飲料・スーパーでの買い物）
- 外食（レストラン・カフェ・ファストフード・テイクアウト）
- 日用品（洗剤・文具・日用雑貨・ホームセンター）
- 交通費（電車・バス・タクシー・ガソリン）
- 娯楽（映画・ゲーム・書籍・趣味）
- 医療（薬・病院・ドラッグストア医薬品）
- 衣料（衣服・靴・バッグ・アクセサリー）
- その他（上記以外）`,
            },
          ],
        },
      ],
    });

    // コードブロック（\`\`\`json ... \`\`\`）が含まれる場合にも対応
    let jsonText = response.content[0].text.trim();
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    }

    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error) {
    console.error('レシート解析エラー:', error);

    if (error instanceof SyntaxError) {
      // Claude のレスポンスが JSON として解析できなかった場合
      res.status(500).json({ error: 'AIのレスポンスを解析できませんでした。再度お試しください。' });
    } else {
      res.status(500).json({ error: `レシートの読み取りに失敗しました: ${error.message}` });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
