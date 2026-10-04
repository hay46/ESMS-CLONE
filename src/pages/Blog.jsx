import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { watchBlog } from '../lib/api';
import { PageHero } from '../components/ui/Section';
import BlogDetailModal from '../components/blog/BlogDetailModal';

const FALLBACK_POSTS = [
  {
    id: 'seed-1',
    title: 'Welcome to our new website',
    content:
      'We are excited to launch our new digital home. This platform will serve as a hub for all our school activities, news, and academic resources. Stay tuned for regular updates!',
    date: '2026-01-12',
    category: 'General',
  },
  {
    id: 'seed-2',
    title: 'Academic Excellence Awards',
    content:
      'Congratulations to all our high-achieving students who received awards this term. Your hard work and dedication continue to inspire us all.',
    date: '2026-02-02',
    category: 'Academic',
  },
];

const TONES = {
  Academic: 'bg-blue-600',
  Sports: 'bg-emerald-600',
  Social: 'bg-purple-600',
  General: 'bg-slate-900',
};

export default function Blog() {
  const { t } = useI18n();
  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [selected, setSelected] = useState(null);

  useEffect(() => watchBlog(setPosts)(), []);

  const visible = useMemo(
    () => (posts.length ? posts : FALLBACK_POSTS).slice().sort((a, b) => b.date.localeCompare(a.date)),
    [posts],
  );

  return (
    <div className="bg-white">
      <PageHero
        tone="light"
        eyebrow={t.nav.blog}
        title={t.nav.blog}
        subtitle="Insights, stories, and updates from our students, faculty, and leadership."
      />

      <div className="container mx-auto max-w-5xl px-6">
        <div className="py-24">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-slate-900">{t.dashboard.recentBlog}</h3>
            <div className="h-1 w-20 rounded-full bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visible.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelected(post)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl"
              >
                <div className="relative aspect-video bg-slate-100">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center text-white ${TONES[post.category] ?? TONES.General}`}
                    >
                      <CalendarDays className="h-10 w-10 opacity-60" />
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {post.category ?? 'General'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <h3 className="mb-4 text-xl font-bold leading-tight text-slate-900">{post.title}</h3>
                  <p className="mb-6 line-clamp-3 flex-grow text-sm text-slate-600">{post.content}</p>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 transition-all hover:gap-3"
                  >
                    {t.home.readMore}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <BlogDetailModal post={selected} onClose={() => setSelected(null)} />
    </div>
  );
}