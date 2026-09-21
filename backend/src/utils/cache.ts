type CacheEntry<T> = { value: T; expiresAt: number };

/**
 * Simple in-memory cache with expiration (TTL).
 * Good enough for a single-instance backend; swap for a shared store
 * (Redis...) if the app ever runs across multiple instances.
 */
export function createTtlCache<T>(ttlMs: number) {
  const store = new Map<string, CacheEntry<T>>();

  return {
    get(key: string): T | undefined {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt < Date.now()) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key: string, value: T): void {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
  };
}
