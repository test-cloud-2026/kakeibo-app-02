import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kakeibo-expenses';

// ローカルストレージから支出データを読み込む（初回レンダリング時のみ実行）
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function useExpenses() {
  const [expenses, setExpenses] = useState(loadFromStorage);

  // 支出データが変わるたびにローカルストレージへ永続化
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  // レシート1枚分の複数アイテムをまとめて追加
  const addExpenses = (newItems) => {
    setExpenses((prev) => [...newItems, ...prev]);
  };

  // 指定IDのアイテムを削除
  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // 全データを削除（確認ダイアログあり）
  const clearAll = () => {
    if (window.confirm('全ての支出データを削除しますか？')) {
      setExpenses([]);
    }
  };

  return { expenses, addExpenses, deleteExpense, clearAll };
}
