/** Firestore path helpers shared by the cloud and mock backends. */
export const subjectSlug = (subject) => subject.replace(/\s+/g, '_').toLowerCase();

export const studentsPath = 'students';
export const teachersPath = 'teachers';
export const facultyPath = 'faculty';
export const eventsPath = 'events';
export const blogPath = 'blog';
export const newsPath = 'news';
export const admissionsPath = 'admissions';
export const messagesPath = 'messages';
export const teacherMessagesPath = 'teacher_messages';
export const registrationsPath = 'registrations';
export const profilesPath = 'profiles';

export const paymentsPath = (studentId) => `students/${studentId}/payments`;
export const receiptsPath = (studentId) => `students/${studentId}/receipts`;
export const attendancePath = (studentId) => `students/${studentId}/attendance`;
export const assignmentsPath = (studentId, subject) =>
  `students/${studentId}/grades/${subjectSlug(subject)}/assignments`;
export const gradeSummaryPath = (studentId, subject) =>
  `students/${studentId}/grades/${subjectSlug(subject)}`;