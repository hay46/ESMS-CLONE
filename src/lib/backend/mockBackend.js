import {
  seedAssignments,
  seedAdmissions,
  seedAttendance,
  seedBlog,
  seedEvents,
  seedGrades,
  seedMessages,
  seedNews,
  seedPayments,
  seedProfiles,
  seedReceipts,
  seedRegistrations,
  seedStudents,
  seedTeacherMessages,
  seedTeachers,
} from '../seed';
import { subjectSlug } from './paths';

const STORAGE_KEY = 'esms-clone:db:v2';
const SESSION_KEY = 'esms-clone:session';

/** Builds the whole demo graph using real Firestore-style paths. */
function buildSeed() {
  const collections = {
    students: seedStudents,
    teachers: seedTeachers,
    faculty: seedTeachers,
    events: seedEvents,
    blog: seedBlog,
    news: seedNews,
    admissions: seedAdmissions,
    messages: seedMessages,
    teacher_messages: seedTeacherMessages,
    registrations: seedRegistrations,
    profiles: Object.values(seedProfiles),
  };
  const documents = {};

  Object.entries(seedPayments).forEach(([studentId, rows]) => {
    collections[`students/${studentId}/payments`] = rows;
  });
  Object.entries(seedReceipts).forEach(([studentId, rows]) => {
    collections[`students/${studentId}/receipts`] = rows;
  });
  Object.entries(seedAttendance).forEach(([studentId, rows]) => {
    collections[`students/${studentId}/attendance`] = rows;
  });
  Object.entries(seedAssignments).forEach(([subject, rows]) => {
    Object.keys(seedStudents).forEach((_, index) => {
      collections[`students/${seedStudents[index].id}/grades/${subjectSlug(subject)}/assignments`] =
        rows;
    });
  });
  Object.entries(seedGrades).forEach(([subject, summary]) => {
    documents[`students/${seedStudents[0].id}/grades/${subjectSlug(subject)}`] = summary;
  });

  return { collections, documents };
}

const clone = (value) => JSON.parse(JSON.stringify(value));

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted demo store — start over */
  }
  return buildSeed();
}

let state = typeof localStorage === 'undefined' ? buildSeed() : load();
const listeners = new Set();

function commit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — keep working in memory */
  }
  listeners.forEach((listener) => listener());
}

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const readCollection = (path) => state.collections[path] ?? [];

const sessionListeners = new Set();

export const mockSession = {
  read() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  write(session) {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
    commit();
    sessionListeners.forEach((listener) => listener(session ? clone(session) : null));
  },
};

/** Keeps <AuthProvider> in sync when the demo session changes. */
export function subscribeMockSession(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function resetDemoData() {
  state = buildSeed();
  commit();
}

export const mockBackend = {
  async listAt(path) {
    return clone(readCollection(path));
  },

  watchAt(path, callback) {
    const emit = () => callback(clone(readCollection(path)));
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },

  async createAt(path, data) {
    const record = { ...clone(data), id: data.id ?? uid(path.split('/').pop().slice(0, 2)) };
    state.collections[path] = [record, ...readCollection(path)];
    commit();
    return clone(record);
  },

  async updateAt(path, id, patch) {
    state.collections[path] = readCollection(path).map((item) =>
      item.id === id ? { ...item, ...clone(patch) } : item,
    );
    commit();
    return clone(state.collections[path].find((item) => item.id === id));
  },

  async removeAt(path, id) {
    state.collections[path] = readCollection(path).filter((item) => item.id !== id);
    commit();
  },

  async getAt(path) {
    return clone(state.documents[path] ?? null);
  },

  async setAt(path, data) {
    state.documents[path] = { ...(state.documents[path] ?? {}), ...clone(data) };
    commit();
    return clone(state.documents[path]);
  },
};