import { useMemo, useState } from 'react';
import {
  Eye,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useStudents } from '../../../hooks/useData';
import { createStudent, createMessage, deleteStudent, saveStudent } from '../../../lib/api';
import { Avatar, Badge, EmptyState, Field, SectionCard, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import IdCardModal from '../../../components/dashboard/IdCardModal';
import MessageComposer from './MessageComposer';

const EMPTY = {
  name: '',
  grade: 'Grade 9',
  studentId: '',
  email: '',
  photo: '',
};

const GRADES = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export default function StudentsManager({ isDirector = true }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const { dashboard } = t;
  const students = useStudents();
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState('all');
  const [sort, setSort] = useState('id-asc');
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [messaging, setMessaging] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const grades = useMemo(
    () => [...new Set([...students.map((student) => student.grade), ...GRADES])].sort(),
    [students],
  );

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = students.filter((student) => {
      const matchesGrade = grade === 'all' || student.grade === grade;
      const matchesQuery =
        !needle ||
        [student.name, student.studentId, student.email]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      return matchesGrade && matchesQuery;
    });

    const [key, direction] = sort.split('-');
    return [...filtered].sort((a, b) => {
      const left = String(key === 'grade' ? a.grade : a.studentId);
      const right = String(key === 'grade' ? b.grade : b.studentId);
      return left.localeCompare(right) * (direction === 'desc' ? -1 : 1);
    });
  }, [students, query, grade, sort]);

  const remove = async () => {
    try {
      await deleteStudent(confirm.id);
      notify(`${confirm.name} was removed.`);
      setConfirm(null);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <SectionCard
      title={dashboard.studentManagement}
      description={dashboard.studentManagementDesc}
      action={
        isDirector ? (
          <button
            type="button"
            onClick={() => setEditing(EMPTY)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {dashboard.addStudent}
          </button>
        ) : null
      }
    >
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dashboard.searchPlaceholder}
            className={`${inputClass} pl-11`}
          />
        </div>

        <select
          value={grade}
          onChange={(event) => setGrade(event.target.value)}
          className={`${inputClass} lg:w-48`}
        >
          <option value="all">{dashboard.filterAll}</option>
          {grades.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label={dashboard.sortLabel}
          className={`${inputClass} lg:w-52`}
        >
          <option value="id-asc">{dashboard.sortAsc}</option>
          <option value="id-desc">{dashboard.sortDesc}</option>
          <option value="grade-asc">{dashboard.sortGradeAsc}</option>
          <option value="grade-desc">{dashboard.sortGradeDesc}</option>
        </select>
      </div>

      {rows.length ? (
        <div className="-mx-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-8 py-4">{dashboard.tableStudent}</th>
                <th className="px-4 py-4">{dashboard.tableGrade}</th>
                <th className="px-4 py-4">{dashboard.tableId}</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">GPA</th>
                <th className="px-8 py-4 text-right">{dashboard.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={student.photo} name={student.name} size="h-10 w-10" rounded="rounded-xl" />
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-400">Enrolled {student.enrollmentDate ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone="blue">{student.grade}</Badge>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">{student.studentId}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{student.email}</td>
                  <td className="px-4 py-4 font-bold text-slate-700">{student.gpa ?? '—'}</td>
                  <td className="px-8 py-4">
                    <div className="flex justify-end gap-2">
                      <IconAction
                        icon={Mail}
                        label={dashboard.sendMessage}
                        onClick={() => setMessaging(student)}
                      />
                      <IconAction icon={Eye} label="View" onClick={() => setViewing(student)} />
                      {isDirector && (
                        <>
                          <IconAction
                            icon={Pencil}
                            label="Edit"
                            onClick={() => setEditing(student)}
                          />
                          <IconAction
                            icon={Trash2}
                            label="Delete"
                            tone="danger"
                            onClick={() => setConfirm(student)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Users} title={dashboard.noStudents} />
      )}

      <StudentFormModal
        open={Boolean(editing)}
        student={editing}
        onClose={() => setEditing(null)}
      />
      <IdCardModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        student={viewing}
        isDirector={isDirector}
      />
      <MessageComposer
        open={Boolean(messaging)}
        onClose={() => setMessaging(null)}
        title={dashboard.sendMessage}
        categories={[dashboard.categoryAcademic, dashboard.categoryBehavior, dashboard.categoryGeneral, dashboard.categoryUrgent]}
        submit={async ({ category, subject, message }) => {
          await createMessage({
            studentId: messaging.studentId,
            fromRole: 'director',
            category,
            subject,
            message,
          });
          notify(`${dashboard.messages} → ${messaging.name}`);
        }}
      />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={`Delete ${confirm?.name ?? ''}?`}
        message="This permanently removes the student profile, grades, attendance and payment history."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={remove}
        onCancel={() => setConfirm(null)}
      />
    </SectionCard>
  );
}

function IconAction({ icon: Icon, label, onClick, tone = 'default' }) {
  const tones = {
    default: 'text-slate-400 hover:bg-blue-50 hover:text-blue-600',
    danger: 'text-slate-400 hover:bg-red-50 hover:text-red-600',
  };
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${tones[tone]}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function StudentFormModal({ open, student, onClose }) {
  const { notify } = useToast();
  const { dashboard } = useI18n();
  const [form, setForm] = useState(student ?? EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const key = student?.id ?? 'new';
  const [lastKey, setLastKey] = useState(key);
  if (open && key !== lastKey) {
    setLastKey(key);
    setForm(student ?? EMPTY);
    setErrors({});
  }

  const set = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: null }));
  };

  const submit = async () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Enter the full name.';
    if (!/^AGS-\d{4}$/.test(form.studentId.trim())) next.studentId = 'Format: AGS-1001';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (form.photo && !/^https?:\/\//.test(form.photo)) next.photo = 'Enter a valid image URL.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (student?.id) {
        await saveStudent(student.id, form);
        notify(`${form.name} updated.`);
      } else {
        await createStudent({
          ...form,
          gpa: Number(form.gpa) || 0,
          attendance: Number(form.attendance) || 100,
        });
        notify(`${form.name} enrolled.`);
      }
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        {student?.id ? 'Edit Student' : dashboard.addStudent}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name} className="sm:col-span-2">
          <input className={inputClass} value={form.name ?? ''} onChange={set('name')} />
        </Field>
        <Field label="Student ID" error={errors.studentId} hint="AGS-1001">
          <input className={inputClass} value={form.studentId ?? ''} onChange={set('studentId')} />
        </Field>
        <Field label="Grade">
          <select className={inputClass} value={form.grade ?? 'Grade 9'} onChange={set('grade')}>
            {GRADES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Email" error={errors.email}>
          <input className={inputClass} value={form.email ?? ''} onChange={set('email')} />
        </Field>
        <Field label="Profile Photo URL" error={errors.photo} className="sm:col-span-2">
          <input className={inputClass} value={form.photo ?? ''} onChange={set('photo')} />
        </Field>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={submit}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          {student?.id ? 'Save Changes' : dashboard.addStudent}
        </button>
      </div>
    </Modal>
  );
}