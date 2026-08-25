/**
 * CareSphere Notification Client Service
 * Handles browser notification permissions, service worker registration, and in-app reminders
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    return registration
  } catch (error) {
    console.error('[SW Registration Error]', error)
    return null
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('[Notification Permission Error]', error)
    return 'denied'
  }
}

export async function sendLocalNotification(params: {
  title: string
  body: string
  url?: string
}) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return
  }

  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(params.title, {
        body: params.body,
        icon: '/favicon.ico',
        data: { url: params.url || '/' },
      })
    } else {
      new Notification(params.title, {
        body: params.body,
        icon: '/favicon.ico',
      })
    }
  }
}
