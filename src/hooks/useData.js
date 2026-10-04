import { useCallback, useEffect, useState } from 'react';
import {
  watchAdmissions,
  watchAllAssignments,
  watchAssignments,
  watchAttendance,
  watchBlog,
  watchEvents,
  watchFaculty,
  watchMessages,
  watchNews,
  watchPayments,
  watchReceipts,
  watchRegistrations,
  watchStudents,
  watchTeacherMessages,
} from '../lib/api';

/** Subscribes to a Firestore (or demo) collection and re-renders on changes. */
export function useCollection(subscribe, deps = []) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe(setItems);
    return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return items;
}

export const useStudents = () =>
  useCollection(useCallback((cb) => watchStudents(cb), []), []);

export const useFaculty = () => useCollection(useCallback((cb) => watchFaculty(cb), []), []);

export const useEvents = () => useCollection(useCallback((cb) => watchEvents(cb), []), []);

export const useBlog = () => useCollection(useCallback((cb) => watchBlog(cb), []), []);

export const useNews = () => useCollection(useCallback((cb) => watchNews(cb), []), []);

export const useAdmissions = () => useCollection(useCallback((cb) => watchAdmissions(cb), []), []);

export const useMessages = (studentId) =>
  useCollection(useCallback((cb) => watchMessages(studentId, cb), [studentId]), [studentId]);

export const useTeacherMessages = (teacherId) =>
  useCollection(
    useCallback((cb) => watchTeacherMessages(teacherId, cb), [teacherId]),
    [teacherId],
  );

export const useRegistrations = (userId) =>
  useCollection(useCallback((cb) => watchRegistrations(userId, cb), [userId]), [userId]);

export const useAssignments = (studentId, subject) =>
  useCollection(
    useCallback((cb) => watchAssignments(studentId, subject, cb), [studentId, subject]),
    [studentId, subject],
  );

export const useAllAssignments = (studentId) =>
  useCollection(useCallback((cb) => watchAllAssignments(studentId, cb), [studentId]), [studentId]);

export const useAttendance = (studentId) =>
  useCollection(useCallback((cb) => watchAttendance(studentId, cb), [studentId]), [studentId]);

export const usePayments = (studentId) =>
  useCollection(useCallback((cb) => watchPayments(studentId, cb), [studentId]), [studentId]);

export const useReceipts = (studentId) =>
  useCollection(useCallback((cb) => watchReceipts(studentId, cb), [studentId]), [studentId]);