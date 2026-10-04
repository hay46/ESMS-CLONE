import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CalendarDays, LayoutDashboard, Mail, Search, Users } from 'lucide-react';
import Modal from '../ui/Modal';
import { useI18n } from '../../context/I18nContext';

const TARGETS = [
  { to: '/', label: 'Home', icon: BookOpen },
  { to: '/about', label: 'About', icon: Users },
  { to: '/admissions', label: 'Admissions', icon: BookOpen },
  { to: '/academics', label: 'Academics', icon: BookOpen },
  { to: '/faculty', label: 'Faculty', icon: Users },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/contact', label: 'Contact', icon: Mail },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TARGETS.filter((target) => {
      const label = t.nav[target.label.toLowerCase()] ?? target.label;
      return !needle || `${label} ${target.label}`.toLowerCase().includes(needle);
    });
  }, [query, t]);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-xl" bare>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"
      >
        <Search className="h-5 w-5 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Jump to a page…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        <kbd className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
          ESC
        </kbd>
      </motion.div>
      <div className="max-h-80 overflow-y-auto p-3">
        <AnimatePresence>
          {results.map((target) => {
            const Icon = target.icon;
            return (
              <button
                key={target.to}
                type="button"
                onClick={() => {
                  navigate(target.to);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-800">
                  {t.nav[target.label.toLowerCase()] ?? target.label}
                </span>
              </button>
            );
          })}
        </AnimatePresence>
        {results.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-400">No pages match “{query}”.</p>
        )}
      </div>
    </Modal>
  );
}