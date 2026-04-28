import React from 'react';
import { LogOut, KeyRound, ShieldCheck, Languages } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onChangePasswordClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onChangePasswordClick }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary-card text-gray-200 shadow-lg border-b border-primary-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
            <div className="bg-primary-accent/10 p-2 rounded-lg border border-primary-accent/20">
                <ShieldCheck className="text-primary-accent" size={24} />
            </div>
            <div className="flex flex-col">
                <span className="text-gray-100 font-semibold tracking-tight text-lg leading-none">
                    TM <span className="text-primary-accent">Dashboard</span>
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-1">Secure Payment Monitor</span>
            </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary-bg border border-primary-border hover:bg-zinc-800 hover:border-primary-accent/50 text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
             <Languages size={16} />
             <span className="uppercase">{language}</span>
          </button>

          {user && (
            <div className="flex items-center bg-primary-bg rounded-full pl-4 pr-1.5 py-1 border border-primary-border shadow-inner">
              <span className="text-gray-200 font-medium flex items-center gap-2 mr-3 text-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                <span className="hidden sm:inline">{user.username}</span>
              </span>
              
              <div className="flex items-center gap-1">
                {onChangePasswordClick && (
                    <button 
                        onClick={onChangePasswordClick}
                        className="p-2 rounded-full hover:bg-[#383a3e] text-gray-400 hover:text-white transition-colors"
                        title={t('change_password')}
                    >
                        <KeyRound size={18} />
                    </button>
                )}
                <button 
                  onClick={onLogout}
                  className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all shadow-md hover:shadow-lg"
                  title={t('logout')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;