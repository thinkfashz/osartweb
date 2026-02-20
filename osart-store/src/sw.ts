/// <reference lib="webworker" />

/// <reference lib="webworker" />

const CACHE_NAME = 'osart-v2';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
    '/',
    OFFLINE_URL,
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching offline assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    (self as any).skipWaiting();
});

self.addEventListener('activate', (event: any) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    (self as any).clients.claim();
});

self.addEventListener('fetch', (event: any) => {
    // Basic Stale-while-revalidate strategy for assets
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL) || caches.match('/');
            }) as Promise<Response>
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached response and update in background
                fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, response);
                        });
                    }
                }).catch(() => { /* Ignore background update errors */ });

                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Cache successful responses for future use
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});
