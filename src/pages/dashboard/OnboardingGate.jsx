import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Primitives';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';

export default function OnboardingGate({ profile, onComplete }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    photoUrl: profile?.photo ?? '',
    role: profile?.role ?? '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const needsRole = !profile?.role;

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: null }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 3) next.name = 'Please enter your full name.';
    if (needsRole && !form.role) next.role = 'Choose the account type.';
    if (form.photoUrl && !/^https?:\/\//.test(form.photoUrl)) next.photoUrl = 'Enter a valid image URL.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await onComplete({
        name: form.name.trim(),
        photo: form.photoUrl.trim(),
        ...(needsRole ? { role: form.role } : {}),
      });
      notify(t.onboarding.submit);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open maxWidth="max-w-lg">
      <div className="text-center">
        <img src="/favicon.svg" alt="" className="mx-auto mb-6 h-14 w-14 rounded-2xl" />
        <h2 className="mb-2 text-3xl font-bold text-slate-900">{t.onboarding.title}</h2>
        <p className="mb-8 text-slate-500">{t.onboarding.subtitle}</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.onboarding.fullName}
          </label>
          <input
            value={form.name}
            onChange={set('name')}
            placeholder={t.onboarding.placeholderName}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
              errors.name ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-200'
            }`}
          />
          {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name}</p>}
        </div>

        {needsRole && (
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Account Type
            </label>
            <div className="flex gap-2">
              {['student', 'teacher', 'director'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, role: option }))}
                  className={`flex-1 rounded-xl border py-3 text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                    form.role === option
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.role && <p className="text-[10px] font-bold text-red-500">{errors.role}</p>}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.onboarding.photoUrl}
          </label>
          <input
            value={form.photoUrl}
            onChange={set('photoUrl')}
            placeholder={t.onboarding.placeholderPhoto}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
              errors.photoUrl ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-200'
            }`}
          />
          {errors.photoUrl && <p className="text-[10px] font-bold text-red-500">{errors.photoUrl}</p>}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50"
        >
          {busy && <Spinner />}
          {t.onboarding.submit}
        </button>
      </form>
    </Modal>
  );
}