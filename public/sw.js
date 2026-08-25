// HerWell Service Worker for Reminders & Web Push

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})

self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const title = data.title || 'HerWell Health Reminder'
    const options = {
      body: data.body || 'Time for your scheduled health check-in.',
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: {
        url: data.url || '/',
      },
    }

    event.waitUntil(self.registration.showNotification(title, options))
  } catch (err) {
    console.error('[SW Push Error]', err)
  }
})
