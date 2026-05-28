import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseShopAPI, orderAPI, CoursePackage } from '../api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CoursePackage[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartIds: string[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartIds.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(cartIds.map(id => courseShopAPI.getPackage(id).catch(() => null)))
      .then(items => {
        const valid = items.filter(Boolean) as CoursePackage[];
        setCartItems(valid);
        setSelected(new Set(valid.map(i => i.id)));
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === cartItems.length) setSelected(new Set());
    else setSelected(new Set(cartItems.map(i => i.id)));
  };

  const removeSelected = () => {
    const remaining = cartItems.filter(i => !selected.has(i.id));
    setCartItems(remaining);
    setSelected(new Set());
    localStorage.setItem('cart', JSON.stringify(remaining.map(i => i.id)));
  };

  const totalPrice = cartItems.filter(i => selected.has(i.id)).reduce((sum, i) => sum + i.selling_price, 0);

  const checkout = async () => {
    const packageIds = cartItems.filter(i => selected.has(i.id)).map(i => i.id);
    if (packageIds.length === 0) return;
    try {
      const order = await orderAPI.createOrder(packageIds);
      const remaining = cartItems.filter(i => !selected.has(i.id));
      localStorage.setItem('cart', JSON.stringify(remaining.map(i => i.id)));
      navigate(`/orders/${order.id}`);
    } catch {
      alert('创建订单失败，请先登录');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full size-8 border-2 border-primary border-t-transparent"></div></div>;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">购物车</h1>
        <button onClick={removeSelected} className="text-sm text-red-500 font-medium">删除</button>
      </header>

      <main className="p-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3">shopping_cart</span>
            <p className="text-sm">购物车是空的</p>
            <button onClick={() => navigate('/course-shop')} className="mt-4 px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium">去逛逛</button>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-white dark:bg-surface-dark rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                <button onClick={() => toggleSelect(item.id)} className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected.has(item.id) ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                  {selected.has(item.id) && <span className="material-symbols-outlined text-white text-sm">check</span>}
                </button>
                <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl text-slate-300">play_circle</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.course_count} 节课 · 有效期 {item.expire_days} 天</p>
                  <span className="text-primary font-bold text-sm mt-1 block">¥{(item.selling_price / 100).toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 px-4 py-3 pb-safe z-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={toggleAll} className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected.size === cartItems.length && cartItems.length > 0 ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                {selected.size === cartItems.length && cartItems.length > 0 && <span className="material-symbols-outlined text-white text-sm">check</span>}
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">全选</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">合计</p>
                <p className="text-primary font-bold text-lg">¥{(totalPrice / 100).toFixed(0)}</p>
              </div>
              <button onClick={checkout} disabled={selected.size === 0}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 disabled:opacity-40 disabled:shadow-none hover:bg-blue-600 active:scale-[0.99] transition-all">
                结算({selected.size})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
