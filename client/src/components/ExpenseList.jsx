import { CATEGORIES } from '../utils/categories';

// 支出明細を日付降順で一覧表示するコンポーネント
export default function ExpenseList({ expenses, onDelete }) {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="expense-list">
      <div className="expense-table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>日付</th>
              <th>店舗</th>
              <th>商品名</th>
              <th>カテゴリ</th>
              <th>金額</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((expense) => {
              const cat = CATEGORIES[expense.category] ?? CATEGORIES['その他'];
              return (
                <tr key={expense.id}>
                  <td className="date-cell">{expense.date}</td>
                  <td className="store-cell" title={expense.store}>{expense.store}</td>
                  <td className="name-cell" title={expense.name}>{expense.name}</td>
                  <td>
                    {/* カテゴリカラーで色付けしたバッジ */}
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: cat.color + '20',
                        color: cat.color,
                        borderColor: cat.color,
                      }}
                    >
                      {cat.icon} {expense.category}
                    </span>
                  </td>
                  <td className="price-cell">¥{expense.price.toLocaleString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(expense.id)}
                      title="削除"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
