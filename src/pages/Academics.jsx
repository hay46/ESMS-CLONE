import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { galleryImages } from '../lib/seed';
import Modal from '../components/ui/Modal';
import { PageHero } from '../components/ui/Section';

export default function Academics() {
  const { t } = useI18n();
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const items = useMemo(
    () => t.gallery.map((item, index) => ({ ...item, id: index + 1, url: galleryImages[index] })),
    [t.gallery],
  );

  const categories = ['All', ...new Set(items.map((item) => item.category))];
  const visible = filter === 'All' ? items : items.filter((item) => item.category === filter);

  return (
    <div className="bg-white">
      <PageHero tone="light" eyebrow={t.nav.academics} title="Campus Gallery" subtitle="Take a look at our facilities and student activities." />

      <div className="container mx-auto px-6">
        <div className="mt-20">
          <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Campus Life</h2>
              <p className="text-slate-500">Facilities and activities that shape our community.</p>
            </div>

            <div className="flex items-center self-start rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                    filter === category
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -6 }}
                onClick={() => setLightbox(item)}
                className="group text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Maximize2 className="h-4 w-4" />
                      View photo
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm font-medium text-blue-600">{item.category}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={Boolean(lightbox)} onClose={() => setLightbox(null)} maxWidth="max-w-5xl">
        {lightbox && (
          <div className="grid overflow-hidden rounded-2xl md:grid-cols-2">
            <div className="h-72 w-full md:h-auto md:aspect-auto">
              <img src={lightbox.url} alt={lightbox.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
              <span className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">
                {lightbox.category}
              </span>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">{lightbox.title}</h2>
              <div className="mb-6 h-1 w-12 rounded-full bg-blue-600" />
              <p className="text-lg font-medium text-slate-500">
                Part of the {lightbox.category.toLowerCase()} collection at Abune Gorgorios School.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}