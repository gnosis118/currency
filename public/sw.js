// Service Worker for Currency to Currency App
// Optimized for mobile performance and offline support

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `currency-converter-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // Fallback page
];

// API endpoints to cache with different strategies
const API_CACHE_NAME = `currency-api-${CACHE_VERSION}`;
const API_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Network timeout for mobile (faster timeout for better UX)
const NETWORK_TIMEOUT = 3000; // 3 seconds

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old versions of caches
              return name.startsWith('currency-') && name !== CACHE_NAME && name !== API_CACHE_NAME;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - network strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // API requests - Network First with timeout, then cache
  if (isAPIRequest(url)) {
    event.respondWith(networkFirstWithTimeout(request));
    return;
  }
  
  // Static assets - Cache First
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // HTML pages - Network First, then cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Default - Network First
  event.respondWith(networkFirst(request));
});

// Check if request is to an API endpoint
function isAPIRequest(url) {
  return url.hostname.includes('api.') || 
         url.hostname.includes('exchangerate') ||
         url.hostname.includes('polygon.io') ||
         url.pathname.startsWith('/api/');
}

// Check if request is for a static asset
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|ico)$/);
}

// Cache First strategy - good for static assets
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      // Return cached version immediately
      return cached;
    }
    
    // If not in cache, fetch from network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First strategy - good for HTML pages
async function networkFirst(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    // Fall back to cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // If HTML page, return offline page
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Network First with timeout - optimized for mobile APIs
async function networkFirstWithTimeout(request) {
  try {
    // Race between network request and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT);
    
    try {
      const response = await fetch(request, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      // Cache successful API responses
      if (response.ok) {
        const cache = await caches.open(API_CACHE_NAME);
        
        // Add timestamp to cached response
        const clonedResponse = response.clone();
        const cachedResponse = new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers: new Headers({
            ...Object.fromEntries(clonedResponse.headers.entries()),
            'sw-cache-time': Date.now().toString()
          })
        });
        
        cache.put(request, cachedResponse);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.log('[SW] Network timeout or failed, trying cache:', error.message);
    
    // Fall back to cache
    const cache = await caches.open(API_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      // Check if cache is still fresh
      const cacheTime = cached.headers.get('sw-cache-time');
      if (cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        if (age < API_CACHE_TIME) {
          console.log('[SW] Returning fresh cached API response');
          return cached;
        }
      }
      
      // Return stale cache with warning header
      console.log('[SW] Returning stale cached API response');
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers: new Headers({
          ...Object.fromEntries(cached.headers.entries()),
          'sw-cache-stale': 'true'
        })
      });
    }
    
    return new Response(JSON.stringify({ error: 'Network request failed and no cache available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-rate-alerts') {
    event.waitUntil(syncRateAlerts());
  }
});

async function syncRateAlerts() {
  console.log('[SW] Syncing rate alerts...');
  // Implement your sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Rate alert triggered!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'rate-alert',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Currency Alert', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      })
    );
  }
});