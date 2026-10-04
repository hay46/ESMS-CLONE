import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, ExternalLink, RotateCcw, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { cloudEnabled, resetDemoData } from '../../../lib/api';
import { demoAccounts } from '../../../lib/seed';
import { Badge, SectionCard } from '../../../components/ui/Primitives';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const SHORTCUTS = [
  { label: 'Students', to: '/students' },
  { label: 'Faculty', to: '/faculty' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Events', to: '/events' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function AdminTools() {
  const { t } = useI18n();
  const { notify } = useToast();
  const { profile, updateProfile } = useAuth();
  const [resetting, setResetting] = useState(false);

  return (
    <div className="space-y-8">
      <SectionCard title={t.dashboard.directorTools} description="Site shortcuts and workspace settings.">
        <div className="grid gap-3 sm:grid-cols-3">
          {SHORTCUTS.map((shortcut) => (
            <Link
              key={shortcut.label}
              to={shortcut.to}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {shortcut.label}
              <ExternalLink className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="My Account" description={profile?.email}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</p>
            <input
              className="mt-2 w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
              value={profile?.name ?? ''}
              onChange={(event) => updateProfile({ name: event.target.value })}
            />
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</p>
            <p className="mt-2 flex items-center gap-2 text-lg font-bold capitalize text-slate-900">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              {profile?.role ?? 'guest'}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Demo Data" description="Runs entirely in your browser with localStorage.">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="flex items-center gap-2 font-bold text-slate-900">
                {cloudEnabled ? 'Firebase Firestore' : 'Local demo backend'}
                <Badge tone={cloudEnabled ? 'emerald' : 'slate'}>
                  {cloudEnabled ? 'Connected' : 'Offline'}
                </Badge>
              </p>
              <p className="text-xs text-slate-500">
                {cloudEnabled
                  ? 'Changes are written to the live Firestore project.'
                  : 'Add Firebase keys to .env.local to switch to Firestore.'}
              </p>
            </div>
          </div>

          {!cloudEnabled && (
            <button
              type="button"
              onClick={() => setResetting(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset demo data
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {demoAccounts.map((account) => (
            <div key={account.email} className="rounded-2xl border border-slate-100 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <Wrench className="h-3 w-3" />
                {account.role}
              </p>
              <p className="mt-2 truncate text-sm font-bold text-slate-900">{account.email}</p>
              <p className="text-xs text-slate-400">{account.password}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-3 w-3" />
          {demoAccounts.length} demo accounts are seeded automatically.
        </p>
      </SectionCard>

      <ConfirmDialog
        open={resetting}
        title="Reset demo data?"
        message="All students, grades, events and messages return to their seeded state."
        confirmLabel="Reset"
        tone="warning"
        onConfirm={async () => {
          await resetDemoData();
          notify('Demo data restored.');
          setResetting(false);
        }}
        onCancel={() => setResetting(false)}
      />
    </div>
  );
}