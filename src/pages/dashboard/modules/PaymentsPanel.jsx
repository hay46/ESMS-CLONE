import { useMemo, useState } from 'react';
import { Building2, CreditCard, Landmark, Receipt, Upload } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { usePayments, useReceipts, useStudents } from '../../../hooks/useData';
import { createPayment, createReceipt } from '../../../lib/api';
import { tuition } from '../../../lib/seed';
import { Avatar, Badge, EmptyState, Field, SectionCard, StatusBadge, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';

const total = tuition.tuition + tuition.registration;

export default function PaymentsPanel({ profile, role }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const { payment } = t;
  const students = useStudents();
  const studentId = profile?.studentId ?? '';
  const payments = usePayments(studentId);
  const receipts = useReceipts(studentId);
  const [paying, setPaying] = useState(false);
  const [uploading, setUploading] = useState(false);

  const paid = useMemo(
    () => payments.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [payments],
  );
  const outstanding = Math.max(total - paid, 0);

  if (role !== 'student') {
    return <DirectorPayments students={students} />;
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title={payment.title} description={payment.subtitle} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Tile label={payment.tuitionFee} value={`${tuition.tuition} ${payment.currency}`} tone="blue" />
            <Tile label={payment.registrationFee} value={`${tuition.registration} ${payment.currency}`} tone="purple" />
            <Tile label={payment.totalAmount} value={`${total} ${payment.currency}`} tone="amber" />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-700">Paid to date</span>
              <span className="font-black text-emerald-600">
                {paid} {payment.currency}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                style={{ width: `${Math.min((paid / total) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Outstanding balance:{' '}
              <span className="font-bold text-slate-800">
                {outstanding} {payment.currency}
              </span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setPaying(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <CreditCard className="h-5 w-5" />
              {payment.payNow}
            </button>
            <button
              type="button"
              onClick={() => setUploading(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-4 font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              <Upload className="h-5 w-5" />
              {payment.uploadReceipt}
            </button>
          </div>
        </SectionCard>

        <SectionCard title={payment.accountInfo}>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Landmark className="mt-0.5 h-4 w-4 text-blue-600" />
              <span className="font-bold text-slate-800">{payment.bankName}</span>
            </li>
            <li className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 text-blue-600" />
              <span className="font-mono text-slate-600">{payment.accountNumber}</span>
            </li>
          </ul>
          <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
            {payment.paymentInstructions}
          </p>
        </SectionCard>
      </div>

      <SectionCard className="mt-8" title="Payment History">
        {payments.length ? (
          <ul className="divide-y divide-slate-100">
            {payments.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold text-slate-900">{row.description ?? t.payment.tuitionFee}</p>
                  <p className="text-xs text-slate-400">
                    {row.date} · {row.method ?? 'Bank transfer'}
                  </p>
                </div>
                <span className="font-black text-emerald-600">
                  {row.amount} {payment.currency}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Receipt} title="No payments recorded" />
        )}
      </SectionCard>

      <SectionCard className="mt-8" title={payment.uploadReceipt}>
        {receipts.length ? (
          <ul className="divide-y divide-slate-100">
            {receipts.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold text-slate-900">{row.fileName ?? 'Receipt'}</p>
                  <p className="text-xs text-slate-400">
                    {row.date} · {row.amount} {payment.currency}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Upload} title="No receipts uploaded" subtitle={payment.paymentInstructions} />
        )}
      </SectionCard>

      <PayModal open={paying} onClose={() => setPaying(false)} studentId={studentId} />
      <ReceiptModal open={uploading} onClose={() => setUploading(false)} studentId={studentId} notify={notify} />
    </>
  );
}

function DirectorPayments({ students }) {
  const { t } = useI18n();
  return (
    <SectionCard
      title={t.payment.title}
      description="Fee status per student for the current academic year."
    >
      {students.length ? (
        <div className="-mx-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-8 py-4">Student</th>
                <th className="px-4 py-4">Grade</th>
                <th className="px-4 py-4">{t.dashboard.tableId}</th>
                <th className="px-8 py-4 text-right">Annual Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={student.photo} name={student.name} size="h-10 w-10" rounded="rounded-xl" />
                      <p className="font-bold text-slate-900">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone="blue">{student.grade}</Badge>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">{student.studentId}</td>
                  <td className="px-8 py-4 text-right font-black text-slate-800">
                    {total} {t.payment.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={CreditCard} title={t.dashboard.noStudents} />
      )}
    </SectionCard>
  );
}

function Tile({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <div className={`rounded-2xl p-5 ${tones[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

function PayModal({ open, onClose, studentId }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const [form, setForm] = useState({ amount: total, method: 'Bank transfer', description: '' });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!studentId) return;
    setBusy(true);
    try {
      await createPayment(studentId, {
        amount: Number(form.amount) || 0,
        method: form.method,
        description: form.description || t.payment.tuitionFee,
      });
      notify(`${t.payment.payNow} ✓`);
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{t.payment.payNow}</h2>
      <div className="space-y-4">
        <Field label={`${t.payment.price} (${t.payment.currency})`}>
          <input
            type="number"
            className={inputClass}
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </Field>
        <Field label="Payment method">
          <select
            className={inputClass}
            value={form.method}
            onChange={(event) => setForm({ ...form, method: event.target.value })}
          >
            <option>Bank transfer</option>
            <option>Mobile money</option>
            <option>Cash</option>
          </select>
        </Field>
        <Field label="Note">
          <input
            className={inputClass}
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </Field>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
      >
        <CreditCard className="h-4 w-4" />
        Record payment
      </button>
    </Modal>
  );
}

function ReceiptModal({ open, onClose, studentId, notify }) {
  const { t } = useI18n();
  const [form, setForm] = useState({ fileName: '', amount: total });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!studentId) return;
    setBusy(true);
    try {
      await createReceipt(studentId, {
        fileName: form.fileName || 'receipt.pdf',
        amount: Number(form.amount) || 0,
      });
      notify(`${t.payment.uploadReceipt} ✓`);
      setForm({ fileName: '', amount: total });
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{t.payment.uploadReceipt}</h2>
      <div className="space-y-4">
        <Field label="Receipt reference" hint="e.g. CBE-TRX-99201">
          <input
            className={inputClass}
            value={form.fileName}
            onChange={(event) => setForm({ ...form, fileName: event.target.value })}
          />
        </Field>
        <Field label={`${t.payment.price} (${t.payment.currency})`}>
          <input
            type="number"
            className={inputClass}
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </Field>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
      >
        <Upload className="h-4 w-4" />
        {t.payment.uploadReceipt}
      </button>
    </Modal>
  );
}