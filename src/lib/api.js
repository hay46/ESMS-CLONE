import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth, googleProvider, isCloudEnabled } from './firebase';
import { subjects } from './seed';
import { firebaseBackend } from './backend/firebaseBackend';
import {
  mockBackend,
  mockSession,
  resetDemoData as resetMockData,
  subscribeMockSession,
} from './backend/mockBackend';
import {
  admissionsPath,
  assignmentsPath,
  attendancePath,
  blogPath,
  eventsPath,
  facultyPath,
  gradeSummaryPath,
  messagesPath,
  newsPath,
  paymentsPath,
  profilesPath,
  receiptsPath,
  registrationsPath,
  studentsPath,
  subjectSlug,
  teacherMessagesPath,
  teachersPath,
} from './backend/paths';

export const cloudEnabled = isCloudEnabled;
const backend = isCloudEnabled ? firebaseBackend : mockBackend;

const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();

/* ------------------------------------------------------------------ *
 * Generic collection helpers
 * ------------------------------------------------------------------ */
export const listAt = (path) => backend.listAt(path);
export const watchAt = (path, callback) => backend.watchAt(path, callback);
export const createAt = (path, data) => backend.createAt(path, data);
export const updateAt = (path, id, patch) => backend.updateAt(path, id, patch);
export const removeAt = (path, id) => backend.removeAt(path, id);
export const getAt = (path) => backend.getAt(path);
export const setAt = (path, data) => backend.setAt(path, data);

const normalise = (row) => ({ ...row, subjectSlug: subjectSlug(row.subject ?? '') });

/* ------------------------------------------------------------------ *
 * Authentication
 * ------------------------------------------------------------------ */
const findMockProfile = (email) =>
  backend
    .listAt(profilesPath)
    .then((rows) => rows.find((row) => row.email?.toLowerCase() === email.toLowerCase()) ?? null);

const buildCloudProfile = (user) =>
  Promise.all([
    backend.getAt(`${profilesPath}/${user.uid}`),
    backend
      .listAt(studentsPath)
      .then((rows) => rows.find((row) => row.email === user.email) ?? null),
    backend
      .listAt(teachersPath)
      .then((rows) => rows.find((row) => row.email === user.email) ?? null),
  ]).then(([profile, student, teacher]) => {
    if (profile?.role) return { ...profile, uid: user.uid, email: user.email };
    if (student) {
      const resolved = {
        uid: user.uid,
        email: user.email,
        name: student.name,
        role: 'student',
        grade: student.grade,
        photo: student.photo,
        studentId: student.studentId,
        title: '',
        hasIdCard: Boolean(student.hasIdCard),
        enrollmentDate: student.enrollmentDate,
      };
      backend.setAt(`${profilesPath}/${user.uid}`, resolved);
      return resolved;
    }
    if (teacher) {
      const resolved = {
        uid: user.uid,
        email: user.email,
        name: teacher.name,
        role: 'teacher',
        title: teacher.title,
        subject: teacher.subject,
        teacherId: teacher.teacherId,
        photo: teacher.photo,
        grade: '',
        studentId: '',
      };
      backend.setAt(`${profilesPath}/${user.uid}`, resolved);
      return resolved;
    }
    return { uid: user.uid, email: user.email, name: user.displayName ?? '', role: null };
  });

export function observeSession(callback) {
  if (!isCloudEnabled) {
    callback(mockSession.read());
    return subscribeMockSession(callback);
  }
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(null);
      return;
    }
    buildCloudProfile(user).then(callback, () => callback(null));
  });
}

export async function signIn(email, password) {
  if (!isCloudEnabled) {
    const profile = await findMockProfile(email);
    if (!profile || password.length < 6) {
      throw new Error('Invalid email or password.');
    }
    mockSession.write(profile);
    return profile;
  }
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  if (!isCloudEnabled) {
    const profile = await findMockProfile('director@ags.edu.et');
    mockSession.write(profile);
    return profile;
  }
  await signInWithPopup(auth, googleProvider);
}

