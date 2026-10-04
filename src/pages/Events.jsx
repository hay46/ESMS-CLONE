import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Check, Clock, MapPin, Users, X } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  cancelEventRegistration,
  cloudEnabled,
  registerForEvent,
  watchEvents,
  watchRegistrations,
} from '../lib/api';
import { PageHero } from '../components/ui/Section';
import Modal from '../components/ui/Modal';
import { Badge, EmptyState } from '../components/ui/Primitives';

const CATEGORY_TONES = {
  Academic: 'bg-blue-100 text-blue-700',
  Sports: 'bg-emerald-100 text-emerald-700',
  Holiday: 'bg-amber-100 text-amber-700',
  Social: 'bg-purple-100 text-purple-700',
};

const LEGEND = [
  { label: 'Academic', className: 'bg-blue-500' },
  { label: 'Sports', className: 'bg-emerald-500' },
  { label: 'Social', className: 'bg-purple-500' },
  { label: 'Holiday', className: 'bg-amber-500' },
];

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export default function Events() {
  const { t } = useI18n();
  const { profile } = useAuth();
  const { notify } = useToast();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [registered, setRegistered] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => watchEvents(setEvents)(), []);

  const userId = profile?.uid ?? profile?.id ?? null;
  useEffect(() => watchRegistrations(userId, setRegistered)(userId), [userId]);

  const sorted = useMemo(
    () => [...events].sort((a, b) => String(a.date).localeCompare(String(b.date))),
    [events],
  );

  const toggle = async (event) => {
    if (!profile) {
      notify('Sign in to register for events.', 'info');
      return;
    }
    setBusy(true);
    try {
      const isRegistered = registered.includes(event.id);
      if (isRegistered) {
        await cancelEventRegistration(userId, event.id);
      } else {
        await registerForEvent(userId, event.id);
      }
      notify(isRegistered ? t.eventModal.unregister : t.eventModal.success);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-slate-50">
      <PageHero
        tone="light"
        eyebrow={t.nav.events}
        title={t.nav.events}
        subtitle="Sports days, science fairs, cultural celebrations and everything in between."
      />

      <div className="container mx-auto max-w-5xl px-6">
        <div className="py-24">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-slate-900">Upcoming Events</h3>
            <div className="h-1 w-20 rounded-full bg-blue-600" />
          </div>

          {sorted.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No events scheduled" subtitle="Check back soon." />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {sorted.map((event) => {
                const isRegistered = registered.includes(event.id);
                return (
                  <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          CATEGORY_TONES[event.category] ?? CATEGORY_TONES.Academic
                        }`}
                      >
                        {event.category}
                      </span>
                      {isRegistered && (
                        <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                          <Check className="h-3 w-3" />
                          Registered
                        </span>
                      )}
                    </div>

                    <h4 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                      {event.title}
                    </h4>

                    <div className="mb-6 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        {formatDate(event.date)}
                      </div>
                      {event.time && event.time !== '00:00' && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4 text-blue-600" />
                          {event.time}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {event.location}
                      </div>
                    </div>

                    <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-slate-600">
                      {event.description}
                    </p>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelected(event)}
                        className="flex-1 rounded-xl bg-slate-50 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        {t.common.readMore}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(event);
                          toggle(event);
                        }}
                        disabled={busy}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                          isRegistered
                            ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700'
                        }`}
                      >
                        {isRegistered ? 'Registered' : 'Register'}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {LEGEND.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${item.className}`} />
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="max-w-2xl">
        {selected && (
          <div>
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    CATEGORY_TONES[selected.category] ?? CATEGORY_TONES.Academic
                  }`}
                >
                  {selected.category}
                </span>
                {registered.includes(selected.id) && (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <Check className="h-3 w-3" />
                    Confirmed
                  </span>
                )}
              </div>

              <h2 className="mb-4 text-3xl font-bold text-slate-900">{selected.title}</h2>

              <div className="space-y-3">
                {[
                  { icon: CalendarDays, value: formatDate(selected.date) },
                  { icon: Clock, value: selected.time },
                  { icon: MapPin, value: selected.location },
                  { icon: Users, value: t.eventModal.registeredStudents },
                ].map((row) => (
                  <div key={row.value} className="flex items-center gap-3 text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <row.icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8 mt-8 h-px w-full bg-slate-100" />
              <p className="leading-relaxed text-slate-600">{selected.description}</p>
            </div>

            <div className="mt-10 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => toggle(selected)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold shadow-lg transition-all ${
                  registered.includes(selected.id)
                    ? 'border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-none'
                    : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                }`}
              >
                {registered.includes(selected.id) ? (
                  <>
                    <X className="h-5 w-5" />
                    {t.eventModal.unregister}
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    {t.eventModal.register}
                  </>
                )}
              </button>

              {!cloudEnabled && (
                <p className="text-center text-xs text-slate-400">
                  Registrations are stored locally in demo mode.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export { Badge };