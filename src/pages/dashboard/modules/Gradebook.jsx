import { useMemo, useState } from 'react';
import { ClipboardList, Plus, Save, TrendingUp, Users } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { subjectColors, subjects } from '../../../lib/seed';
import {
  createAssignment,
  gradeAssignment,
  setGradeSummary,
} from '../../../lib/api';
import { useAssignments, useStudents } from '../../../hooks/useData';
import { Badge, EmptyState, Field, SectionCard, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';

const SUBJECT_TONES = {
  blue: 'bg-blue-100 text-blue-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  violet: 'bg-violet-100 text-violet-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  orange: 'bg-orange-100 text-orange-600',
};

export default function Gradebook({ profile }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const { dashboard } = t;
  const students = useStudents();
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState(subjects[0]);
  const [adding, setAdding] = useState(false);
  const [grading, setGrading] = useState(null);
  const [summary, setSummary] = useState({ overallGrade: '', attendance: '', status: '' });

  const activeStudentId = studentId || students[0]?.studentId || '';
  const student = useMemo(
    () => students.find((row) => row.studentId === activeStudentId) ?? null,
    [students, activeStudentId],
  );
  const assignments = useAssignments(activeStudentId, subject);

  const graded = assignments.filter((row) => row.grade);
  const average = graded.length
    ? Math.round(graded.reduce((sum, row) => sum + Number(row.grade), 0) / graded.length)
    : 0;

  const saveSummary = async () => {
    try {
      await setGradeSummary(activeStudentId, subject, {
        overallGrade: summary.overallGrade || average || '—',
        attendance: summary.attendance || student?.attendance || '',
        status: summary.status || 'On Track',
        updatedAt: new Date().toISOString(),
      });
      notify(`${dashboard.gradePosted}`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      <SectionCard title={dashboard.gradebook} description="Post assignment grades and subject summaries.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Student">
            <select
              className={inputClass}
              value={activeStudentId}
              onChange={(event) => setStudentId(event.target.value)}
            >
              {students.map((row) => (
                <option key={row.id} value={row.studentId}>
                  {row.name} — {row.studentId}
                </option>
              ))}
            </select>
          </Field>

          <Field label={dashboard.subject}>
            <select
              className={inputClass}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              {subjects.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        {student && (
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <Field label={dashboard.overallGrade} hint="A, B+, 88…">
              <input
                className={inputClass}
                value={summary.overallGrade}
                onChange={(event) => setSummary((current) => ({ ...current, overallGrade: event.target.value }))}
              />
            </Field>
            <Field label={dashboard.attendance} hint={`${student.attendance ?? 0}% recorded`}>
              <input
                className={inputClass}
                value={summary.attendance}
                onChange={(event) => setSummary((current) => ({ ...current, attendance: event.target.value }))}
              />
            </Field>
            <Field label={dashboard.status} hint="On Track / Needs Support">
              <input
                className={inputClass}
                value={summary.status}
                onChange={(event) => setSummary((current) => ({ ...current, status: event.target.value }))}
              />
            </Field>
            <SummaryTile label={dashboard.gpa} value={student.gpa ?? '—'} tone="purple" />
          </div>
        )}
      </SectionCard>

      <SectionCard
        title={dashboard.assignmentStatus}
        description={`${subject} · ${assignments.length} assignments`}
        action={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={saveSummary}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              <Save className="h-4 w-4" />
              Save summary
            </button>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {dashboard.addNewAssignment}
            </button>
          </div>
        }
      >
        {assignments.length ? (
          <ul className="divide-y divide-slate-100">
            {assignments.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${SUBJECT_TONES[subjectColors[subject]] ?? SUBJECT_TONES.slate}`}>
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{row.title}</p>
                    <p className="text-xs text-slate-400">
                      Due {row.dueDate} · {dashboard.total} {row.total}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge tone={row.grade ? 'emerald' : 'amber'}>{row.grade ?? 'Pending'}</Badge>
                  <button
                    type="button"
                    onClick={() => setGrading(row)}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100"
                  >
                    {row.grade ? 'Edit' : dashboard.postGrade}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No assignments yet"
            subtitle={`Add the first ${subject} assignment for ${student?.name ?? 'this student'}.`}
          />
        )}
      </SectionCard>

      <SectionCard title={profile?.role === 'teacher' ? 'My Students' : 'Class Roster'} description="Tap a student to open their gradebook.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setStudentId(row.studentId)}
              className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                row.studentId === activeStudentId
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-100 bg-white hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-slate-300" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.grade}</p>
                </div>
              </div>
              <span className="text-sm font-black text-slate-700">{row.gpa ?? '—'}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <AssignmentModal
        open={adding}
        onClose={() => setAdding(false)}
        studentId={activeStudentId}
        subject={subject}
      />

      <GradeModal
        open={Boolean(grading)}
        assignment={grading}
        onClose={() => setGrading(null)}
        onSave={async (grade) => {
          await gradeAssignment(activeStudentId, subject, grading.id, { grade, gradedAt: new Date().toISOString() });
          notify(dashboard.gradePosted);
        }}
      />
    </div>
  );
}

function SummaryTile({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    purple: 'bg-purple-50 text-purple-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className={`rounded-2xl p-5 ${tones[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function AssignmentModal({ open, onClose, studentId, subject }) {
  const { notify } = useToast();
  const { dashboard } = useI18n();
  const [form, setForm] = useState({ title: '', dueDate: '', total: 100 });
  const [busy, setBusy] = useState(false);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = async () => {
    if (form.title.trim().length < 3) return;
    setBusy(true);
    try {
      await createAssignment(studentId, subject, {
        ...form,
        total: Number(form.total) || 100,
        subject,
        grade: '',
      });
      notify(`${dashboard.addNewAssignment} ✓`);
      setForm({ title: '', dueDate: '', total: 100 });
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{dashboard.addNewAssignment}</h2>
      <div className="space-y-4">
        <Field label={dashboard.assignmentTitle}>
          <input className={inputClass} value={form.title} onChange={set('title')} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={dashboard.dueDate}>
            <input type="date" className={inputClass} value={form.dueDate} onChange={set('dueDate')} />
          </Field>
          <Field label={dashboard.total}>
            <input type="number" className={inputClass} value={form.total} onChange={set('total')} />
          </Field>
        </div>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={save}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        {dashboard.addNewAssignment}
      </button>
    </Modal>
  );
}

function GradeModal({ open, assignment, onClose, onSave }) {
  const { dashboard } = useI18n();
  const [grade, setGrade] = useState('');

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <h2 className="text-2xl font-bold text-slate-900">{assignment?.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{dashboard.postGrade}</p>

      <div className="mt-6">
        <Field label={dashboard.score} hint={`${dashboard.total}: ${assignment?.total ?? 100}`}>
          <input
            className={inputClass}
            value={assignment?.grade ?? grade}
            onChange={(event) => setGrade(event.target.value)}
            placeholder="88"
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={async () => {
          await onSave(grade === '' ? assignment.grade : grade);
          onClose();
        }}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
      >
        <TrendingUp className="h-4 w-4" />
        {dashboard.postGrade}
      </button>
    </Modal>
  );
}