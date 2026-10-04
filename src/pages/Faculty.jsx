import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, X } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { watchFaculty } from '../lib/api';
import { PageHero } from '../components/ui/Section';
import Modal from '../components/ui/Modal';
import { Avatar } from '../components/ui/Primitives';

const fallbackPhoto = (index) => `https://picsum.photos/seed/faculty${index}/400/500`;

export default function Faculty() {
  const { t } = useI18n();
  const [members, setMembers] = useState(t.faculty);
  const [selected, setSelected] = useState(null);

  useEffect(() => watchFaculty(setMembers)(), []);

  const list = useMemo(
    () =>
      members.length
        ? members
        : t.faculty.map((member, index) => ({
            ...member,
            id: index + 1,
            teacherId: `T-${String(index + 1).padStart(3, '0')}`,
            photo: member.photo ?? fallbackPhoto(index + 1),
          })),
    [members, t.faculty],
  );

  return (
    <div className="bg-white">
      <PageHero
        tone="light"
        eyebrow={t.nav.faculty}
        title={t.nav.faculty}
        subtitle="Meet the educators who shape every classroom at Abune Gorgorios School."
      />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-10 py-24 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {list.map((member, index) => (
              <motion.button
                key={member.id ?? member.name}
                type="button"
                whileHover={{ y: -6 }}
                layout
                onClick={() => setSelected({ ...member, index })}
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-left shadow-sm transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={member.photo ?? fallbackPhoto(index + 1)}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Mail className="h-4 w-4" />
                      {member.email ?? t.contactPage.emailValue}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-slate-900">{member.name}</h3>
                  <p className="text-sm font-medium text-blue-600">{member.title}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="max-w-4xl">
        {selected && (
          <div className="grid overflow-hidden rounded-2xl md:grid-cols-[2fr_3fr]">
            <div className="relative min-h-[280px] md:min-h-full">
              <img
                src={selected.photo ?? fallbackPhoto(selected.index + 1)}
                alt={selected.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                {selected.title}
              </span>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">{selected.name}</h2>
              <div className="mb-6 h-1 w-12 rounded-full bg-blue-600" />
              <p className="text-lg font-medium text-slate-500">{selected.teacherId}</p>
              <p className="italic leading-relaxed text-slate-600">{selected.bio}</p>
              <div className="mt-8 flex items-center gap-3">
                <Avatar src={selected.photo} name={selected.name} size="h-10 w-10" rounded="rounded-full" />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                  {t.common.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}