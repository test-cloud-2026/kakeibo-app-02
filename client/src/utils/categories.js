// カテゴリの定義（ラベル・カラー・アイコン）
export const CATEGORIES = {
  食費:   { label: '食費',   color: '#4CAF50', icon: '🛒' },
  外食:   { label: '外食',   color: '#FF9800', icon: '🍽️' },
  日用品: { label: '日用品', color: '#2196F3', icon: '🧴' },
  交通費: { label: '交通費', color: '#9C27B0', icon: '🚃' },
  娯楽:   { label: '娯楽',   color: '#E91E63', icon: '🎮' },
  医療:   { label: '医療',   color: '#F44336', icon: '💊' },
  衣料:   { label: '衣料',   color: '#00BCD4', icon: '👕' },
  その他: { label: 'その他', color: '#9E9E9E', icon: '📦' },
};

export const CATEGORY_LIST = Object.keys(CATEGORIES);
