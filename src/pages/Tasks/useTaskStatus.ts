import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Task } from './task';

export function useTaskStatus() {
  const [taskStatus, setTaskStatus] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const telegramUserId = localStorage.getItem('telegramUserId');
        if (!telegramUserId) {
          setError('User ID not found. Please login again.');
          setTaskStatus([]);
          return;
        }

        const userDocRef = doc(db, 'users', telegramUserId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setTaskStatus(userData.tasks || []);
        } else {
          setError('User document not found.');
          setTaskStatus([]);
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        setTaskStatus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [db]);

  return { taskStatus, setTaskStatus, loading, error };
}