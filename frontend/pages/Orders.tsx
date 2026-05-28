import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncData } from '../hooks';
import { orderAPI, Order } from '../api';

const statusTabs = [
  { key: '', label: '全部' },
  { key: 'PENDING', label: '待支付' },
  { key: 'PAID', label: '已支付' },
  { key: 'CANCELLED', label: '已取消' },
];

const statusLabels: Record<string, { text: string; color: string }> = {
  PENDING: { text: '待支付', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  PAID: { text: '已支付', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  CANCELLED: { text: '已取消', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
  REFUNDED: { text: '已退款', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');

  const { data: orders, loading, refetch } = useAsyncData<Order[]>(
    () => orderAPI.getMyOrders(status || undefined, 50, 0),
    [status]
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-8">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">我的订单</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex gap-1 px-4 py-3 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800/50">
        {statusTabs.map(tab => (
          <button key={tab.key} onClick={() => setStatus(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${status === tab.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <main className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent"></div></div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3">receipt_long</span>
            <p className="text-sm">暂无订单</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const sl = statusLabels[order.status] || { text: order.status, color: '' };
              return (
                <div key={order.id} onClick={() => navigate(`/orders/${order.id}`)}
                  className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400">{order.order_no}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${sl.color}`}>{sl.text}</span>
                  </div>
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 mb-2">
                      <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                        {item.package_cover_url ? (
                          <img src={item.package_cover_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-lg text-slate-300">play_circle</span></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.package_title}</p>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">¥{(item.price / 100).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">合计: ¥{(order.total_amount / 100).toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
