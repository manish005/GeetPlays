// GeetPlays service worker — offline cache for app shell + covers + track data
const VERSION = 'gp-v1'
const SHELL = ['/', '/index.html']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // Cache-first for album covers (picsum) — songs play offline via synth engine
  if (url.hostname.includes('picsum.photos')) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(res => {
          const copy = res.clone()
          caches.open(VERSION).then(c => c.put(request, copy))
          return res
        })
      })
    )
    return
  }

  // Network-first for navigation / app shell, fallback to cache offline
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('/index.html')))
  }
})
