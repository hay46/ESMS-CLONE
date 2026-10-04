import { motion } from 'framer-motion';
import { fadeUp } from '../../../components/ui/Section';

export function StatCard({ label, value, hint, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    rose: 'bg-rose-100 text-rose-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <motion.div variants={fadeUp} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </motion.div>
  );
}

export function DashboardHeader({ profile, title, subtitle, actions }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
          {title}
        </p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
          {subtitle ?? `${profile?.name ?? ''}`}
        </h1>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}