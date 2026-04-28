import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Wallet, ArrowRight } from 'lucide-react';
import { authenticateUser } from '../services/mockService';
import { loginApi } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError(t('login_error_empty'));
      setLoading(false);
      return;
    }

    try {
        const user = await loginApi(username, password);
        onLogin(user);
        setLoading(false);
        return;
    } catch (e) {
        console.log("API Login failed, trying local mock...");
    }

    const user = authenticateUser(username, password);
    if (user) {
        onLogin(user);
    } else {
        setError(t('login_error_invalid'));
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-primary-bg">
      
      <div className="bg-primary-card/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary-border w-full max-w-md relative z-10 mx-4">
        
        <div className="flex flex-col items-center mb-10">
            <div className="bg-primary-bg p-5 rounded-2xl shadow-inner border border-primary-border mb-6 text-primary-accent">
                <Wallet size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-100 tracking-tight text-center">TrueMoney <span className="text-primary-accent">Dashboard</span></h2>
            <p className="text-gray-400 mt-2 text-sm font-medium">Secure Admin Access</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-4 rounded-xl mb-8 text-sm text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Lock size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase ml-1 tracking-wider">{t('username')}</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-primary-bg border border-primary-border text-white text-base px-4 py-3 rounded-xl focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all placeholder:text-zinc-600 shadow-inner"
              disabled={loading}
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-400 text-xs font-bold uppercase ml-1 tracking-wider">{t('password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-primary-bg border border-primary-border text-white text-base px-4 py-3 rounded-xl focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all placeholder:text-zinc-600 shadow-inner"
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-accent hover:bg-amber-400 text-zinc-950 font-semibold text-base py-3.5 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20 flex items-center justify-center gap-3 group mt-6"
          >
            {loading ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
                <>{t('signin_btn')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></>
            )}
          </button>
        </form>
      </div>

      <p className="text-gray-500 text-sm mt-8 font-medium">{t('secure_connection')}</p>
    </div>
  );
};

export default Login;