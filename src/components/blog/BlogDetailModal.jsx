import { CalendarDays } from 'lucide-react';
import Modal from '../ui/Modal';
import { useI18n } from '../../context/I18nContext';

export default function BlogDetailModal({ post, onClose }) {
  const { t } = useI18n();

  return (
    <Modal open={Boolean(post)} onClose={onClose} maxWidth="max-w-3xl">
      {post && (
        <article>
          {post.image && (
            <div className="mb-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <img src={post.image} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-blue-600">
            {post.category ?? 'General'}
          </span>
          <h3 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">{post.title}</h3>
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="whitespace-pre-line text-lg leading-relaxed text-slate-600">{post.content}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-10 w-full rounded-xl bg-slate-100 py-4 font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            {t.common.close}
          </button>
        </article>
      )}
    </Modal>
  );
}