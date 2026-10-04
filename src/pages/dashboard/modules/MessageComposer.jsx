import { useState } from 'react';
import { Send } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import { Field, inputClass } from '../../../components/ui/Primitives';

export default function MessageComposer({
  open,
  onClose,
  title = 'Send Message',
  categories = ['General'],
  submit,
}) {
  const [form, setForm] = useState({ category: categories[0], subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: null }));
  };

  const send = async () => {
    const next = {};
    if (form.subject.trim().length < 3) next.subject = 'Add a subject.';
    if (form.message.trim().length < 5) next.message = 'Write a message.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await submit?.(form);
      setForm({ category: categories[0], subject: '', message: '' });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-xl">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>

      <div className="space-y-4">
        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setForm((current) => ({ ...current, category }))}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  form.category === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Subject" error={errors.subject}>
          <input className={inputClass} value={form.subject} onChange={set('subject')} />
        </Field>

        <Field label="Message" error={errors.message}>
          <textarea rows={5} className={inputClass} value={form.message} onChange={set('message')} />
        </Field>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={send}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        Send
      </button>
    </Modal>
  );
}