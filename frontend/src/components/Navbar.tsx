import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut, Menu, X, ShieldCheck, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/src/lib/utils';
import { useLanguage, LangCode } from '@/src/context/LanguageContext';

export function Navbar({ userRole, onLogout }: { userRole: string | null, onLogout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    const langs: LangCode[] = ['EN', 'HI', 'MR', 'TA', 'BN'];
    const currentIndex = langs.indexOf(lang);
    setLang(langs[(currentIndex + 1) % langs.length]);
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">GovFinTech</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Globe className="h-4 w-4" />
              {lang}
            </button>

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {userRole ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  <User className="h-4 w-4" />
                  {userRole === 'admin' ? t('Administrator') : t('Citizen')}
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('Logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-700">
                <Button variant="ghost" onClick={() => navigate('/login')}>{t('Login')}</Button>
                <Button onClick={() => navigate('/login')}>{t('Register')}</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Globe className="h-5 w-5" />
              Language: {lang}
            </button>

            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {userRole ? (
              <>
                <div className="px-3 py-2 text-base font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {userRole === 'admin' ? t('Administrator') : t('Citizen')}
                </div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  {t('Logout')}
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Button variant="outline" className="w-full justify-center" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>{t('Login')}</Button>
                <Button className="w-full justify-center" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>{t('Register')}</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
