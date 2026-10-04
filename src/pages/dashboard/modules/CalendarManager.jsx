import { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useEvents } from '../../../hooks/useData';
import { createEvent, deleteEvent, saveEvent } from '../../../lib/api';
import { Badge, EmptyState, Field, SectionCard, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const EMPTY = { title: '', date: '', time: '', location: '', category: 'School Event', description: '' };

const TYPES = ['Academic', 'Sports', 'Social', 'Holiday', 'Exam Period', 'School Event'];

const TYPE_TONES = {
  Academic: 'blue',
  Sports: 'emerald',
  Social: 'purple',
  Holiday: 'amber',
  'Exam Period': 'rose',
  'School Event': 'cyan',
};

export default function CalendarManager({ canEdit = false }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const { dashboard } = t;
  const events = useEvents();
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const sorted = useMemo(
    () => [...events].sort((a, b) => String(a.date).localeCompare(String(b.date))),
    [events],
  );

  return (
    <>
      <SectionCard
        title={canEdit ? dashboard.manageCalendar : dashboard.upcomingClasses}
        description={dashboard.manageCalendarDesc}
        action={
          canEdit ? (
            <button
              type="button"
              onClick={() => setEditing(EMPTY)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {dashboard.addEvent}
            </button>
          ) : null
        }
      >
        {sorted.length ? (
          <ul className="relative space-y-4 border-l-2 border-slate-100 pl-6">
            {sorted.map((event) => (
              <li key={event.id} className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-blue-500" />
                <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-md">
                  <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{event.title}</h4>
                      <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="font-bold text-blue-600">{event.date}</span>
                        <span>{event.time}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={TYPE_TONES[event.category] ?? 'slate'}>{event.category}</Badge>
                      {canEdit && (
                        <>
                          <button
                            type="button"
                            aria-label={dashboard.editEvent}
                            onClick={() => setEditing(event)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={dashboard.deleteEvent}
                            onClick={() => setConfirm(event)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-sm leading-relaxed text-slate-500">{event.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={CalendarDays} title="No events scheduled" />
        )}
      </SectionCard>

      <EventModal open={Boolean(editing)} event={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={`Delete "${confirm?.title ?? ''}"?`}
        message="This event will be removed from the academic calendar."
        confirmLabel={dashboard.deleteEvent}
        tone="danger"
        onConfirm={async () => {
          await deleteEvent(confirm.id);
          notify(`${confirm.title} deleted.`);
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}

function EventModal({ open, event, onClose }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const { dashboard } = t;
  const [form, setForm] = useState(event ?? EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const key = event?.id ?? 'new';
  const [lastKey, setLastKey] = useState(key);
  if (open && key !== lastKey) {
    setLastKey(key);
    setForm(event ?? EMPTY);
    setErrors({});
  }

  const set = (field) => (event_) => {
    setForm((current) => ({ ...current, [field]: event_.target.value }));
    setErrors((current) => ({ ...current, [field]: null }));
  };

  const submit = async () => {
    const next = {};
    if (form.title.trim().length < 3) next.title = 'Enter a title.';
    if (!form.date) next.date = 'Pick a date.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (event?.id) {
        await saveEvent(event.id, form);
        notify(`${form.title} updated.`);
      } else {
        await createEvent(form);
        notify(`${dashboard.addEvent} ✓`);
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
        {event?.id ? dashboard.editEvent : dashboard.addEvent}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dashboard.eventTitle} error={errors.title} className="sm:col-span-2">
          <input className={inputClass} value={form.title ?? ''} onChange={set('title')} />
        </Field>
        <Field label={dashboard.eventDate} error={errors.date}>
          <input type="date" className={inputClass} value={form.date ?? ''} onChange={set('date')} />
        </Field>
        <Field label={dashboard.eventTime}>
          <input className={inputClass} value={form.time ?? ''} onChange={set('time')} />
        </Field>
        <Field label={dashboard.eventLocation}>
          <input className={inputClass} value={form.location ?? ''} onChange={set('location')} />
        </Field>
        <Field label={dashboard.eventType}>
          <select className={inputClass} value={form.category ?? 'School Event'} onChange={set('category')}>
            {TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label={dashboard.eventDescription} className="sm:col-span-2">
          <textarea rows={4} className={inputClass} value={form.description ?? ''} onChange={set('description')} />
        </Field>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
      >
        <CalendarDays className="h-4 w-4" />
        {dashboard.saveEvent}
      </button>
    </Modal>
  );
}