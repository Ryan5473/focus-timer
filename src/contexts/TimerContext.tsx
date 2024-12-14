'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface TimerSettings {
  focusTime: number
  shortBreakTime: number
  longBreakTime: number
  breakType: 'short' | 'long'
}

interface TimerContextType {
  settings: TimerSettings
  updateSettings: (newSettings: Partial<TimerSettings>) => void
}

const defaultSettings: TimerSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  breakType: 'short',
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('pomodoroSettings')
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }))
  }

  return (
    <TimerContext.Provider value={{ settings, updateSettings }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimerContext = () => {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider')
  }
  return context
}

