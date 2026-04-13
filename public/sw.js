// Service Worker for Reema's Action Tracker (Machli)
const CACHE_VERSION = 'machli-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/icon.svg',
  '/manifest.json',
];

// Install event: pre-cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// Determine the caching strategy based on request type
function getStrategy(request) {
  const url = new URL(request.url);

  // Never cache chrome-extension or non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return 'network-only';
  }

  // API calls and HTML navigation: network-first
  if (
    url.pathname.startsWith('/api/') ||
    request.mode === 'navigate' ||
    request.headers.get('accept')?.includes('text/html')
  ) {
    return 'network-first';
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    return 'cache-first';
  }

  // Default: network-first
  return 'network-first';
}

// Cache-first strategy: try cache, fall back to network
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // For image requests, return a transparent pixel as fallback
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    return caches.match('/offline.html');
  }
}

// Network-first strategy: try network, fall back to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // If it is a navigation request and nothing is cached, show offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }

    return new Response('Network error', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Fetch event: route requests to the appropriate strategy
self.addEventListener('fetch', (event) => {
  const strategy = getStrategy(event.request);

  if (strategy === 'network-only') {
    return;
  }

  if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(event.request));
  }
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
