import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

const withId = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const firebaseBackend = {
  async listAt(path) {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(withId);
  },

  watchAt(path, callback) {
    return onSnapshot(collection(db, path), (snapshot) => callback(snapshot.docs.map(withId)));
  },

  async createAt(path, data) {
    const created = await addDoc(collection(db, path), data);
    return { id: created.id, ...data };
  },

  async updateAt(path, id, patch) {
    await updateDoc(doc(db, path, id), patch);
    return { id, ...patch };
  },

  async removeAt(path, id) {
    await deleteDoc(doc(db, path, id));
  },

  async getAt(path) {
    const snapshot = await getDoc(doc(db, path));
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  async setAt(path, data) {
    await setDoc(doc(db, path), data, { merge: true });
    return data;
  },
};