import React, { createContext, useContext, useState, useCallback } from 'react';
import { BreathingSession } from '../types/breathing';
import { saveSession } from '../utils/storage';

interface SessionContextValue {
  activePatternId: string | null;
  setActivePatternId: (id: string | null) => void;
  completeSession: (session: BreathingSession) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
  activePatternId: null,
  setActivePatternId: () => {},
  completeSession: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activePatternId, setActivePatternId] = useState<string | null>(null);

  const completeSession = useCallback(async (session: BreathingSession) => {
    await saveSession(session);
  }, []);

  return (
    <SessionContext.Provider value={{ activePatternId, setActivePatternId, completeSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
