'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { 
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'

export default function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themes = [
    { value: 'light', label: 'Clair', icon: SunIcon },
    { value: 'dark', label: 'Sombre', icon: MoonIcon },
    { value: 'system', label: 'Système', icon: ComputerDesktopIcon }
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Thème"
      >
        <currentTheme.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value as 'light' | 'dark' | 'system')
                setIsOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === themeOption.value ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <themeOption.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{themeOption.label}</span>
              {theme === themeOption.value && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