export async function registerAccount({ name, email, password, role }) {
  if (!isCloudEnabled) {
    const existing = await findMockProfile(email);
    if (existing) throw new Error('An account with this email already exists.');
    const profile = {
      id: `profile-${Date.now().toString(36)}`,
      uid: `user-${Date.now().toString(36)}`,
      name,
      email,
      role: role ?? null,
      title: '',
      grade: '',
      photo: '',
      studentId: '',
      teacherId: '',
    };
    await backend.createAt(profilesPath, profile);
    mockSession.write(profile);
    return profile;
  }
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateFirebaseProfile(credential.user, { displayName: name });
  if (role) {
    await backend.setAt(`${profilesPath}/${credential.user.uid}`, { role, name, email });
  }
  return credential.user;
}

export async function signOutUser() {
  if (!isCloudEnabled) {
    mockSession.write(null);
    return;
  }
  await firebaseSignOut(auth);
}

export async function saveProfile(profile, patch) {
  const next = { ...profile, ...patch };
  if (!isCloudEnabled) {
    await backend.updateAt(profilesPath, profile.id ?? profile.uid, patch);
    mockSession.write({ ...next, id: profile.id ?? profile.uid });
    return next;
  }
  await backend.setAt(`${profilesPath}/${profile.uid}`, patch);
  return next;
}

export const resetDemoData = isCloudEnabled ? async () => {} : resetMockData;

/* ------------------------------------------------------------------ *
 * Students
 * ------------------------------------------------------------------ */
export const watchStudents = (callback) => watchAt(studentsPath, callback);
export const listStudents = () => listAt(studentsPath);

export const createStudent = (data) =>
  createAt(studentsPath, {
    enrollmentDate: today(),
    hasIdCard: false,
    photo: '',
    ...data,
  });

export const saveStudent = (id, patch) => updateAt(studentsPath, id, patch);
export const deleteStudent = (id) => removeAt(studentsPath, id);

/* ------------------------------------------------------------------ *
 * Faculty / teachers
 * ------------------------------------------------------------------ */
export const watchFaculty = (callback) => watchAt(facultyPath, callback);
export const createFacultyMember = (data) => createAt(facultyPath, { photo: '', ...data });
export const saveFacultyMember = (id, patch) => updateAt(facultyPath, id, patch);
export const deleteFacultyMember = (id) => removeAt(facultyPath, id);

export const listTeachers = () => listAt(teachersPath).then((rows) => rows.map(normalise));

/* ------------------------------------------------------------------ *
 * Events + registrations
 * ------------------------------------------------------------------ */
export const watchEvents = (callback) => watchAt(eventsPath, callback);
export const createEvent = (data) => createAt(eventsPath, { ...data, createdAt: now() });
export const saveEvent = (id, patch) => updateAt(eventsPath, id, patch);
export const deleteEvent = (id) => removeAt(eventsPath, id);

export function watchRegistrations(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }
  return watchAt(registrationsPath, (rows) =>
    callback(rows.filter((row) => row.userId === userId).map((row) => row.eventId)),
  );
}

export async function registerForEvent(userId, eventId) {
  if (!userId) throw new Error('Sign in to register for events.');
  const existing = (await listAt(registrationsPath)).find(
    (row) => row.userId === userId && row.eventId === eventId,
  );
  if (existing) return existing;
  return createAt(registrationsPath, { userId, eventId, createdAt: now() });
}

export async function cancelEventRegistration(userId, eventId) {
  const existing = (await listAt(registrationsPath)).find(
    (row) => row.userId === userId && row.eventId === eventId,
  );
  if (existing) await removeAt(registrationsPath, existing.id);
}

/* ------------------------------------------------------------------ *
 * Messaging
 * ------------------------------------------------------------------ */
