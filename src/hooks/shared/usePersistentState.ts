import { useCallback, useMemo, useSyncExternalStore } from 'react';

const listeners = new Map<string, Set<() => void>>();

const notify = (key: string) => listeners.get(key)?.forEach((listener) => listener());

const readRaw = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeRaw = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
  notify(key);
};

const parse = <T,>(raw: string | null, fallback: T): T => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const usePersistentState = <T,>(key: string, defaultValue: T) => {
  const subscribe = useCallback((listener: () => void) => {
    const keyListeners = listeners.get(key) ?? new Set();
    keyListeners.add(listener);
    listeners.set(key, keyListeners);

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      keyListeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  }, [key]);

  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo(() => parse(raw, defaultValue), [raw, defaultValue]);

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const prev = parse(readRaw(key), defaultValue);
    const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
    writeRaw(key, JSON.stringify(resolved));
  }, [key, defaultValue]);

  return [value, setValue] as const;
};

export default usePersistentState;
