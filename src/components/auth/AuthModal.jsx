import { useEffect, useState } from 'react';
import { Chrome, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import Modal from '../ui/Modal';
import { Spinner } from '../ui/Primitives';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import { cloudEnabled, registerAccount, signIn, signInWithGoogle } from '../../lib/api';
import { demoAccounts } from '../../lib/seed';

const ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'director', label: 'Director' },
];

const scorePassword = (value) => {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, 4);
};

const STRENGTH = [
  { bar: 'bg-slate-200', label: '', tone: '' },
  { bar: 'bg-red-500', label: 'Weak', tone: 'text-red-500' },
  { bar: 'bg-orange-500', label: 'Fair', tone: 'text-orange-500' },
  { bar: 'bg-yellow-500', label: 'Good', tone: 'text-yellow-600' },
  { bar: 'bg-green-500', label: 'Strong', tone: 'text-green-600' },
];

export default function AuthModal({ mode, onClose }) {
  const [tab, setTab] = useState(mode ?? 'login');
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const { lang, setLang, t } = useI18n();
  const { notify } = useToast();

  useEffect(() => {
    if (mode) {
      setTab(mode);
      setErrors({});
    }
  }, [mode]);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: null }));
  };

  const validate = () => {
    const next = {};
    if (tab === 'register' && form.name.trim().length < 3) next.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      if (tab === 'login') {
        await signIn(form.email, form.password);
        notify(lang === 'en' ? 'Welcome back!' : 'እንኳን ደህና መጡ!');
      } else {
        await registerAccount({ name: form.name, email: form.email, password: form.password, role });
        notify(lang === 'en' ? 'Account created.' : 'መለያ ተፈጥሯል።');
      }
      onClose();
      setForm({ name: '', email: '', password: '' });
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const strength = STRENGTH[scorePassword(form.password)];
  const isLogin = tab === 'login';

  return (
    <Modal open={Boolean(mode)} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center">
        <img src="/favicon.svg" alt="" className="mx-auto mb-6 h-14 w-14 rounded-2xl" />
        <h2 className="mb-2 text-3xl font-bold text-slate-900">Abune Gorgorios School</h2>
        <p className="mb-8 text-slate-500">
          {isLogin ? 'Login to Portal' : 'Create your portal account'}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
        {[
          { id: 'login', label: 'Login' },
          { id: 'register', label: 'Register' },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setTab(option.id);
              setErrors({});
            }}
            className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
              tab === option.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={form.name}
              onChange={update('name')}
              placeholder="Full Name"
              className={`w-full rounded-xl border py-4 pl-11 pr-4 text-sm outline-none transition-all ${
                errors.name
                  ? 'border-red-500 ring-4 ring-red-50'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
          </div>
        )}

        {!isLogin && (
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                  role === option.id
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="Email Address"
            className={`w-full rounded-xl border py-4 pl-11 pr-4 text-sm outline-none transition-all ${
              errors.email
                ? 'border-red-500 ring-4 ring-red-50'
                : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="Password"
            className={`w-full rounded-xl border py-4 pl-11 pr-4 text-sm outline-none transition-all ${
              errors.password
                ? 'border-red-500 ring-4 ring-red-50'
                : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            }`}
          />
        </div>

        {form.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index < scorePassword(form.password) ? strength.bar : 'bg-slate-200'}`}
                />
              ))}
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${strength.tone}`}>
              {strength.label}
            </p>
          </div>
        )}

        {errors.password && <p className="text-xs font-medium text-red-500">{errors.password}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Spinner />}
          {isLogin ? 'Login to Portal' : 'Create Account'}
        </button>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-100" />
          Or continue with
          <span className="h-px flex-1 bg-slate-100" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
        >
          <Chrome className="h-5 w-5 text-blue-500" />
          Google
        </button>
      </form>

      {!cloudEnabled && (
        <div className="mt-8 space-y-2 border-t border-slate-100 pt-6">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Demo mode · no Firebase configured
          </p>
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => setForm({ name: '', email: account.email, password: account.password })}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="capitalize">{account.role}</span>
              <span className="font-mono text-[11px] text-slate-400">{account.email}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Language</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { code: 'en', label: 'English' },
            { code: 'am', label: 'አማርኛ' },
          ].map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setLang(option.code)}
              className={`rounded-xl border py-3 font-bold transition-all ${
                lang === option.code
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-slate-100 bg-slate-50 text-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-400">
          {t.contactPage.supportDesc}{' '}
          <a href={`mailto:${t.contactPage.emailValue}`} className="font-bold text-blue-600 hover:underline">
            Contact IT Support
          </a>
        </p>
      </div>
    </Modal>
  );
}