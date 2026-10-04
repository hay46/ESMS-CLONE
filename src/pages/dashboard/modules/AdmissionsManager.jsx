import { useState } from 'react';
import { CheckCircle2, Eye, GraduationCap, XCircle } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useAdmissions } from '../../../hooks/useData';
import { saveAdmission } from '../../../lib/api';
import { Badge, EmptyState, Field, SectionCard, StatusBadge, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';

export default function AdmissionsManager() {
  const { t } = useI18n();
  const { notify } = useToast();
  const applications = useAdmissions();
  const [viewing, setViewing] = useState(null);
  const [status, setStatus] = useState({});

  const pending = applications.filter((row) => row.status === 'Pending').length;

  const update = async (application, nextStatus) => {
    try {
      await saveAdmission(application.id, {
        status: nextStatus,
        reviewedAt: new Date().toISOString().slice(0, 10),
        note: status[application.id] ?? application.note ?? '',
      });
      notify(`${application.studentName} → ${nextStatus}`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return (
    <>
      <SectionCard
        title={t.nav.admissions}
        description={`${applications.length} applications · ${pending} pending review`}
      >
        {applications.length ? (
          <div className="-mx-8 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-8 py-4">Applicant</th>
                  <th className="px-4 py-4">Grade</th>
                  <th className="px-4 py-4">Guardian</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-900">{row.studentName}</p>
                      <p className="text-xs text-slate-400">{row.previousSchool}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone="blue">{row.grade}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-slate-700">{row.guardianName}</p>
                      <p className="text-xs text-slate-400">{row.guardianPhone}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">{row.submittedAt}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label="View"
                          onClick={() => setViewing(row)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Approve"
                          onClick={() => update(row, 'Approved')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Reject"
                          onClick={() => update(row, 'Rejected')}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={GraduationCap} title="No applications yet" />
        )}
      </SectionCard>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        maxWidth="max-w-2xl"
      >
        {viewing && (
          <>
            <h2 className="mb-1 text-2xl font-bold text-slate-900">{viewing.studentName}</h2>
            <p className="text-sm text-slate-500">
              {viewing.grade} · submitted {viewing.submittedAt}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <Detail label="Guardian" value={viewing.guardianName} />
              <Detail label="Phone" value={viewing.guardianPhone} />
              <Detail label="Email" value={viewing.guardianEmail} />
              <Detail label="Previous School" value={viewing.previousSchool} />
              <Detail label="Last Grade" value={viewing.lastGrade} />
              <Detail label="Status" value={<StatusBadge status={viewing.status} />} />
            </dl>

            <div className="mt-8">
              <Field label="Review note">
                <textarea
                  rows={4}
                  className={inputClass}
                  value={status[viewing.id] ?? viewing.note ?? ''}
                  onChange={(event) =>
                    setStatus((current) => ({ ...current, [viewing.id]: event.target.value }))
                  }
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => update(viewing, 'Rejected')}
                className="flex-1 rounded-xl bg-red-50 py-3 font-bold text-red-600 hover:bg-red-100"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => update(viewing, 'Approved')}
                className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
              >
                Approve
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-slate-800">{value}</dd>
    </div>
  );
}