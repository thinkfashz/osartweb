export const STORE_NAME = 'osart_store';
export const DB_NAME = 'osart_db';
export const DB_VERSION = 1;

/**
 * Creates or opens the IndexedDB instance for OSART.
 */
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        // SSR guard
        if (typeof window === 'undefined') {
            return reject(new Error('IndexedDB is not available on the server'));
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

/**
 * Retrieves a value from IndexedDB.
 */
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result as T | null);
        });
    } catch (error) {
        console.warn(`[storage] getCache failed for ${key}:`, error);
        return null;
    }
}

/**
 * Saves a value to IndexedDB.
 */
export async function setCache(key: string, value: any): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.put(value, key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    } catch (error) {
        console.warn(`[storage] setCache failed for ${key}:`, error);
    }
}

/**
 * Removes a specific key from IndexedDB.
 */
export async function removeCache(key: string): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    } catch (error) {
        console.warn(`[storage] removeCache failed for ${key}:`, error);
    }
}

/**
 * Clears the entire IndexedDB store.
 */
export async function clearCache(): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    } catch (error) {
        console.warn('[storage] clearCache failed:', error);
    }
}
