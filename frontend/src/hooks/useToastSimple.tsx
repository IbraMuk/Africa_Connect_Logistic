'use client'

import { useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface SimpleToast {
  id: string
  type: ToastType
  message: string
}

let globalToasts: SimpleToast[] = []
let listeners: (() => void)[] = []

function emitChange() {
  listeners.forEach(listener => listener())
}

export function useToastSimple() {
  const [, forceUpdate] = useState({})

  const addToast = (type: ToastType, message: string) => {
    const id = Date.now().toString()
    globalToasts.push({ id, type, message })
    emitChange()
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    globalToasts = globalToasts.filter(toast => toast.id !== id)
    emitChange()
  }

  const success = (message: string) => addToast('success', message)
  const error = (message: string) => addToast('error', message)
  const warning = (message: string) => addToast('warning', message)
  const info = (message: string) => addToast('info', message)

  // Subscribe to changes
  useState(() => {
    const listener = () => forceUpdate({})
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  })

  return {
    toasts: globalToasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

// Simple toast component
export function SimpleToast({ type, message, onClose }: { type: ToastType; message: string; onClose: () => void }) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
      <span className="text-xl">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-75">
        ✕
      </button>
    </div>
  )
}

export function SimpleToastContainer() {
  const { toasts, removeToast } = useToastSimple()

  return (
    <>
      {toasts.map((toast) => (
        <SimpleToast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}
