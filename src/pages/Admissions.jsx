import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CreditCard, Send } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { submitAdmission } from '../lib/api';
import { tuition } from '../lib/seed';
import { PageHero } from '../components/ui/Section';

const GRADES = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

const EMPTY = {
  studentName: '',
  grade: '',
  guardianName: '',
  guardianPhone: '',
  guardianEmail: '',
  previousSchool: '',
  lastGrade: '',
};

export default function Admissions() {
  const { t } = useI18n();
  const { notify } = useToast();
  const { admissions, payment } = t;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: null }));
  };

  const control = (key) => ({
    value: form[key],
    onChange: set(key),
    className: `w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all focus:border-blue-500 ${
      errors[key] ? 'border-red-500' : 'border-slate-200'
    }`,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.studentName.trim().length < 3) next.studentName = 'Required';
    if (!form.grade) next.grade = 'Required';
    if (form.guardianName.trim().length < 3) next.guardianName = 'Required';
    if (form.guardianPhone.replace(/\D/g, '').length < 9) next.guardianPhone = 'Invalid number';
    if (!/^\S+@\S+\.\S+$/.test(form.guardianEmail)) next.guardianEmail = 'Invalid email';
    if (form.previousSchool.trim().length < 2) next.previousSchool = 'Required';
    if (!form.lastGrade.trim()) next.lastGrade = 'Required';
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      await submitAdmission(form);
      notify(admissions.success);
      setDone(true);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <div className="min-h-[60vh] bg-white">
      <PageHero
        tone="light"
        eyebrow={t.nav.admissions}
        title={admissions.title}
        subtitle={admissions.subtitle}
      />

      <div className="container mx-auto px-6">
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            {done ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-slate-900">{admissions.success}</h2>
                <p className="mb-8 text-slate-600">{admissions.successMsg}</p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY);
                    setDone(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {admissions.submitAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900">{admissions.formTitle}</h2>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">
                    {admissions.formSectionStudent}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-slate-700">
                        {admissions.studentName}
                      </label>
                      <input placeholder={admissions.placeholderName} {...control('studentName')} />
                      {errors.studentName && (
                        <p className="ml-1 text-[10px] font-bold text-red-500">
                          {errors.studentName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-slate-700">
                        {admissions.gradeApplying}
                      </label>
                      <select {...control('grade')}>
                        <option value="">{admissions.placeholderGrade}</option>
                        {GRADES.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                      {errors.grade && (
                        <p className="ml-1 text-[10px] font-bold text-red-500">{errors.grade}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">
                    {admissions.formSectionGuardian}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-slate-700">
                        {admissions.guardianName}
                      </label>
                      <input placeholder={admissions.placeholderGuardian} {...control('guardianName')} />
                      {errors.guardianName && (
                        <p className="ml-1 text-[10px] font-bold text-red-500">
                          {errors.guardianName}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-slate-700">
                          {admissions.guardianPhone}
                        </label>
                        <input placeholder={admissions.placeholderPhone} {...control('guardianPhone')} />
                        {errors.guardianPhone && (
                          <p className="ml-1 text-[10px] font-bold text-red-500">
                            {errors.guardianPhone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-slate-700">
                          {admissions.guardianEmail}
                        </label>
                        <input placeholder={admissions.placeholderEmail} {...control('guardianEmail')} />
                        {errors.guardianEmail && (
                          <p className="ml-1 text-[10px] font-bold text-red-500">
                            {errors.guardianEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">
                    {admissions.formSectionAcademic}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-slate-700">
                        {admissions.previousSchool}
                      </label>
                      <input placeholder={admissions.placeholderSchool} {...control('previousSchool')} />
                      {errors.previousSchool && (
                        <p className="ml-1 text-[10px] font-bold text-red-500">
                          {errors.previousSchool}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-slate-700">
                        {admissions.lastGrade}
                      </label>
                      <input placeholder={admissions.placeholderLastGrade} {...control('lastGrade')} />
                      {errors.lastGrade && (
                        <p className="ml-1 text-[10px] font-bold text-red-500">{errors.lastGrade}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
                >
                  {admissions.submit}
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-8">
              <h3 className="mb-6 text-xl font-bold text-slate-900">{payment.title}</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p className="font-bold text-slate-900">{payment.bankName}</p>
                <p className="font-mono">{payment.accountNumber}</p>
                <p>{payment.accountHolder}</p>
              </div>

              <div className="my-6 h-px w-full bg-slate-200" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{payment.tuitionFee}</span>
                  <span className="font-bold text-slate-900">
                    {tuition.tuition} {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{payment.registrationFee}</span>
                  <span className="font-bold text-slate-900">
                    {tuition.registration} {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                  <span className="font-bold text-slate-900">{payment.totalAmount}</span>
                  <span className="font-black text-blue-600">
                    {tuition.tuition + tuition.registration} {payment.currency}
                  </span>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-slate-500">
                {payment.paymentInstructions}
              </p>

              <button
                type="button"
                onClick={() => notify(payment.payNow, 'info')}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
              >
                <CreditCard className="h-5 w-5" />
                {payment.payNow}
              </button>
            </div>

            <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-200">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">{payment.uploadReceipt}</h3>
                <Send className="h-5 w-5" />
              </div>
              <p className="text-sm text-blue-100">
                Upload receipts from your portal dashboard after transferring the fees.
              </p>
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-1 gap-8 py-24 md:grid-cols-4">
          <AnimatePresence>
            {admissions.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <span className="mb-4 block text-4xl font-black text-blue-100">{step.step}</span>
                <h4 className="mb-2 font-bold text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}