import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories';

// Chart.js に必要なコンポーネントを登録
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// カテゴリ別円グラフと月別棒グラフを表示するコンポーネント
export default function Charts({ expenses }) {
  // カテゴリ別に支出を集計し、円グラフ用データを生成
  const pieData = useMemo(() => {
    const totals = {};
    CATEGORY_LIST.forEach((cat) => { totals[cat] = 0; });
    expenses.forEach((e) => {
      const cat = CATEGORY_LIST.includes(e.category) ? e.category : 'その他';
      totals[cat] += e.price;
    });

    // 金額が 0 のカテゴリは除外
    const active = CATEGORY_LIST.filter((cat) => totals[cat] > 0);
    return {
      labels: active.map((cat) => `${CATEGORIES[cat].icon} ${cat}`),
      datasets: [{
        data: active.map((cat) => totals[cat]),
        backgroundColor: active.map((cat) => CATEGORIES[cat].color + 'CC'),
        borderColor: active.map((cat) => CATEGORIES[cat].color),
        borderWidth: 2,
      }],
    };
  }, [expenses]);

  // 月（YYYY-MM）別に支出を集計し、棒グラフ用データを生成
  const barData = useMemo(() => {
    const monthTotals = {};
    expenses.forEach((e) => {
      const month = e.date.substring(0, 7);
      monthTotals[month] = (monthTotals[month] || 0) + e.price;
    });

    const months = Object.keys(monthTotals).sort();
    return {
      labels: months.map((m) => {
        const [year, mon] = m.split('-');
        return `${year}年${parseInt(mon)}月`;
      }),
      datasets: [{
        label: '支出合計',
        data: months.map((m) => monthTotals[m]),
        backgroundColor: '#4CAF5099',
        borderColor: '#4CAF50',
        borderWidth: 2,
        borderRadius: 6,
      }],
    };
  }, [expenses]);

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ¥${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ¥${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `¥${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>カテゴリ別支出</h3>
        <div className="pie-chart-wrapper">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div className="chart-card">
        <h3>月別支出推移</h3>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
}
