import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { aboutImages } from '../lib/seed';
import { PageHero } from '../components/ui/Section';

const CONTACT_CARDS = [
  { key: 'addressTitle', icon: MapPin, tone: 'bg-blue-100 text-blue-600', valueKey: 'addressValue' },
  { key: 'phoneTitle', icon: Phone, tone: 'bg-emerald-100 text-emerald-600', valueKey: 'phoneValue' },
  { key: 'emailTitle', icon: Mail, tone: 'bg-purple-100 text-purple-600', valueKey: 'emailValue' },
  { key: 'hoursTitle', icon: Clock, tone: 'bg-amber-100 text-amber-600', valueKey: 'hoursValue' },
];

export default function Contact() {
  const { t } = useI18n();
  const { contactPage } = t;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const field = (key) => ({
    value: form[key],
    onChange: (event) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: null }));
    },
    className: `w-full rounded-xl border bg-slate-50 px-4 py-4 text-sm outline-none transition-all ${
      errors[key]
        ? 'border-red-300 ring-4 ring-red-50'
        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
    }`,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (form.subject.trim().length < 2) next.subject = 'Please add a subject.';
    if (form.message.trim().length < 10) next.message = 'Tell us a little more (10+ characters).';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHero
        eyebrow={t.nav.contact}
        title={contactPage.heroTitle}
        subtitle={contactPage.heroSubtitle}
      />

      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900">{contactPage.infoTitle}</h2>
            <p className="mb-8 text-slate-600">{contactPage.infoSubtitle}</p>

            <div className="grid gap-8 sm:grid-cols-2">
              {CONTACT_CARDS.map((card) => (
                <div
                  key={card.key}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-bold text-slate-900">{contactPage[card.key]}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{contactPage[card.valueKey]}</p>
                </div>
              ))}
            </div>

            <div className="group relative mt-8 h-80 overflow-hidden rounded-3xl border border-slate-200 shadow-inner">
              <img
                src={aboutImages.map}
                alt=""
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-blue-600/10" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {contactPage.addressTitle}
                    </p>
                    <p className="text-sm font-bold text-slate-900">{contactPage.addressValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-50 opacity-50" />
            <div className="relative z-10">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">{contactPage.formTitle}</h2>
              <p className="mb-10 text-slate-500">{contactPage.formSubtitle}</p>

              {sent ? (
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-emerald-900">{contactPage.successTitle}</h3>
                  <p className="text-emerald-700">{contactPage.successMessage}</p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 font-bold text-emerald-600 hover:underline"
                  >
                    {t.common.send} →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-bold text-slate-700">
                        {contactPage.nameLabel}
                      </label>
                      <input placeholder="Abel Tesfaye" {...field('name')} />
                      {errors.name && (
                        <p className="ml-1 text-xs font-medium text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-bold text-slate-700">
                        {contactPage.emailLabel}
                      </label>
                      <input type="email" placeholder="you@example.com" {...field('email')} />
                      {errors.email && (
                        <p className="ml-1 text-xs font-medium text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">
                      {contactPage.subjectLabel}
                    </label>
                    <input placeholder="Admissions enquiry" {...field('subject')} />
                    {errors.subject && (
                      <p className="ml-1 text-xs font-medium text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">
                      {contactPage.messageLabel}
                    </label>
                    <textarea rows={6} placeholder="How can we help?" {...field('message')} />
                    {errors.message && (
                      <p className="ml-1 text-xs font-medium text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
                  >
                    {contactPage.submitButton}
                    <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-12">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-sm">
              <h4 className="font-bold text-slate-900">{contactPage.supportTitle}</h4>
              <p className="text-xs text-slate-500">{contactPage.supportDesc}</p>
            </div>
            <a
              href={`mailto:${contactPage.emailValue}`}
              className="ml-auto text-sm font-bold text-blue-600 hover:underline"
            >
              {contactPage.emailValue}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}