'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from './types';
import { initialTasks } from './data';

function deserializeTasks(raw: Task[]): Task[] {
  return raw.map((t) => ({
    ...t,
    deadlineDate: t.deadlineDate ? new Date(t.deadlineDate) : null,
  }));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  // Load tasks: try API first, fall back to localStorage, then seed defaults
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/tasks');
        const { tasks: remoteTasks } = await res.json();
        if (remoteTasks && Array.isArray(remoteTasks) && remoteTasks.length > 0) {
          const deserialized = deserializeTasks(remoteTasks);
          setTasks(deserialized);
          localStorage.setItem('reema-tasks', JSON.stringify(deserialized));
          setLoading(false);
          isInitialLoad.current = false;
          return;
        }
      } catch {
        // API unavailable — try localStorage
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('reema-tasks');
      if (stored) {
        try {
          const parsed = deserializeTasks(JSON.parse(stored));
          setTasks(parsed);
          setLoading(false);
          isInitialLoad.current = false;
          return;
        } catch { /* corrupted */ }
      }

      // Seed with defaults
      setTasks(initialTasks);
      localStorage.setItem('reema-tasks', JSON.stringify(initialTasks));
      setLoading(false);
      isInitialLoad.current = false;
    }
    load();
  }, []);

  // Persist to both localStorage (instant) and API (debounced)
  const persist = useCallback((updated: Task[]) => {
    localStorage.setItem('reema-tasks', JSON.stringify(updated));

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updated }),
      }).catch(() => {
        // Silently fail — localStorage is the fallback
      });
    }, 800);
  }, []);

  const updateTasks = useCallback(
    (updater: Task[] | ((prev: Task[]) => Task[])) => {
      setTasks((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { tasks, updateTasks, loading };
}
