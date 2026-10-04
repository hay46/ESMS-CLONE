import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  GraduationCap,
  IdCard,
  Mail,
  Newspaper,
  Pencil,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useAuth } from '../../../context/AuthContext';
import { useBlog, useEvents, useFaculty, useMessages, useNews, useStudents } from '../../../hooks/useData';
import { useAllAssignments } from '../../../hooks/useData';
import { Badge, EmptyState, SectionCard } from '../../../components/ui/Primitives';
import Modal from '../../../components/ui/Modal';
import { Field, inputClass } from '../../../components/ui/Primitives';
import IdCardModal from '../../../components/dashboard/IdCardModal';
import { StatCard } from './_shared';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Overview({ role, onNavigate }) {
  const { t } = useI18n();
  const { profile, updateProfile } = useAuth();
  const { dashboard } = t;
  const students = useStudents();
  const faculty = useFaculty();
  const events = useEvents();
  const blog = useBlog();
  const news = useNews();
  const messages = useMessages(profile?.studentId ?? '');
  const assignments = useAllAssignments(profile?.studentId ?? '');
  const [editing, setEditing] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false);

  const me = useMemo(
    () => students.find((student) => student.studentId === profile?.studentId) ?? null,
    [students, profile],
  );

  const upcoming = useMemo(
    () => [...events].sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 3),
    [events],
  );

  const isDirector = role === 'director';

  const quickLinks = isDirector
    ? [
        { label: dashboard.addStudent, icon: UserPlus, tab: 'students' },
        { label: dashboard.gradebook, icon: TrendingUp, tab: 'gradebook' },
        { label: dashboard.manageCalendar, icon: CalendarDays, tab: 'calendar' },
        { label: dashboard.createPost, icon: Newspaper, tab: 'news' },
        { label: t.nav.admissions, icon: GraduationCap, tab: 'admissions' },
        { label: t.payment.title, icon: CreditCard, tab: 'payments' },
      ]
    : role === 'teacher'
      ? [
          { label: 'My Students', icon: Users, tab: 'students' },
          { label: dashboard.gradebook, icon: TrendingUp, tab: 'gradebook' },
          { label: dashboard.messages, icon: Mail, tab: 'messages' },
        ]
      : [
          { label: dashboard.currentGrades, icon: TrendingUp, tab: 'grades' },
          { label: dashboard.upcomingAssignments, icon: Pencil, tab: 'assignments' },
          { label: 'My ID Card', icon: IdCard, tab: 'idcard' },
          { label: t.payment.title, icon: CreditCard, tab: 'payments' },
        ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {isDirector && (
          <>
            <StatCard
              label={dashboard.totalStudents}
              value={students.length}
              hint={`${new Set(students.map((s) => s.grade)).size} grades`}
              icon={Users}
            />
            <StatCard
              label={dashboard.staffMembers}
              value={faculty.length}
              icon={GraduationCap}
              tone="purple"
            />
            <StatCard
              label={dashboard.activeEvents}
              value={events.length}
              icon={CalendarDays}
              tone="emerald"
            />
            <StatCard
              label={t.nav.admissions}
              value={new Set(students.map((s) => s.grade)).size ? 'Active' : '—'}
              hint="2025/2026 academic year"
              icon={Sparkles}
              tone="amber"
            />
          </>
        )}

        {role === 'teacher' && (
          <>
            <StatCard label="My Students" value={students.length} icon={Users} />
            <StatCard
              label={dashboard.gradebook}
              value={students.reduce((sum, s) => sum + (s.gpa ?? 0), 0).toFixed(1)}
              hint="average GPA"
              icon={TrendingUp}
              tone="purple"
            />
            <StatCard
              label={dashboard.attendance}
              value={`${Math.round(
                students.reduce((sum, s) => sum + (s.attendance ?? 0), 0) / (students.length || 1),
              )}%`}
              icon={CalendarDays}
              tone="emerald"
            />
            <StatCard label={dashboard.messages} value={messages.length} icon={Mail} tone="amber" />
          </>
        )}

        {role === 'student' && (
          <>
            <StatCard
              label={dashboard.grade}
              value={profile?.grade || me?.grade || '—'}
              icon={GraduationCap}
            />
            <StatCard label={dashboard.gpa} value={me?.gpa ?? '—'} icon={TrendingUp} tone="purple" />
            <StatCard
              label={dashboard.attendance}
              value={`${me?.attendance ?? 0}%`}
              icon={CalendarDays}
              tone="emerald"
            />
            <StatCard
              label={dashboard.assignments}
              value={assignments.length}
              hint={`${assignments.filter((row) => !row.grade).length} awaiting a grade`}
              icon={Pencil}
              tone="amber"
            />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        <section className="xl:col-span-1">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-xl shadow-blue-200">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
                {dashboard.welcome}
              </p>
              <h2 className="mt-3 text-2xl font-black">{profile?.name}</h2>
              <p className="mt-1 text-sm text-blue-100">
                {isDirector
                  ? dashboard.directorTitle
                  : role === 'teacher'
                    ? profile?.title || t.nav.faculty
                    : profile?.grade}
              </p>

              <dl className="mt-8 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <dt className="text-blue-200">
                    {role === 'student' ? dashboard.studentId : dashboard.employeeId}
                  </dt>
                  <dd className="font-bold">
                    {role === 'student' ? profile?.studentId || '—' : profile?.teacherId || 'AGS-STF'}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <dt className="text-blue-200">{role === 'student' ? dashboard.grade : t.nav.faculty}</dt>
                  <dd className="font-bold">{profile?.grade || profile?.title || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-blue-200">
                    {role === 'student' ? dashboard.enrolled : dashboard.joined}
                  </dt>
                  <dd className="font-bold">{me?.enrollmentDate || '2021-09-06'}</dd>
                </div>
              </dl>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/15 py-3 text-sm font-bold transition-all hover:bg-white/25"
                >
                  <Pencil className="h-4 w-4" />
                  {dashboard.editProfile}
                </button>
                {role === 'student' && (
                  <button
                    type="button"
                    onClick={() => setIdCardOpen(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-blue-700 transition-all hover:bg-blue-50"
                  >
                    <IdCard className="h-4 w-4" />
                    ID Card
                  </button>
                )}
              </div>
            </div>
          </div>

          <SectionCard
            className="mt-8"
            title={isDirector ? dashboard.directorTools : dashboard.quickResources}
          >
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => (link.tab === 'idcard' ? setIdCardOpen(true) : onNavigate(link.tab))}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition-all hover:border-blue-200 hover:bg-blue-50"
                >
                  <link.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">{link.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>
        </section>

        <div className="space-y-8 xl:col-span-2">
          <SectionCard title={dashboard.upcomingClasses} description={dashboard.manageCalendarDesc}>
            {upcoming.length ? (
              <ul className="divide-y divide-slate-100">
                {upcoming.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(event.date)} · {event.time} · {event.location}
                      </p>
                    </div>
                    <Badge tone={event.category === 'Holiday' ? 'amber' : 'blue'}>{event.category}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={CalendarDays} title="No events scheduled" />
            )}
          </SectionCard>

          {role === 'student' && (
            <SectionCard title={dashboard.myEvents}>
              <EmptyState
                icon={CalendarDays}
                title={dashboard.noRegisteredEvents}
                subtitle={
                  <Link to="/events" className="font-bold text-blue-600 hover:underline">
                    {t.nav.events}
                  </Link>
                }
              />
            </SectionCard>
          )}

          {(isDirector || role === 'student') && (
            <SectionCard
              title={isDirector ? dashboard.recentBlog : dashboard.schoolNews}
              action={
                isDirector ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('news')}
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                  >
                    {dashboard.viewAll}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : null
              }
            >
              <ul className="space-y-4">
                {(isDirector ? blog : news).slice(0, 3).map((post) => (
                  <li key={post.id} className="rounded-2xl bg-slate-50 p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-bold text-slate-900">{post.title}</p>
                      <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-500">{post.content}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {isDirector && (
            <SectionCard title={dashboard.systemMessages}>
              {messages.filter((message) => !message.read).length ? (
                <ul className="space-y-3">
                  {messages
                    .filter((message) => !message.read)
                    .slice(0, 4)
                    .map((message) => (
                      <li key={message.id} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{message.subject}</p>
                          <p className="text-xs text-slate-500">{message.message}</p>
                        </div>
                        <Badge tone="amber">{dashboard.new}</Badge>
                      </li>
                    ))}
                </ul>
              ) : (
                <EmptyState icon={Mail} title={dashboard.noMessages} />
              )}
            </SectionCard>
          )}
        </div>
      </div>

      <EditProfileModal open={editing} onClose={() => setEditing(false)} profile={profile} onSave={updateProfile} />
      <IdCardModal
        open={idCardOpen}
        onClose={() => setIdCardOpen(false)}
        student={me ?? { name: profile?.name, studentId: profile?.studentId, grade: profile?.grade, photo: profile?.photo }}
        isDirector={false}
      />
    </>
  );
}

function EditProfileModal({ open, onClose, profile, onSave }) {
  const [form, setForm] = useState({ name: profile?.name ?? '', photo: profile?.photo ?? '', title: profile?.title ?? '' });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Edit Profile</h2>
      <div className="space-y-4">
        <Field label="Full Name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Field>
        {profile?.role === 'teacher' && (
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </Field>
        )}
        <Field label="Photo URL">
          <input
            className={inputClass}
            value={form.photo}
            onChange={(event) => setForm({ ...form, photo: event.target.value })}
          />
        </Field>
      </div>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}