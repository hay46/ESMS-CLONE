import { CreditCard, Download, Loader2, Printer, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Modal from '../ui/Modal';
import { saveStudent } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function IdCardModal({ student, open, onClose, isDirector }) {
  const { notify } = useToast();
  const [issuing, setIssuing] = useState(false);

  if (!student) return null;

  const issued = Boolean(student.hasIdCard);

  const issue = async () => {
    setIssuing(true);
    try {
      await saveStudent(student.id, { hasIdCard: true });
      notify('ID card issued and ready to print.');
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setIssuing(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div id="id-card-print">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 p-8 text-white shadow-2xl">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src="/favicon.svg" alt="" className="h-12 w-12 rounded-xl" />
                <div>
                  <p className="text-lg font-black leading-tight">Abune Gorgorios School</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                    Student Identity Card
                  </p>
                </div>
              </div>
              <ShieldCheck className="h-8 w-8 text-blue-400/60" />
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10">
                {student.photo ? (
                  <img src={student.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white/60">
                    {student.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="text-2xl font-black">{student.name}</p>
                <p className="mt-1 text-sm font-semibold text-blue-300">{student.grade}</p>
                <p className="mt-4 font-mono text-sm tracking-widest text-slate-300">
                  {student.studentId}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-blue-400">Issued</p>
                <p className="mt-1 font-semibold">{student.enrollmentDate ?? '—'}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-blue-400">Valid</p>
                <p className="mt-1 font-semibold">2025/2026 Academic Year</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] font-medium text-slate-400">
          This ID card is the property of Abune Gorgorios School. If found, please return to the
          school office.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {!issued && (isDirector ? (
            <button
              type="button"
              onClick={issue}
              disabled={issuing}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {issuing ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
              Issue &amp; Send ID Card
            </button>
          ) : (
            <p className="rounded-2xl bg-amber-50 px-6 py-4 text-center text-sm font-bold text-amber-700">
              Your ID card has not been issued yet. Please visit the school office.
            </p>
          ))}

          <button
            type="button"
            onClick={() => window.print()}
            disabled={!issued}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-4 font-bold text-slate-700 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {issued ? <Printer className="h-5 w-5" /> : <Download className="h-5 w-5" />}
            Print ID Card
          </button>
        </div>
      </div>
    </Modal>
  );
}