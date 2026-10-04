import { motion } from 'framer-motion';

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', light = false, className = '' }) {
  const centred = align === 'center';
  return (
    <motion.div
      {...fadeUp}
      className={`${centred ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}
    >
      {eyebrow && (
        <span
          className={`mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
            light ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mb-6 text-4xl font-black leading-tight md:text-5xl ${
          light ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg leading-relaxed ${light ? 'text-slate-400' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function PageHero({ eyebrow, title, subtitle, children, tone = 'dark' }) {
  if (tone === 'light') {
    return (
      <section className="bg-white py-24 md:py-28">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp}>
            <span className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600">
              {eyebrow}
            </span>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-[#0f172a] md:text-6xl">
              {title}
            </h1>
            {subtitle && <p className="max-w-3xl text-xl leading-relaxed text-slate-600">{subtitle}</p>}
            {children}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#0f172a] px-6 py-24 text-center">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500 blur-3xl" />
      </div>
      <motion.div
        {...fadeUp}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <span className="mb-6 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
          {eyebrow}
        </span>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">{title}</h1>
        {subtitle && <p className="text-xl leading-relaxed text-slate-400">{subtitle}</p>}
        {children}
      </motion.div>
    </section>
  );
}