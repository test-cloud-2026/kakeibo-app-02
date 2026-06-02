import { useState } from 'react';
import ReceiptUploader from './components/ReceiptUploader';
import ExpenseList from './components/ExpenseList';
import Charts from './components/Charts';
import CategorySummary from './components/CategorySummary';
import useExpenses from './hooks/useExpenses';
import './App.css';

export default function App() {
  const { expenses, addExpenses, deleteExpense, clearAll } = useExpenses();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // 表示タブ: 'list'（明細一覧）| 'charts'（グラフ・集計）
  const [activeTab, setActiveTab] = useState('list');

  // レシート画像をサーバーへ送信し、解析結果を支出として登録する
  const handleReceiptUpload = async (file) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'レシートの読み取りに失敗しました');
      }

      const data = await response.json();

      // レシート1枚を識別するIDを付与し、各アイテムを個別のレコードとして登録
      const receiptId = crypto.randomUUID();
      const newExpenses = data.items.map((item) => ({
        id: crypto.randomUUID(),
        receiptId,
        date: data.date,
        store: data.store,
        name: item.name,
        price: Number(item.price),
        category: item.category,
      }));

      addExpenses(newExpenses);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.price, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🧾 レシート家計簿</h1>
          <div className="header-stats">
            <span className="total-badge">
              合計: <strong>¥{totalAmount.toLocaleString()}</strong>
            </span>
            <span className="count-badge">{expenses.length} 件</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* レシートアップロードエリア */}
        <div className="upload-section">
          <ReceiptUploader onUpload={handleReceiptUpload} isLoading={isLoading} />
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
        </div>

        {/* データが1件以上ある場合に明細・グラフを表示 */}
        {expenses.length > 0 && (
          <div className="content-section">
            <div className="tab-nav">
              <button
                className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                明細一覧
              </button>
              <button
                className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
                onClick={() => setActiveTab('charts')}
              >
                グラフ・集計
              </button>
            </div>

            {activeTab === 'list' ? (
              <div className="list-section">
                <div className="section-header">
                  <h2>支出明細</h2>
                  <button className="clear-btn" onClick={clearAll}>全削除</button>
                </div>
                <ExpenseList expenses={expenses} onDelete={deleteExpense} />
              </div>
            ) : (
              <div className="charts-section">
                <CategorySummary expenses={expenses} />
                <Charts expenses={expenses} />
              </div>
            )}
          </div>
        )}

        {/* データ未登録時の案内 */}
        {expenses.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">🧾</div>
            <p>レシートをアップロードして家計管理を始めましょう</p>
          </div>
        )}
      </main>
    </div>
  );
}
