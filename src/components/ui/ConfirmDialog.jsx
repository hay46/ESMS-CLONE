import { useState } from 'react';
import Modal from '../../components/ui/Modal';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel,
}) {
  const [busy, setBusy] = useState(false);

  const tones = {
    primary: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  };

  return (
    <Modal open={open} onClose={onCancel} maxWidth="max-w-md">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mb-8 text-slate-500">{message}</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-700 transition-all hover:bg-slate-200"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm?.();
            } finally {
              setBusy(false);
            }
          }}
          className={`flex-1 rounded-xl px-4 py-3 font-bold text-white shadow-lg transition-all ${tones[tone]}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}