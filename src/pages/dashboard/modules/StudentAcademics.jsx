import { useMemo, useState } from 'react';
import { CalendarCheck, ClipboardList, TrendingUp } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { subjectColors, subjects } from '../../../lib/seed';
import { useAllAssignments, useAttendance } from '../../../hooks/useData';
import { Badge, EmptyState, SectionCard } from '../../../components/ui/Primitives';

const SUBJECT_TONES = {
  blue: 'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-50 text-slate-600',
  cyan: 'bg-cyan-50 text-cyan-700',
  orange: 'bg-orange-50 text-orange-700',
};

export function StudentGrades({ profile }) {
  const { t } = useI18n();
  const { dashboard } = t;
  const assignments = useAllAssignments(profile?.studentId ?? '');
  const [subject, setSubject] = useState('all');

  const rows = useMemo(
    () => (subject === 'all' ? assignments : assignments.filter((row) => row.subject === subject)),
    [assignments, subject],
  );

  const graded = rows.filter((row) => row.grade);
  const average = graded.length
    ? Math.round(graded.reduce((sum, row) => sum + Number(row.grade), 0) / graded.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <GradeTile
          label={dashboard.overallGrade}
          value={average ? `${average}%` : '—'}
          hint={graded.length ? `${graded.length} graded` : 'No grades yet'}
          icon={TrendingUp}
        />
        <GradeTile label={dashboard.gpa} value={profile?.gpa ?? '—'} icon={TrendingUp} tone="purple" />
        <GradeTile label={dashboard.assignments} value={rows.length} icon={ClipboardList} tone="amber" />
      </div>

      <SectionCard
        title={dashboard.currentGrades}
        description="Every graded assignment across your subjects."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubject('all')}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                subject === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              All
            </button>
            {subjects.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSubject(option)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  subject === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        }
      >
        {rows.length ? (
          <ul className="divide-y divide-slate-100">
            {rows.map((row) => (
              <li key={`${row.subject}-${row.id}`} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      SUBJECT_TONES[subjectColors[row.subject]] ?? SUBJECT_TONES.slate
                    }`}
                  >
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{row.title}</p>
                    <p className="text-xs text-slate-400">
                      {row.subject} · {dashboard.dueDate} {row.dueDate}
                    </p>
                  </div>
                </div>
                <Badge tone={row.grade ? 'emerald' : 'amber'}>
                  {row.grade ? `${row.grade} / ${row.total ?? 100}` : dashboard.status}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={ClipboardList} title="No assignments yet" />
        )}
      </SectionCard>
    </div>
  );
}

export function StudentAttendance({ profile }) {
  const { t } = useI18n();
  const records = useAttendance(profile?.studentId ?? '');
  const present = records.filter((row) => String(row.status).toLowerCase() === 'present').length;
  const rate = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <SectionCard title={t.dashboard.attendance} description={`${rate}% attendance rate`}>
      {records.length ? (
        <ul className="divide-y divide-slate-100">
          {records.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-900">{row.date}</p>
                  <p className="text-xs text-slate-400">{row.note ?? '—'}</p>
                </div>
              </div>
              <Badge tone={String(row.status).toLowerCase() === 'present' ? 'emerald' : 'red'}>
                {row.status}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={CalendarCheck} title="No attendance records" />
      )}
    </SectionCard>
  );
}

export function StudentAssignments({ profile }) {
  const { t } = useI18n();
  const { dashboard } = t;
  const assignments = useAllAssignments(profile?.studentId ?? '');
  const pending = assignments.filter((row) => !row.grade);
  const done = assignments.filter((row) => row.grade);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard
          title={dashboard.upcomingAssignments}
          description={`${pending.length} awaiting submission`}
        >
          {pending.length ? (
            <ul className="divide-y divide-slate-100">
              {pending.map((row) => (
                <li key={`${row.subject}-${row.id}`} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-bold text-slate-900">{row.title}</p>
                    <p className="text-xs text-slate-400">
                      {row.subject} · {dashboard.dueDate} {row.dueDate}
                    </p>
                  </div>
                  <Badge tone="amber">{dashboard.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={ClipboardList} title="Nothing due" subtitle="You are all caught up." />
          )}
        </SectionCard>

        <SectionCard title={dashboard.assignmentStatus} description={`${done.length} graded`}>
          {done.length ? (
            <ul className="divide-y divide-slate-100">
              {done.map((row) => (
                <li key={`${row.subject}-${row.id}`} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-bold text-slate-900">{row.title}</p>
                    <p className="text-xs text-slate-400">{row.subject}</p>
                  </div>
                  <Badge tone="emerald">
                    {row.grade} / {row.total ?? 100}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={ClipboardList} title="No grades posted yet" />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function GradeTile({ label, value, hint, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-violet-600',
    amber: 'from-amber-400 to-orange-500',
  };
  return (
    <div className={`rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg ${tones[tone]}`}>
      <Icon className="mb-6 h-6 w-6 opacity-80" />
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold opacity-90">{label}</p>
      {hint && <p className="mt-1 text-xs opacity-70">{hint}</p>}
    </div>
  );
}