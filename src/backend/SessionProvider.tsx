import React, { createContext, useContext, useEffect, useState } from 'react';
import { persistSetting, Settings } from '../storage/deviceSettings';
import {
  AuthSession,
  SessionContext,
  callBackendFunction,
  fetchSessionContext,
  refreshAuthSession,
  signInWithEmail,
  signUpWithEmail,
} from './client';
import {
  setChurchMessagesPreference,
  setEncouragementPreference,
  setReminderPreference,
} from '../storage/communicationPrefsStore';

const SESSION_KEY = 'mkp.backend.session';

type StoredSession = AuthSession & {
  context?: SessionContext;
};

type SessionState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  session: StoredSession | null;
};

type SessionContextValue = SessionState & {
  signIn: (params: { email: string; password: string }) => Promise<SessionContext>;
  signUp: (params: { email: string; password: string; displayName: string }) => Promise<SessionContext>;
  joinChurch: (params: { churchId: string; joinCode: string }) => Promise<{
    churchId: string;
    churchName: string;
    role: string;
  }>;
  refreshSessionContext: () => Promise<void>;
  signOut: () => void;
  callFunction: <T>(functionName: string, data: unknown) => Promise<T>;
};

const SessionContextObject = createContext<SessionContextValue | null>(null);
const SESSION_TIMEOUT_MS = 8000;

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = SESSION_TIMEOUT_MS) => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error('Session restore timed out.'));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
};

const parseStoredSession = (): StoredSession | null => {
  const raw = Settings.get(SESSION_KEY);
  if (typeof raw !== 'string' || !raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
};

const persistSession = async (session: StoredSession | null) => {
  if (!session) {
    await persistSetting(SESSION_KEY, '');
    return;
  }
  await persistSetting(SESSION_KEY, JSON.stringify(session));
};

const persistChurchSettings = (context?: SessionContext) => {
  Settings.set({
    'mkp.connectedChurchName': context?.churchName || '',
  });
  if (context?.communicationPreferences) {
    setChurchMessagesPreference(context.communicationPreferences.churchMessagesEnabled);
    setEncouragementPreference(context.communicationPreferences.careReplyNotificationsEnabled);
    setReminderPreference(context.communicationPreferences.formationNotificationsEnabled);
  }
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<SessionState>({
    isLoading: true,
    isAuthenticated: false,
    session: null,
  });

  const loadSessionContext = async (session: StoredSession) => {
    const context = await fetchSessionContext(session.idToken);
    const next = { ...session, context };
    await persistSession(next);
    persistChurchSettings(context);
    setState({
      isLoading: false,
      isAuthenticated: true,
      session: next,
    });
    return context;
  };

  useEffect(() => {
    const restore = async () => {
      const stored = parseStoredSession();
      if (!stored) {
        setState({ isLoading: false, isAuthenticated: false, session: null });
        return;
      }

      try {
        await withTimeout(loadSessionContext(stored));
      } catch {
        try {
          const refreshed = await withTimeout(refreshAuthSession(stored.refreshToken));
          await withTimeout(loadSessionContext({
            ...stored,
            idToken: refreshed.idToken,
            refreshToken: refreshed.refreshToken,
          }));
        } catch {
          await persistSession(null);
          setState({ isLoading: false, isAuthenticated: false, session: null });
        }
      }
    };

    restore();
  }, []);

  const signIn = async (params: { email: string; password: string }) => {
    const session = await signInWithEmail(params);
    await persistSession(session);
    return loadSessionContext(session);
  };

  const signUp = async (params: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    const session = await signUpWithEmail(params);
    await persistSession(session);
    return loadSessionContext(session);
  };

  const callFunction = async <T,>(functionName: string, data: unknown): Promise<T> => {
    const session = parseStoredSession();
    if (!session?.idToken) {
      throw new Error('You must be signed in.');
    }
    return callBackendFunction<T>(functionName, data, session.idToken);
  };

  const refreshSessionContext = async () => {
    const session = parseStoredSession();
    if (!session) return;
    await loadSessionContext(session);
  };

  const joinChurch = async (params: { churchId: string; joinCode: string }) => {
    const result = await callFunction<{
      churchId: string;
      churchName: string;
      role: string;
    }>('joinChurch', params);
    await refreshSessionContext();
    return result;
  };

  const signOut = () => {
    void persistSession(null);
    Settings.set({
      'mkp.connectedChurchName': '',
      'mkp.connectedChurchLogoUri': '',
    });
    setState({ isLoading: false, isAuthenticated: false, session: null });
  };

  return (
    <SessionContextObject.Provider
      value={{
        ...state,
        signIn,
        signUp,
        joinChurch,
        refreshSessionContext,
        signOut,
        callFunction,
      }}
    >
      {children}
    </SessionContextObject.Provider>
  );
};

export const useSession = () => {
  const value = useContext(SessionContextObject);
  if (!value) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return value;
};
