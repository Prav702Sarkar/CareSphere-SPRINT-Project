'use client'

import { useEffect } from 'react'

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = event?.reason?.message || String(event?.reason || '')
      // Suppress browser extension message channel disconnect errors
      if (
        msg.includes('message channel closed before a response was received') ||
        msg.includes('listener indicated an asynchronous response') ||
        msg.includes('The message port closed before a response was received')
      ) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const handleError = (event: ErrorEvent) => {
      const msg = event?.message || ''
      if (
        msg.includes('message channel closed before a response was received') ||
        msg.includes('listener indicated an asynchronous response') ||
        msg.includes('The message port closed before a response was received')
      ) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null
}
