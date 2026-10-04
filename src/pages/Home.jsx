import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, GraduationCap, Sparkles, Users } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { watchBlog } from '../lib/api';
import { heroImage } from '../lib/seed';
import BlogDetailModal from '../components/blog/BlogDetailModal';

const FEATURE_ICONS = [GraduationCap, Users, Sparkles];

export default function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => watchBlog(setPosts)(), []);

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="School campus"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-900/40 px-4 py-1.5 backdrop-blur-sm md:mb-8">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                <Sparkles className="h-3 w-3 text-white" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-100 md:text-xs">
                {t.hero.welcome}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-300 md:mb-10 md:text-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-105 hover:bg-blue-700 md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-slate-800 md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.ctaSecondary}
                <CalendarDays className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {t.home.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? Sparkles;
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-8 transition-all hover:shadow-xl"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
                  <p className="leading-relaxed text-slate-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                <CalendarDays className="h-4 w-4" />
                {t.hero.ctaSecondary}
              </div>
              <h2 className="mb-6 text-4xl font-black text-slate-900 md:text-5xl">
                {t.home.newsTitle}
              </h2>
              <p className="text-lg text-slate-600">{t.home.newsSubtitle}</p>
            </div>
            <Link
              to="/blog"
              className="group flex items-center gap-3 font-bold text-blue-600 transition-colors hover:text-blue-700"
            >
              {t.home.viewAllNews}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <motion.article
                key={post.id}
                whileHover={{ y: -5 }}
                className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
              >
                <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="mb-4 text-xl font-bold leading-tight text-slate-900">{post.title}</h3>
                <p className="mb-6 line-clamp-3 text-sm text-slate-600">{post.content}</p>
                <button
                  type="button"
                  onClick={() => setSelected(post)}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  {t.home.readMore}
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <BlogDetailModal post={selected} onClose={() => setSelected(null)} />
    </>
  );
}