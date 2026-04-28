import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { User } from './types';
import { updateUser } from './services/mockService';
import { Lock, X, ServerCrash } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { checkSiteStatus } from './services/apiService';

function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-bg text-white select-none">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20">
            <ServerCrash size={64} className="text-red-500" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <p className="text-red-400 font-mono text-sm font-bold uppercase tracking-widest mb-2">502 Bad Gateway</p>
          <h1 className="text-3xl font-bold text-gray-100 mb-3">Service Unavailable</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            ระบบปิดให้บริการชั่วคราว<br/>กรุณาลองใหม่อีกครั้งในภายหลัง
          </p>
        </div>
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-card border border-primary-border text-xs text-gray-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            TrueMoney Dashboard — Offline
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { t } = useLanguage();

  // Check maintenance mode BEFORE rendering any content
  const [siteStatus, setSiteStatus] = useState<'loading' | 'online' | 'maintenance'>('loading');

  useEffect(() => {
    checkSiteStatus().then(({ maintenance }) => {
      setSiteStatus(maintenance ? 'maintenance' : 'online');
    });
  }, []);

  // Initialize user from LocalStorage for persistence
  const [user, setUser] = useState<User | null>(() => {
    try {
        const savedUser = localStorage.getItem('tm_user_session');
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
        return null;
    }
  });

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('tm_user_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tm_user_session');
  };

  const handleChangePasswordClick = () => {
      setIsPasswordModalOpen(true);
      setNewPassword('');
      setPasswordError('');
  };

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      if (!newPassword.trim()) {
          setPasswordError(t('login_error_empty'));
          return;
      }

      try {
          // 1. Update Mock (Local)
          try {
             updateUser(user.id, { password: newPassword });
          } catch (e) { }

          // 2. Update Live (API) if possible
          try {
             const res = await fetch(`/api/users/${user.id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ password: newPassword })
             });
             if (!res.ok && res.status !== 404) {
                 console.error('Failed to update password on server');
             }
          } catch (e) { }

          // 3. Update Session
          const updatedUser = { ...user, password: newPassword };
          setUser(updatedUser);
          localStorage.setItem('tm_user_session', JSON.stringify(updatedUser));
          
          setIsPasswordModalOpen(false);
          alert(t('password_changed'));
      } catch (err: any) {
          setPasswordError('Error: ' + err.message);
      }
  };

  if (siteStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-bg">
        <div className="w-8 h-8 border-2 border-primary-accent/30 border-t-primary-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (siteStatus === 'maintenance') {
    return <MaintenancePage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary-bg">
      <Header user={user} onLogout={handleLogout} onChangePasswordClick={handleChangePasswordClick} />
      
      <main className="flex-grow">
        {user ? (
          <Dashboard user={user} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>

      <Footer />

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
               <div className="bg-primary-card rounded-lg shadow-2xl border border-primary-border w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-primary-border flex justify-between items-center">
                      <h3 className="text-white font-semibold flex items-center gap-2"><Lock size={16}/> {t('change_password')}</h3>
                      <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleSubmitPasswordChange} className="p-6 space-y-4">
                       {passwordError && (
                          <div className="bg-red-900/30 text-red-300 text-sm p-2 rounded border border-red-800">
                              {passwordError}
                          </div>
                      )}
                      <div>
                          <label className="block text-gray-400 text-sm mb-1">{t('new_password')}</label>
                          <input 
                              type="text" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-primary-bg border border-primary-border text-white px-3 py-2 rounded focus:outline-none focus:border-primary-accent"
                              autoFocus
                          />
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                          <button 
                            type="button" 
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm transition-colors"
                          >
                              {t('cancel')}
                          </button>
                          <button 
                            type="submit" 
                            className="px-4 py-2 bg-primary-accent hover:bg-amber-400 text-zinc-950 font-medium rounded text-sm transition-colors"
                          >
                              {t('save')}
                          </button>
                      </div>
                  </form>
               </div>
          </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}