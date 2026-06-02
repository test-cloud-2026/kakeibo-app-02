import { useMemo } from 'react';
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories';

// カテゴリ別の集計カードを表示するコンポーネント
export default function CategorySummary({ expenses }) {
  const summary = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      const cat = CATEGORY_LIST.includes(e.category) ? e.category : 'その他';
      totals[cat] = (totals[cat] || 0) + e.price;
    });

    return CATEGORY_LIST
      .filter((cat) => totals[cat] > 0)
      .map((cat) => ({ cat, total: totals[cat] }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const grandTotal = expenses.reduce((sum, e) => sum + e.price, 0);

  return (
    <div className="category-summary">
      <h3>カテゴリ別集計</h3>
      <div className="summary-grid">
        {summary.map(({ cat, total }) => {
          const catInfo = CATEGORIES[cat];
          const pct = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : '0.0';
          return (
            <div key={cat} className="summary-card" style={{ borderColor: catInfo.color }}>
              <div className="summary-header">
                <span className="summary-icon">{catInfo.icon}</span>
                <span className="summary-label">{cat}</span>
              </div>
              <div className="summary-amount" style={{ color: catInfo.color }}>
                ¥{total.toLocaleString()}
              </div>
              {/* 全体に占める割合をプログレスバーで可視化 */}
              <div className="summary-bar">
                <div
                  className="summary-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: catInfo.color }}
                />
              </div>
              <div className="summary-percent">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
