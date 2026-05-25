import { createContext, useContext, useState, type ReactNode } from 'react'
import { getSessionToken } from '../lib/session'

interface SessionContextValue {
  sessionToken: string
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionToken] = useState(() => getSessionToken())

  return (
    <SessionContext.Provider value={{ sessionToken }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
