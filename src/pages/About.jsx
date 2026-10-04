import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Compass, Quote, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { aboutImages } from '../lib/seed';

const MISSION_TONES = [
  { key: 'mission', icon: Target, tile: 'bg-blue-100', hover: 'group-hover:bg-white/20', text: 'group-hover:text-blue-50/80' },
  { key: 'vision', icon: Compass, tile: 'bg-emerald-100', hover: 'group-hover:bg-white/20', text: 'group-hover:text-emerald-50/80' },
];

export default function About() {
  const { t } = useI18n();
  const { about, aboutPage, faculty } = t;
  const principal = faculty[0];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#0f172a] py-32">
        <div className="absolute inset-0 opacity-30">
          <img src={aboutImages.legacy} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]" />
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            <span className="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
              {about.established}
            </span>
            <h1 className="mb-8 text-6xl font-black tracking-tighter text-white md:text-8xl">
              {about.heroTitle}
            </h1>
            <p className="text-xl font-light leading-relaxed text-slate-300 md:text-2xl">
              {about.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col overflow-hidden rounded-[3rem] bg-slate-900 shadow-2xl lg:flex-row">
            <div className="relative min-h-[400px] lg:w-1/3">
              <img src={principal.photo} alt={principal.name} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-12 md:p-20 lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Quote className="mb-8 h-16 w-16 text-blue-500/20" />
                <h2 className="mb-8 text-3xl font-bold leading-tight text-white md:text-4xl">
                  {about.principalMessage}
                </h2>
                <div className="mb-12 space-y-6 text-lg leading-relaxed text-slate-400">
                  <p>{about.principalWelcome}</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{principal.name}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-widest text-blue-500">
                    {principal.title}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50 py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center gap-20 lg:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                <TrendingUp className="h-4 w-4" />
                {about.journeyBadge}
              </span>
              <h2 className="mb-8 text-5xl font-black leading-tight text-[#0f172a] md:text-6xl">
                {about.journeyTitle}
              </h2>
              <p className="mb-10 text-xl leading-relaxed text-slate-600">{about.journeyDesc}</p>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: '30+', label: 'Years of Excellence' },
                  { value: '5k+', label: 'Students Graduated' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-2 text-4xl font-black text-blue-600">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative lg:w-1/2"
            >
              <div className="relative z-10 aspect-square overflow-hidden rounded-[4rem] shadow-2xl">
                <img src={aboutImages.students} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -right-10 -top-10 -z-0 h-64 w-64 rounded-full bg-blue-600 opacity-20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 -z-0 h-64 w-64 rounded-full bg-emerald-600 opacity-20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-black text-slate-900 md:text-5xl">
              {aboutPage.foundationTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500">{aboutPage.foundationSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {MISSION_TONES.map((item) => (
              <motion.div
                key={item.key}
                whileHover={{ y: -6 }}
                className="group rounded-[2.5rem] bg-blue-600 p-10 text-white transition-all hover:bg-emerald-600"
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${item.tile} ${item.hover}`}>
                  <item.icon className="h-8 w-8 text-slate-900" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{aboutPage[`${item.key}Title`]}</h3>
                <p className={`leading-relaxed ${item.text}`}>{aboutPage[`${item.key}Desc`]}</p>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ y: -6 }}
              className="group rounded-[2.5rem] bg-amber-500 p-10 text-white transition-all hover:bg-amber-600"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 transition-colors group-hover:bg-white/20">
                <Sparkles className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">{aboutPage.valuesTitle}</h3>
              <div className="space-y-4">
                {aboutPage.values.map((value) => (
                  <div key={value.t} className="flex gap-4">
                    <div>
                      <div className="text-sm font-bold text-white">{value.t}</div>
                      <div className="text-xs text-white/70">{value.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-32 text-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-20 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div className="max-w-2xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Award className="h-4 w-4" />
                {aboutPage.leadershipBadge}
              </span>
              <h2 className="mb-6 text-5xl font-black">{aboutPage.leadershipTitle}</h2>
              <p className="text-lg text-slate-400">{aboutPage.leadershipSubtitle}</p>
            </div>
            <Link
              to="/faculty"
              className="group flex items-center gap-3 font-bold text-blue-400 transition-colors hover:text-white"
            >
              {aboutPage.viewAllFaculty}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 transition-all group-hover:border-blue-500 group-hover:bg-blue-500">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {faculty.slice(0, 3).map((member) => (
              <motion.article key={member.name} whileHover={{ y: -6 }} className="group">
                <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <img
                    src={member.photo ?? `https://picsum.photos/seed/faculty/400/500`}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-0 flex translate-y-4 flex-col justify-end p-10 transition-transform group-hover:translate-y-0">
                    <h3 className="mb-1 text-2xl font-bold text-white">{member.name}</h3>
                    <p className="mb-4 text-xs font-medium uppercase tracking-widest text-blue-400">
                      {member.title}
                    </p>
                    <p className="line-clamp-2 text-sm text-slate-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-blue-600 p-8 text-center text-white md:rounded-[4rem] md:p-24">
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-900/20 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-4xl">
              <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <BookOpen className="h-4 w-4" />
                {aboutPage.accreditationBadge}
              </span>
              <h2 className="mb-10 text-5xl font-black tracking-tight md:text-6xl">
                {aboutPage.accreditationTitle}
              </h2>
              <p className="text-xl leading-relaxed text-blue-100">{aboutPage.accreditationDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}