export function watchMessages(studentId, callback) {
  return watchAt(messagesPath, (rows) =>
    callback(
      rows
        .filter((row) => !studentId || row.studentId === studentId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    ),
  );
}

export const createMessage = (data) =>
  createAt(messagesPath, { createdAt: now(), read: false, category: 'General', ...data });

export const markMessageRead = (id) => updateAt(messagesPath, id, { read: true });

export function watchTeacherMessages(teacherId, callback) {
  return watchAt(teacherMessagesPath, (rows) =>
    callback(
      rows
        .filter((row) => !teacherId || row.teacherId === teacherId)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
    ),
  );
}

export const createTeacherMessage = (data) =>
  createAt(teacherMessagesPath, { createdAt: now(), category: 'General', ...data });

/* ------------------------------------------------------------------ *
 * Blog + news
 * ------------------------------------------------------------------ */
export const watchBlog = (callback) => watchAt(blogPath, callback);
export const createBlogPost = (data) => createAt(blogPath, { date: today(), ...data });
export const saveBlogPost = (id, patch) => updateAt(blogPath, id, patch);
export const deleteBlogPost = (id) => removeAt(blogPath, id);

export const watchNews = (callback) => watchAt(newsPath, callback);
export const createNewsItem = (data) => createAt(newsPath, { date: today(), ...data });
export const saveNewsItem = (id, patch) => updateAt(newsPath, id, patch);
export const deleteNewsItem = (id) => removeAt(newsPath, id);

/* ------------------------------------------------------------------ *
 * Admissions
 * ------------------------------------------------------------------ */
export const submitAdmission = (data) =>
  createAt(admissionsPath, { status: 'Pending', submittedAt: today(), note: '', ...data });

export const watchAdmissions = (callback) =>
  watchAt(admissionsPath, (rows) =>
    callback([...rows].sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)))),
  );

export const saveAdmission = (id, patch) => updateAt(admissionsPath, id, patch);

/* ------------------------------------------------------------------ *
 * Grades, assignments, attendance
 * ------------------------------------------------------------------ */
export const watchAssignments = (studentId, subject, callback) =>
  watchAt(assignmentsPath(studentId, subject), (rows) =>
    callback([...rows].sort((a, b) => String(a.id).localeCompare(String(b.id)))),
  );

export const createAssignment = (studentId, subject, data) =>
  createAt(assignmentsPath(studentId, subject), { total: 100, ...data });

/** Merges every subject sub-collection into one flat assignment list. */
export function watchAllAssignments(studentId, callback) {
  if (!studentId) {
    callback([]);
    return () => {};
  }
  const cache = new Map();
  const emit = () => {
    const rows = [...cache.values()].flat();
    rows.sort(
      (a, b) =>
        String(a.subject ?? '').localeCompare(String(b.subject ?? '')) ||
        String(a.id).localeCompare(String(b.id)),
    );
    callback(rows);
  };
  const unsubscribes = subjects.map((subject) =>
    watchAt(assignmentsPath(studentId, subjectSlug(subject)), (rows) => {
      cache.set(subject, rows);
      emit();
    }),
  );
  return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
}

export const gradeAssignment = (studentId, subject, id, patch) =>
  updateAt(assignmentsPath(studentId, subject), id, patch);

export const getGradeSummary = (studentId, subject) => getAt(gradeSummaryPath(studentId, subject));
export const setGradeSummary = (studentId, subject, data) =>
  setAt(gradeSummaryPath(studentId, subject), data);

export const watchAttendance = (studentId, callback) =>
  watchAt(attendancePath(studentId), callback);

export const saveAttendanceEntry = (studentId, id, patch) =>
  updateAt(attendancePath(studentId), id, patch);

export const createAttendanceEntry = (studentId, data) =>
  createAt(attendancePath(studentId), { date: today(), ...data });

/* ------------------------------------------------------------------ *
 * Payments + receipts
 * ------------------------------------------------------------------ */
export const watchPayments = (studentId, callback) => watchAt(paymentsPath(studentId), callback);
export const createPayment = (studentId, data) =>
  createAt(paymentsPath(studentId), { date: today(), ...data });

export const watchReceipts = (studentId, callback) => watchAt(receiptsPath(studentId), callback);
export const createReceipt = (studentId, data) =>
  createAt(receiptsPath(studentId), { status: 'Pending', date: today(), ...data });
export const saveReceipt = (studentId, id, patch) =>
  updateAt(receiptsPath(studentId), id, patch);