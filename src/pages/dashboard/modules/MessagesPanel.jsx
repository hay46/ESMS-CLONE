import { useMemo, useState } from 'react';
import { Inbox, Mail, MessageSquare, Send, Users } from 'lucide-react';
import { useI18n } from '../../../context/I18nContext';
import { useToast } from '../../../context/ToastContext';
import { useMessages, useStudents, useTeacherMessages } from '../../../hooks/useData';
import { createMessage, createTeacherMessage, markMessageRead } from '../../../lib/api';
import { Avatar, Badge, EmptyState, SectionCard } from '../../../components/ui/Primitives';
import MessageComposer from './MessageComposer';

const CATEGORY_TONES = {
  Academic: 'blue',
  Behavior: 'amber',
  General: 'slate',
  Urgent: 'red',
};

export default function MessagesPanel({ profile, role }) {
  const { t } = useI18n();
  const { notify } = useToast();
  const { dashboard } = t;
  const students = useStudents();
  const directorMessages = useMessages(role === 'director' ? '' : profile?.studentId ?? '');
  const teacherMessages = useTeacherMessages(role === 'teacher' ? profile?.teacherId ?? '' : '');
  const [composing, setComposing] = useState(false);
  const [recipient, setRecipient] = useState(null);

  const threads = useMemo(() => {
    if (role === 'director') {
      return directorMessages.map((message) => ({
        ...message,
        person: students.find((student) => student.studentId === message.studentId)?.name ?? message.studentId,
        photo: students.find((student) => student.studentId === message.studentId)?.photo,
      }));
    }
    if (role === 'teacher') return teacherMessages;
    return directorMessages;
  }, [role, directorMessages, teacherMessages, students]);

  const categories = [
    dashboard.categoryAcademic,
    dashboard.categoryBehavior,
    dashboard.categoryGeneral,
    dashboard.categoryUrgent,
  ];

  return (
    <>
      <SectionCard
        title={dashboard.messages}
        description={
          role === 'student'
            ? dashboard.fromDirector
            : role === 'teacher'
              ? 'Messages from students and parents'
              : `${threads.length} conversations`
        }
        action={
          role !== 'student' ? (
            <button
              type="button"
              onClick={() => setComposing(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              {dashboard.sendMessage}
            </button>
          ) : null
        }
      >
        {threads.length ? (
          <ul className="space-y-4">
            {threads.map((message) => (
              <li
                key={message.id}
                className="rounded-2xl border border-slate-100 p-5 transition-all hover:border-blue-200"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {message.person ? (
                      <Avatar src={message.photo} name={message.person} size="h-10 w-10" rounded="rounded-xl" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-900">{message.person ?? dashboard.fromDirector}</p>
                      <p className="text-xs text-slate-400">
                        {message.createdAt ? String(message.createdAt).slice(0, 10) : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={CATEGORY_TONES[message.category] ?? 'slate'}>{message.category}</Badge>
                    {!message.read && role !== 'director' && (
                      <Badge tone="blue">{dashboard.new}</Badge>
                    )}
                  </div>
                </div>

                <p className="font-bold text-slate-800">{message.subject}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{message.message}</p>

                {role !== 'director' && !message.read && (
                  <button
                    type="button"
                    onClick={() => markMessageRead(message.id)}
                    className="mt-4 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={role === 'director' ? Inbox : Mail}
            title={dashboard.noStudentMessages}
            subtitle={
              role === 'director' ? 'Messages sent from Students Manager will appear here.' : undefined
            }
          />
        )}
      </SectionCard>

      <MessageComposer
        open={composing}
        onClose={() => setComposing(false)}
        title={dashboard.sendMessage}
        categories={categories}
        submit={async ({ category, subject, message }) => {
          if (recipient) {
            await createMessage({
              studentId: recipient.studentId,
              fromRole: 'director',
              category,
              subject,
              message,
            });
            notify(`${dashboard.messages} → ${recipient.name}`);
            return;
          }
          await createTeacherMessage({
            teacherId: profile?.teacherId ?? '',
            studentId: '',
            fromRole: 'student',
            category,
            subject,
            message,
          });
          notify(dashboard.sendMessage);
        }}
      />

      {role === 'director' && (
        <SectionCard title={dashboard.studentManagement} description="Message a student directly.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => {
                  setRecipient(student);
                  setComposing(true);
                }}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 text-left transition-all hover:border-blue-200 hover:bg-blue-50"
              >
                <Avatar src={student.photo} name={student.name} size="h-10 w-10" rounded="rounded-xl" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{student.name}</p>
                  <p className="truncate text-xs text-slate-400">{student.grade}</p>
                </div>
              </button>
            ))}
          </div>
          {!students.length && <EmptyState icon={Users} title={dashboard.noStudents} />}
        </SectionCard>
      )}
    </>
  );
}