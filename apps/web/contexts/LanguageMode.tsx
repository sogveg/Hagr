'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
type ReactNode = React.ReactNode

export type LangMode = 'enkel' | 'pro'

interface LanguageModeContextType {
  mode: LangMode
  setMode: (m: LangMode) => void
  /** Pick between simple and pro text */
  t: (simple: string, pro: string) => string
}

const LanguageModeContext = createContext<LanguageModeContextType>({
  mode: 'enkel',
  setMode: () => {},
  t: (simple) => simple,
})

const STORAGE_KEY = 'skattesmart-lang-mode'

export function LanguageModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LangMode>('enkel')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'enkel' || stored === 'pro') setModeState(stored)
  }, [])

  function setMode(m: LangMode) {
    setModeState(m)
    localStorage.setItem(STORAGE_KEY, m)
  }

  function t(simple: string, pro: string) {
    return mode === 'pro' ? pro : simple
  }

  return (
    <LanguageModeContext.Provider value={{ mode, setMode, t }}>
      {children}
    </LanguageModeContext.Provider>
  )
}

export function useLanguageMode() {
  return useContext(LanguageModeContext)
}
