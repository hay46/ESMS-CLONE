import { useState } from 'react';
import { Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useBlog, useNews } from '../../../hooks/useData';
import {
  createBlogPost,
  createNewsItem,
  deleteBlogPost,
  deleteNewsItem,
  saveBlogPost,
  saveNewsItem,
} from '../../../lib/api';
import { EmptyState, Field, SectionCard, inputClass } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const TABS = [
  { id: 'blog', label: 'Blog' },
  { id: 'news', label: 'News' },
];

export default function NewsManager() {
  const { notify } = useToast();
  const { dashboard } = useI18n();
  const blog = useBlog();
  const news = useNews();
  const [tab, setTab] = useState('blog');
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const rows = tab === 'blog' ? blog : news;

  return (
    <>
      <SectionCard
        title={dashboard.schoolNews}
        description={`${rows.length} published ${rows.length === 1 ? 'post' : 'posts'}`}
        action={
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-xl bg-slate-100 p-1">
              {TABS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTab(option.id)}
                  className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    tab === option.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEditing({ type: tab, title: '', content: '' })}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {dashboard.createPost}
            </button>
          </div>
        }
      >
        {rows.length ? (
          <ul className="space-y-4">
            {rows.map((row) => (
              <li key={row.id} className="group rounded-2xl border border-slate-100 p-5 transition-all hover:border-blue-200">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900">{row.title}</h4>
                    <p className="text-xs text-slate-400">{row.date}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => setEditing({ ...row, type: tab })}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => setConfirm({ ...row, type: tab })}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-slate-500">{row.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Newspaper} title={`No ${tab} posts yet`} />
        )}
      </SectionCard>

      <PostModal open={Boolean(editing)} post={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={`Delete "${confirm?.title ?? ''}"?`}
        message="This post will be removed from the website."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={async () => {
          if (confirm.type === 'blog') await deleteBlogPost(confirm.id);
          else await deleteNewsItem(confirm.id);
          notify(`${confirm.title} deleted.`);
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}

function PostModal({ open, post, onClose }) {
  const { notify } = useToast();
  const [form, setForm] = useState(post ?? { title: '', content: '', type: 'blog' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const key = post ? `${post.type}:${post.id}` : 'new';
  const [lastKey, setLastKey] = useState(key);
  if (open && key !== lastKey) {
    setLastKey(key);
    setForm(post ?? { title: '', content: '', type: 'blog' });
    setErrors({});
  }

  const set = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: null }));
  };

  const submit = async () => {
    const next = {};
    if (form.title.trim().length < 3) next.title = 'Enter a title.';
    if (form.content.trim().length < 10) next.content = 'Write at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = { title: form.title, content: form.content };
    setBusy(true);
    try {
      if (form.id) {
        if (form.type === 'blog') await saveBlogPost(form.id, payload);
        else await saveNewsItem(form.id, payload);
        notify(`${payload.title} updated.`);
      } else {
        if (form.type === 'blog') await createBlogPost(payload);
        else await createNewsItem(payload);
        notify(`${payload.title} published.`);
      }
      onClose();
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        {form.id ? 'Edit Post' : form.type === 'blog' ? 'New Blog Post' : 'New News Item'}
      </h2>

      <div className="space-y-4">
        <Field label="Title" error={errors.title}>
          <input className={inputClass} value={form.title ?? ''} onChange={set('title')} />
        </Field>
        <Field label="Content" error={errors.content}>
          <textarea rows={7} className={inputClass} value={form.content ?? ''} onChange={set('content')} />
        </Field>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
      >
        <Newspaper className="h-4 w-4" />
        Publish
      </button>
    </Modal>
  );
}