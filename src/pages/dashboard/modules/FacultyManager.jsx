import { useState } from 'react';
import { GraduationCap, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useFaculty } from '../../../hooks/useData';
import { createFacultyMember, deleteFacultyMember, saveFacultyMember } from '../../../lib/api';
import { Avatar, EmptyState, Field, SectionCard, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const EMPTY = { name: '', title: '', subject: '', teacherId: '', email: '', photo: '' };

export default function FacultyManager() {
  const { notify } = useToast();
  const { t } = useI18n();
  const faculty = useFaculty();
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  return (
    <>
      <SectionCard
        title={t.nav.faculty}
        description={`${faculty.length} staff members`}
        action={
          <button
            type="button"
            onClick={() => setEditing(EMPTY)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        }
      >
        {faculty.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => (
              <article
                key={member.id}
                className="group rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <Avatar src={member.photo} name={member.name} size="h-14 w-14" />
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => setEditing(member)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => setConfirm(member)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs text-slate-500">{member.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.subject && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {member.subject}
                    </span>
                  )}
                  {member.teacherId && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] text-slate-500">
                      {member.teacherId}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState icon={GraduationCap} title="No staff members yet" />
        )}
      </SectionCard>

      <FacultyModal open={Boolean(editing)} member={editing} onClose={() => setEditing(null)} notify={notify} />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={`Remove ${confirm?.name ?? ''}?`}
        message="This removes the staff member from the faculty directory."
        confirmLabel="Remove"
        tone="danger"
        onConfirm={async () => {
          await deleteFacultyMember(confirm.id);
          notify(`${confirm.name} removed.`);
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}

function FacultyModal({ open, member, onClose, notify }) {
  const { dashboard } = useI18n();
  const [form, setForm] = useState(member ?? EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const key = member?.id ?? 'new';
  const [lastKey, setLastKey] = useState(key);
  if (open && key !== lastKey) {
    setLastKey(key);
    setForm(member ?? EMPTY);
    setErrors({});
  }

  const set = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: null }));
  };

  const submit = async () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Enter the full name.';
    if (form.title.trim().length < 3) next.title = 'Enter a job title.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (member?.id) {
        await saveFacultyMember(member.id, form);
        notify(`${form.name} updated.`);
      } else {
        await createFacultyMember(form);
        notify(`${form.name} added to staff.`);
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
        {member?.id ? 'Edit Staff Member' : 'Add Staff Member'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name} className="sm:col-span-2">
          <input className={inputClass} value={form.name ?? ''} onChange={set('name')} />
        </Field>
        <Field label="Job Title" error={errors.title}>
          <input className={inputClass} value={form.title ?? ''} onChange={set('title')} />
        </Field>
        <Field label="Subject">
          <input className={inputClass} value={form.subject ?? ''} onChange={set('subject')} />
        </Field>
        <Field label="Employee ID" hint="AGS-STF-01">
          <input className={inputClass} value={form.teacherId ?? ''} onChange={set('teacherId')} />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={form.email ?? ''} onChange={set('email')} />
        </Field>
        <Field label={dashboard.photoUrl} className="sm:col-span-2">
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
          <Sparkles className="h-4 w-4" />
          Save
        </button>
      </div>
    </Modal>
  );
}