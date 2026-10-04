import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Gauge,
  GraduationCap,
  LayoutGrid,
  Mail,
  NewspaperIcon,
  Users,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui/Primitives';
import OnboardingGate from './OnboardingGate';
import Overview from './modules/Overview';
import StudentsManager from './modules/StudentsManager';
import Gradebook from './modules/Gradebook';
import FacultyManager from './modules/FacultyManager';
import CalendarManager from './modules/CalendarManager';
import NewsManager from './modules/NewsManager';
import MessagesPanel from './modules/MessagesPanel';
import AdmissionsManager from './modules/AdmissionsManager';
import PaymentsPanel from './modules/PaymentsPanel';
import AdminTools from './modules/AdminTools';
import { StudentAssignments, StudentGrades } from './modules/StudentAcademics';

const TABS = {
  director: [
    { id: 'overview', label: 'Overview', icon: Gauge },
    { id: 'admin', label: 'Admin Tools', icon: Wrench },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'gradebook', label: 'Gradebook', icon: ClipboardList },
    { id: 'faculty', label: 'Faculty', icon: GraduationCap },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'news', label: 'News & Blog', icon: NewspaperIcon },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'admissions', label: 'Admissions', icon: BookOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ],
  teacher: [
    { id: 'overview', label: 'Overview', icon: Gauge },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'gradebook', label: 'Gradebook', icon: ClipboardList },
    { id: 'messages', label: 'Messages', icon: Mail },
  ],
  student: [
    { id: 'overview', label: 'Overview', icon: Gauge },
    { id: 'grades', label: 'My Grades', icon: ClipboardList },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ],
};

export default function Dashboard() {
  const { profile, loading, updateProfile } = useAuth();
  const { t } = useI18n();
  const { notify } = useToast();
  const role = profile?.role ?? 'student';
  const [tab, setTab] = useState('overview');

  const tabs = useMemo(() => TABS[role] ?? TABS.student, [role]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (!profile) return <Navigate to="/" replace />;

  const onboarded = Boolean(profile.name && profile.role);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
                {t.nav.dashboard}
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
                {t.dashboard.welcome}, {profile.name?.split(' ')[0]}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {role === 'director'
                  ? t.dashboard.directorTitle
                  : role === 'teacher'
                    ? profile.title || t.nav.faculty
                    : `${t.dashboard.studentId}: ${profile.studentId || '—'}`}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <LayoutGrid className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Academic Year
                </p>
                <p className="text-sm font-bold text-slate-900">2025 / 2026</p>
              </div>
            </div>
          </div>

          <nav className="-mb-px mt-10 flex gap-1 overflow-x-auto">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition-colors ${
                  tab === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'overview' && <Overview role={role} onNavigate={setTab} />}
            {tab === 'admin' && role === 'director' && <AdminTools />}
            {tab === 'students' && <StudentsManager isDirector={role === 'director'} />}
            {tab === 'gradebook' && <Gradebook profile={profile} />}
            {tab === 'faculty' && role === 'director' && <FacultyManager />}
            {tab === 'calendar' && <CalendarManager canEdit={role === 'director'} />}
            {tab === 'news' && role === 'director' && <NewsManager />}
            {tab === 'messages' && <MessagesPanel profile={profile} role={role} />}
            {tab === 'admissions' && role === 'director' && <AdmissionsManager />}
            {tab === 'grades' && <StudentGrades profile={profile} />}
            {tab === 'assignments' && <StudentAssignments profile={profile} />}
            {tab === 'payments' && <PaymentsPanel profile={profile} role={role} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {!onboarded && (
        <OnboardingGate
          profile={profile}
          onComplete={async (patch) => {
            const next = await updateProfile(patch);
            if (!next.role) {
              notify('Select a role to finish setting up your account.', 'error');
            }
          }}
        />
      )}
    </div>
  );
}