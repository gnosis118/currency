// Service Worker for Currency Converter App
// Provides offline support and intelligent caching

const CACHE_NAME = 'currency-app-v1';
const API_CACHE = 'currency-api-v1';
const IMAGE_CACHE = 'currency-images-v1';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Add your built JS and CSS files
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Images - Cache first, fallback to network
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Static assets - Cache first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request, CACHE_NAME));
});

// Cache-first strategy
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, cache);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page or default response
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Offline - Using cached data' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Background fetch and cache update
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response);
    }
  } catch (error) {
    // Silently fail - we already returned cached version
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-rates') {
    event.waitUntil(syncRates());
  }
});

// Sync exchange rates when connection is restored
async function syncRates() {
  try {
    const response = await fetch('/api/rates/all');
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      await cache.put('/api/rates/all', response);
      
      // Notify clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'RATES_UPDATED',
          timestamp: Date.now()
        });
      });
    }
  } catch (error) {
    console.error('Failed to sync rates:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Rate alert!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Currency Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync for rates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-rates') {
    event.waitUntil(updateRatesInBackground());
  }
});

async function updateRatesInBackground() {
  const cache = await caches.open(API_CACHE);
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  
  for (const from of currencies) {
    for (const to of currencies) {
      if (from !== to) {
        try {
          const response = await fetch(`/api/rates?from=${from}&to=${to}`);
          if (response.ok) {
            await cache.put(`/api/rates?from=${from}&to=${to}`, response);
          }
        } catch (error) {
          // Continue with next pair
        }
      }
    }
  }
}
