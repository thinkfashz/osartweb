console.log('[SW] Initializing OSART Service Worker v6...');
const CACHE_NAME = 'osart-v6';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
    '/',
    OFFLINE_URL,
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching v6 assets (Resilience Mode)');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Purging stale cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Bypass SW for development-internal traffic and extensions
    if (
        (url.protocol !== 'http:' && url.protocol !== 'https:') ||
        url.pathname.includes('_next/webpack-hmr') ||
        url.pathname.includes('_next/static') || // Skip static chunks to avoid Turbopack mismatch
        url.pathname.includes('chrome-extension') ||
        event.request.method !== 'GET'
    ) {
        return;
    }

    // Navigation: Network-first with offline fallback
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch((err) => {
                console.warn('[SW] Navigation fetch failed, serving offline page:', err);
                return caches.match(OFFLINE_URL) || caches.match('/');
            })
        );
        return;
    }

    // Assets: Stale-While-Revalidate with synthetic fallback
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch((err) => {
                    // Silence "Failed to fetch" noise in console
                    return new Response('Offline/Blocked', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'text/plain' }
                    });
                });

            return cachedResponse || fetchPromise;
        })
    );
});
