import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isCodeLogin, setIsCodeLogin] = useState(false);
  const [target, setTarget] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  const isEmail = target.includes('@');

  const handleSendCode = async () => {
    if (!target) {
      setError('请输入邮箱或手机号');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.auth.sendCode(target, 'login');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isCodeLogin) {
        if (!code) {
          setError('请输入验证码');
          setLoading(false);
          return;
        }
        await api.auth.loginWithCode({
          ...(isEmail ? { email: target } : { phone: target }),
          code,
        });
      } else {
        if (!password) {
          setError('请输入密码');
          setLoading(false);
          return;
        }
        await api.auth.loginWithPassword({
          ...(isEmail ? { email: target } : { phone: target }),
          password,
        });
      }
      
      // 登录成功，跳转到首页（token 和用户信息已在 api.ts 中自动保存）
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">explore</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">欢迎回来</h1>
          <p className="text-slate-500 dark:text-slate-400">登录 GeoExplorer 继续探索</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              邮箱或手机号
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                person
              </span>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="请输入邮箱或手机号"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {isCodeLogin ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                验证码
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                    lock_clock
                  </span>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="请输入验证码"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || loading || !target}
                  className="px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/20 transition-colors"
                >
                  {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                密码
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !target}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-base shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setIsCodeLogin(!isCodeLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isCodeLogin ? '使用密码登录' : '使用验证码登录'}
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            还没有账号？<span className="text-primary hover:underline">立即注册</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
