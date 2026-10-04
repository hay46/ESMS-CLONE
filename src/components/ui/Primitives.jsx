import { Loader2 } from 'lucide-react';

export function Spinner({ className = 'h-5 w-5' }) {
  return <Loader2 className={`${className} animate-spin`} />;
}

export function Avatar({ src, name = '', size = 'h-12 w-12', rounded = 'rounded-2xl' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        className={`${size} ${rounded} shrink-0 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${size} ${rounded} flex shrink-0 items-center justify-center bg-blue-100 text-sm font-bold text-blue-600`}
    >
      {initials || '?'}
    </div>
  );
}

const TONES = {
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  purple: 'bg-purple-100 text-purple-700',
  red: 'bg-red-100 text-red-600',
  rose: 'bg-rose-100 text-rose-600',
  violet: 'bg-violet-100 text-violet-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  orange: 'bg-orange-100 text-orange-700',
  slate: 'bg-slate-100 text-slate-600',
};

export function Badge({ children, tone = 'slate', className = '' }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TONES[tone] ?? TONES.slate} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Approved: 'emerald',
    Verified: 'emerald',
    Rejected: 'red',
    Pending: 'amber',
  };
  return <Badge tone={map[status] ?? 'slate'}>{status}</Badge>;
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="text-lg font-bold text-slate-900">{title}</p>
      {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-slate-100 bg-white p-8 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-xl font-bold text-slate-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, error, hint, children, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="ml-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="ml-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="ml-1 text-[10px] font-bold text-red-500">{error}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100';

export const invalidInputClass =
  'w-full rounded-xl border border-red-500 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all focus:ring-4 focus:ring-red-50';