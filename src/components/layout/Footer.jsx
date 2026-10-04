import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { navItems } from './Header';

export default function Footer() {
  const { t } = useI18n();
  const { contactPage, footer } = t;

  return (
    <footer className="bg-[#0f172a] pt-20 text-white">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <img src="/favicon.svg" alt="" className="h-11 w-11 rounded-xl" />
              <span className="text-lg font-black leading-tight">
                Abune Gorgorios
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  School
                </span>
              </span>
            </div>
            <h4 className="mb-6 text-lg font-bold">{footer.about}</h4>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">{t.hero.subtitle}</p>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold">{footer.quickLinks}</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {t.nav[item.name.toLowerCase()]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  {t.nav.dashboard}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold">{footer.contact}</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {contactPage.addressValue}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {contactPage.phoneValue}
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                {contactPage.emailValue}
              </li>
            </ul>
            <Link
              to="/contact"
              className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              {t.contactPage.formTitle}
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-slate-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Abune Gorgorios School. {footer.rights}
          </p>
          <p>Accredited by the Ministry of Education · Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </footer>
  );
}