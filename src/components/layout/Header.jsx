import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Globe, LogOut, Menu, Search, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../lib/api';

export const navItems = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Admissions', to: '/admissions' },
  { name: 'Academics', to: '/academics' },
  { name: 'Faculty', to: '/faculty' },
  { name: 'Blog', to: '/blog' },
  { name: 'Events', to: '/events' },
  { name: 'Contact', to: '/contact' },
];

function LanguagePill({ compact = false }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={`flex items-center rounded-lg bg-slate-100 p-0.5 ${
        compact ? 'text-[11px]' : 'text-xs'
      }`}
    >
      {[
        { code: 'en', label: 'EN' },
        { code: 'am', label: 'አማ' },
      ].map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLang(option.code)}
          className={`rounded-md px-3 py-1 font-semibold transition-all ${
            lang === option.code ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function Header({ onOpenAuth, onOpenCommand }) {
  const { t } = useI18n();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const linkClass = ({ isActive }) =>
    `relative py-1 text-sm font-medium transition-colors ${
      isActive
        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600 after:content-['']"
        : 'text-slate-600 hover:text-blue-600'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-10 w-10 rounded-xl" />
          <span className="text-lg font-black leading-tight text-[#0f172a]">
            Abune Gorgorios
            <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">
              School
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {t.nav[item.name.toLowerCase()]}
            </NavLink>
          ))}
          {profile && (
            <NavLink to="/dashboard" className={linkClass}>
              {t.nav.dashboard}
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block">
            <LanguagePill />
          </div>

          {profile ? (
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => go('/dashboard')}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-all hover:bg-slate-100"
              >
                {profile.photo ? (
                  <img src={profile.photo} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {(profile.name ?? '?').slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-700">{profile.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => signOutUser()}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600"
                aria-label={t.nav.logout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="hidden rounded-full bg-[#2563eb] px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 lg:block"
            >
              {t.nav.login}
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenCommand?.()}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="container mx-auto space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => go(item.to)}
                  className={`flex w-full items-center justify-between border-b border-slate-50 py-3 text-left text-lg font-bold ${
                    location.pathname === item.to ? 'text-blue-600' : 'text-slate-800'
                  }`}
                >
                  {t.nav[item.name.toLowerCase()]}
                </button>
              ))}
              {profile ? (
                <button
                  type="button"
                  onClick={() => go('/dashboard')}
                  className={`flex w-full items-center justify-between border-b border-slate-50 py-3 text-left text-lg font-bold ${
                    location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-800'
                  }`}
                >
                  {t.nav.dashboard}
                </button>
              ) : (
                <div className="space-y-4 pt-6">
                  <div className="sm:hidden">
                    <LanguagePill compact />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200"
                  >
                    {t.nav.login}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export { LanguagePill };
export const GlobeIcon = Globe;