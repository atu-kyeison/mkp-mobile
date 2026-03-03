import { backendConfig } from './config';

type AuthSession = {
  idToken: string;
  refreshToken: string;
  uid: string;
  email: string;
  displayName?: string | null;
};

type SessionContext = {
  uid: string;
  email: string | null;
  displayName: string | null;
  preferredLanguage: string;
  currentChurchId: string | null;
  churchName: string | null;
  role: string | null;
  communicationPreferences: {
    churchMessagesEnabled: boolean;
    careReplyNotificationsEnabled: boolean;
    formationNotificationsEnabled: boolean;
  };
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const getErrorMessage = async (response: Response) => {
  try {
    const body = await response.json();
    if (body?.error?.message) return body.error.message;
    if (body?.error?.status) return body.error.status;
  } catch {
    // Ignore JSON parsing failure and fall back to status text.
  }
  return response.statusText || 'Request failed.';
};

async function postJson<T>(
  url: string,
  body: unknown,
  idToken?: string
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...jsonHeaders,
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as T;
}

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthSession> {
  const authResponse = await postJson<{
    idToken: string;
    refreshToken: string;
    localId: string;
    email: string;
  }>(
    `${backendConfig.authBaseUrl}/accounts:signUp?key=${backendConfig.apiKey}`,
    {
      email: params.email,
      password: params.password,
      returnSecureToken: true,
    }
  );

  await postJson(
    `${backendConfig.authBaseUrl}/accounts:update?key=${backendConfig.apiKey}`,
    {
      idToken: authResponse.idToken,
      displayName: params.displayName,
      returnSecureToken: false,
    }
  );

  return {
    idToken: authResponse.idToken,
    refreshToken: authResponse.refreshToken,
    uid: authResponse.localId,
    email: authResponse.email,
    displayName: params.displayName,
  };
}

export async function signInWithEmail(params: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const authResponse = await postJson<{
    idToken: string;
    refreshToken: string;
    localId: string;
    email: string;
    displayName?: string;
  }>(
    `${backendConfig.authBaseUrl}/accounts:signInWithPassword?key=${backendConfig.apiKey}`,
    {
      email: params.email,
      password: params.password,
      returnSecureToken: true,
    }
  );

  return {
    idToken: authResponse.idToken,
    refreshToken: authResponse.refreshToken,
    uid: authResponse.localId,
    email: authResponse.email,
    displayName: authResponse.displayName,
  };
}

export async function refreshAuthSession(refreshToken: string): Promise<{
  idToken: string;
  refreshToken: string;
}> {
  const response = await fetch(
    `${backendConfig.secureTokenBaseUrl}/token?key=${backendConfig.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const body = (await response.json()) as {
    id_token: string;
    refresh_token: string;
  };

  return {
    idToken: body.id_token,
    refreshToken: body.refresh_token,
  };
}

export async function fetchSessionContext(idToken: string): Promise<SessionContext> {
  const body = await postJson<{ result: SessionContext } | SessionContext>(
    `${backendConfig.functionsBaseUrl}/getSessionContext`,
    { data: {} },
    idToken
  );
  return 'result' in body ? body.result : body;
}

export async function callBackendFunction<T>(
  functionName: string,
  data: unknown,
  idToken: string
): Promise<T> {
  const body = await postJson<{ result: T } | T>(
    `${backendConfig.functionsBaseUrl}/${functionName}`,
    { data },
    idToken
  );
  if (typeof body === 'object' && body !== null && 'result' in body) {
    return body.result;
  }
  return body as T;
}

export type { AuthSession, SessionContext };
